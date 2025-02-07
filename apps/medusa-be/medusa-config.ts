import {loadEnv, defineConfig} from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || "";
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || "";

module.exports = defineConfig({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        http: {
            storeCors: process.env.STORE_CORS!,
            adminCors: process.env.ADMIN_CORS!,
            authCors: process.env.AUTH_CORS!,
            jwtSecret: process.env.JWT_SECRET || "supersecret",
            cookieSecret: process.env.COOKIE_SECRET || "supersecret",
        },
        redisUrl: REDIS_URL,
    },
    plugins: [
        {
            resolve: '@rokmohar/medusa-plugin-meilisearch',
            options: {
                config: {
                    host: MEILISEARCH_HOST,
                    apiKey: MEILISEARCH_API_KEY
                },
                settings: {
                    products: {
                        indexSettings: {
                            searchableAttributes: ['title', 'description', 'variant_sku'],
                            displayedAttributes: ['id', 'title', 'description', 'variant_sku', 'thumbnail', 'handle'],
                        },
                        primaryKey: 'id',
                    },
                },
            },
        },
    ],
    modules: [
        {
            resolve: "@medusajs/medusa/cache-redis",
            options: {
                redisUrl: process.env.CACHE_REDIS_URL,
            },
        },
        {
            resolve: "@medusajs/event-bus-redis",
            key: 'event-bus-redis',
            options: {
                redisUrl: process.env.EVENTS_REDIS_URL,
            },
        },
        {
            resolve: "@medusajs/medusa/file",
            options: {
                providers: [
                    {
                        resolve: "@medusajs/medusa/file-s3",
                        id: "s3",
                        options: {
                            endpoint: process.env.MINIO_ENDPOINT,
                            bucket: process.env.MINIO_BUCKET,
                            access_key_id: process.env.MINIO_ACCESS_KEY,
                            secret_access_key: process.env.MINIO_SECRET_KEY,

                            file_url: process.env.MINIO_FILE_URL,
                            region: process.env.MINIO_REGION,
                            additional_client_config: {
                                forcePathStyle: true,
                            },
                        },
                    },
                ],
            },
        },
        {
            resolve: "./src/modules/data-layer",
        },
    ],
})
