import {validateAndTransformQuery} from "@medusajs/framework"
import {MiddlewareRoute,} from "@medusajs/framework/http"
import {StoreProducersSchema} from "./route";
import {StoreProducersDetailSchema} from "./[id]/route";
import {StoreProducersDetailProductsSchema} from "./[id]/products/route";
import {listProductQueryConfig} from "@medusajs/medusa/api/store/products/query-config"

export const storeProducersRoutesMiddlewares: MiddlewareRoute[] = [
    {
        methods: ['GET'],
        matcher: '/store/producers',
        middlewares: [validateAndTransformQuery(StoreProducersSchema, {
            defaults: ['id', 'title', 'handle'],
            allowed: ['id', 'title', 'handle'],
            isList: true,
        })],
    },
    {
        methods: ['GET'],
        matcher: '/store/producers/:id',
        middlewares: [validateAndTransformQuery(StoreProducersDetailSchema, {
            defaults: ['id', 'title', 'handle', 'attributes.attributeType.name', 'attributes.value'],
            allowed: ['id', 'title', 'handle', 'attributes.attributeType.name', 'attributes.value'],
            isList: false,
        })],
    },
    {
        methods: ['GET'],
        matcher: '/store/producers/:id/products',
        middlewares: [validateAndTransformQuery(StoreProducersDetailProductsSchema, {
            defaults: ['id', 'title', 'handle', 'thumbnail'],
            allowed: listProductQueryConfig.defaults,
            isList: true,
        })],
    },
]