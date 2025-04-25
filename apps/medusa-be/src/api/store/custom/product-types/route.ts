import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    // Extract query parameters
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    // Mock response
    res.json({
      product_types: [],
      count: 0,
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
