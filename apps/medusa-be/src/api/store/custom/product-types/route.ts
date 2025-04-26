import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    // Extract query parameters

    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const productService = req.scope.resolve(Modules.PRODUCT);
    const productTypes = await productService.listProductTypes();

    res.json({
      product_types: productTypes,
      count: productTypes.length,
      offset: offset,
      limit: limit,
    });
  } catch (error) {
    console.error("Product Types API error:", error);
    res.json({
      product_types: [],
      count: 0,
      offset: 0,
      limit: 100,
    });
  }
};
