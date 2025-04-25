import { refetchProductType } from '../helpers';
import { AdminGetProductTypeParamsType } from '../validators';
import { ProductTypeDTO } from '@medusajs/framework/types';
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from '@medusajs/framework';

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductTypeParamsType>,
  res: MedusaResponse
) => {
  const productType = await refetchProductType(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields as (keyof ProductTypeDTO)[],
  );

  res.status(200).json({ product_type: productType });
};
