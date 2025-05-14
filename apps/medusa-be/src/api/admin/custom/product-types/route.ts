import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const productService = req.scope.resolve(Modules.PRODUCT);
  const productTypes = await productService.listProductTypes();

  res.json({
    product_types: productTypes,
    count: productTypes.length,
  });
};
