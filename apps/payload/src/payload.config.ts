import { postgresAdapter } from '@payloadcms/db-postgres'
import { cs } from '@payloadcms/translations/languages/cs'
import { en } from '@payloadcms/translations/languages/en'
import { sk } from '@payloadcms/translations/languages/sk'
import { pl } from '@payloadcms/translations/languages/pl'
import { hu } from '@payloadcms/translations/languages/hu'
import { ro } from '@payloadcms/translations/languages/ro'
import { sl } from '@payloadcms/translations/languages/sl'
import { de } from '@payloadcms/translations/languages/de'
import { fr } from '@payloadcms/translations/languages/fr'
import { es } from '@payloadcms/translations/languages/es'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { autoTranslate } from '@pigment/auto-translate'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { ArticleCategories } from './collections/ArticleCategories'
import { PageCategories } from './collections/PageCategories'
import { HeroCarousels } from './collections/HeroCarousels'
import { Pages } from './collections/Pages'
import { isEnabled, parseEnvList } from './lib/env'
import { medusaSsoPostEndpoint } from './lib/endpoints/medusa-sso'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envLocales = parseEnvList('PAYLOAD_LOCALES')
const defaultLocale = envLocales[0]
const isArticlesEnabled = isEnabled('FEATURE_PAYLOAD_ARTICLES_ENABLED')
const isPagesEnabled = isEnabled('FEATURE_PAYLOAD_PAGES_ENABLED')
const isHeroCarouselsEnabled = isEnabled('FEATURE_PAYLOAD_HERO_CAROUSELS_ENABLED')
const seoCollections = getSeoCollections({
  isArticlesEnabled,
  isPagesEnabled,
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  endpoints: [medusaSsoPostEndpoint],
  routes: {
    admin: '/',
  },
  i18n: {
    fallbackLanguage: 'en',
    supportedLanguages: { en, cs, sk, pl, hu, ro, sl, de, fr, es },
  },
  localization: {
    locales: envLocales,
    defaultLocale,
  },
  collections: [
    Users,
    Media,
    ...(isArticlesEnabled ? [ArticleCategories, Articles] : []),
    ...(isPagesEnabled ? [PageCategories, Pages] : []),
    ...(isHeroCarouselsEnabled ? [HeroCarousels] : []),
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    schemaName: process.env.PAYLOAD_SCHEMA_NAME,
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: seoCollections,
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => getDocString(doc?.title),
      generateDescription: ({ doc }) =>
        getDocString(doc?.excerpt) || getDocString(doc?.description),
    }),
    autoTranslate({
      excludeFields: [
        'id',
        '_id',
        'createdAt',
        'updatedAt',
        'status',
        'author',
        'featuredImage',
        'readingTime',
        'analytics',
        'image',
      ],
      collections: {
        articles: isArticlesEnabled,
        pages: isPagesEnabled,
        'hero-carousels': isHeroCarouselsEnabled,
      },
      enableTranslationSyncByDefault: true,
      translationExclusionsSlug: 'translation-exclusions',
      enableExclusions: true,
    }),
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT || '',
        region: process.env.S3_REGION || '',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
