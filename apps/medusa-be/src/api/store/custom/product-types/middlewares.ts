import * as QueryConfig from './query-config';
import {
  MiddlewareRoute,
  validateAndTransformQuery,
} from '@medusajs/framework/http';
import {
  AdminGetProductTypeParams,
  AdminGetProductTypesParams,
} from './validators';

export const adminProductTypeRoutesMiddlewares: MiddlewareRoute[] = [
  {
    method: ['GET'],
    matcher: '/store/custom/product-types',
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTypesParams,
        QueryConfig.listProductTypesTransformQueryConfig,
      ),
    ],
  },
  {
    method: ['GET'],
    matcher: '/store/custom/product-types/:id',
    middlewares: [
      validateAndTransformQuery(
        AdminGetProductTypeParams,
        QueryConfig.retrieveProductTypeTransformQueryConfig,
      ),
    ],
  },
];
