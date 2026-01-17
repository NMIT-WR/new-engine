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
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { ArticleCategories } from './collections/ArticleCategories'
import { PageCategories } from './collections/PageCategories'
import { HeroCarousels } from './collections/HeroCarousels'
import { Pages } from './collections/Pages'
import { isEnabled, parseEnvList } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const envLocales = parseEnvList('PAYLOAD_LOCALES')
const defaultLocale = envLocales[0]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
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
    ...(isEnabled('FEATURE_PAYLOAD_ARTICLES_ENABLED') ? [ArticleCategories, Articles] : []),
    ...(isEnabled('FEATURE_PAYLOAD_PAGES_ENABLED') ? [PageCategories, Pages] : []),
    ...(isEnabled('FEATURE_PAYLOAD_HERO_CAROUSELS_ENABLED') ? [HeroCarousels] : []),
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
  }),
  sharp,
  plugins: [
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
