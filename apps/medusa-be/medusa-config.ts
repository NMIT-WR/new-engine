import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"
const MEILISEARCH_HOST = process.env.MEILISEARCH_HOST || ""
const MEILISEARCH_API_KEY = process.env.MEILISEARCH_API_KEY || ""
const PPL_ENABLED = process.env.PPL_ENABLED === "1"

module.exports = defineConfig({
  featureFlags: {
    index_engine: true,
    caching: true,
    backend_hmr: true,
  },
  admin: {
    // backendUrl: BACKEND_URL,
    vite: () => ({
      server: {
        allowedHosts: process.env.MEDUSA_BACKEND_URL,
        hmr: false,
      },
    }),
  },
  projectConfig: {
    // databaseLogging: [
    //     'query'
    // ],
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS ?? "",
      adminCors: process.env.ADMIN_CORS ?? "",
      authCors: process.env.AUTH_CORS ?? "",
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    redisUrl: REDIS_URL,
  },
  plugins: [
    {
      resolve: "@medusajs/draft-order",
      options: {},
    },
    {
      resolve: "@rokmohar/medusa-plugin-meilisearch",
      options: {
        config: {
          host: MEILISEARCH_HOST,
          apiKey: MEILISEARCH_API_KEY,
        },
        settings: {
          products: {
            type: "products",
            enabled: true,
            fields: [
              "id",
              "title",
              "description",
              "handle",
              "variant_sku",
              "thumbnail",
            ],
            indexSettings: {
              searchableAttributes: ["title", "description", "variant_sku"],
              displayedAttributes: [
                "id",
                "title",
                "description",
                "variant_sku",
                "thumbnail",
                "handle",
              ],
              filterableAttributes: ["id", "handle", "title"],
            },
            primaryKey: "id",
          },
          categories: {
            type: "categories",
            enabled: true,
            fields: ["id", "description", "handle"],
            indexSettings: {
              searchableAttributes: ["description"],
              displayedAttributes: ["id", "description", "handle"],
              filterableAttributes: ["id", "handle", "description"],
            },
            primaryKey: "id",
          },
          producers: {
            type: "producers",
            enabled: true,
            fields: ["id", "title", "handle"],
            indexSettings: {
              searchableAttributes: ["title", "handle"],
              displayedAttributes: ["id", "title", "handle"],
              filterableAttributes: ["id", "title", "handle"],
            },
            primaryKey: "id",
          },
        },
      },
    },
  ],
  modules: [
    {
      resolve: "@medusajs/medusa/caching",
      options: {
        providers: [
          {
            resolve: "@medusajs/caching-redis",
            id: "caching-redis",
            is_default: true,
            options: {
              redisUrl: process.env.CACHE_REDIS_URL,
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/producer",
    },
    {
      resolve: "@medusajs/event-bus-redis",
      key: "event_bus_redis",
      options: {
        redisUrl: process.env.EVENTS_REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.WE_REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.WE_REDIS_URL,
            },
          },
        ],
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
              file_url: process.env.MINIO_FILE_URL,
              endpoint: process.env.MINIO_ENDPOINT,
              bucket: process.env.MINIO_BUCKET,
              access_key_id: process.env.MINIO_ACCESS_KEY,
              secret_access_key: process.env.MINIO_SECRET_KEY,
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
      resolve: "@medusajs/index",
    },
    {
      resolve: "./src/modules/data-layer",
    },
    {
      resolve: "./src/modules/database",
    },
    // PPL Client Module - standalone module managing API client + caching
    ...(PPL_ENABLED
      ? [
          {
            resolve: "./src/modules/ppl-client",
            dependencies: [Modules.LOCKING],
            options: {
              client_id: process.env.PPL_CLIENT_ID,
              client_secret: process.env.PPL_CLIENT_SECRET,
              environment: process.env.PPL_ENVIRONMENT || "testing",
              default_label_format: "Png",
              // COD bank details (choose one method):
              // Method 1: Czech bank account
              cod_bank_account: process.env.PPL_COD_BANK_ACCOUNT,
              cod_bank_code: process.env.PPL_COD_BANK_CODE,
              // Method 2: IBAN (international) - uncomment if using IBAN
              // cod_iban: process.env.PPL_COD_IBAN,
              // cod_swift: process.env.PPL_COD_SWIFT,
              // Fallback sender address (used when PPL customer has no address configured)
              sender_name: process.env.COMPANY_ADDRESS_NAME,
              sender_street: process.env.COMPANY_ADDRESS_STREET,
              sender_city: process.env.COMPANY_ADDRESS_CITY,
              sender_zip_code: process.env.COMPANY_ADDRESS_ZIP_CODE,
              sender_country: process.env.COMPANY_ADDRESS_COUNTRY,
              sender_phone: process.env.COMPANY_ADDRESS_PHONE,
              sender_email: process.env.COMPANY_ADDRESS_EMAIL,
            },
          },
        ]
      : []),
    // PPL Fulfillment Provider - thin provider delegating to ppl-client
    ...(PPL_ENABLED
      ? [
          {
            resolve: "@medusajs/medusa/fulfillment",
            dependencies: ["ppl_client"],
            options: {
              providers: [
                {
                  resolve: "./src/modules/fulfillment-ppl",
                  id: "ppl",
                },
              ],
            },
          },
        ]
      : []),
  ],
})
