import { sdk } from "@lib/config"
import { HttpTypes, PaginatedResponse } from "@medusajs/types"

export const getProductTypesList = async function (
    offset: number = 0,
    limit: number = 100,
    fields?: (keyof HttpTypes.StoreProductType)[]
): Promise<{ productTypes: HttpTypes.StoreProductType[]; count: number }> {
    try {
        return await sdk.client
            .fetch<
                PaginatedResponse<{
                    product_types: HttpTypes.StoreProductType[]
                    count: number
                }>
            >("/store/custom/product-types", {
                query: { limit, offset, fields: fields ? fields.join(",") : undefined },
                next: { tags: ["product-types"] },
                cache: "force-cache",
            })
            .then(({ product_types, count }) => ({
                productTypes: product_types,
                count,
            }))
    } catch (error: any) {
        if (
            process.env.NODE_ENV === "development" &&
            (error.status === 404 || error.message?.includes("fetch failed"))
        ) {
            console.warn(
                "Using mock product types - endpoint /store/custom/product-types not found"
            )
            const mockProductTypes: HttpTypes.StoreProductType[] = [
                {
                    id: "sofa",
                    value: "Sofas",
                    metadata: {
                        image: {
                            url: "/images/content/gray-sofa-against-concrete-wall.png",
                        },
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                {
                    id: "chair",
                    value: "Chairs",
                    metadata: {
                        image: {
                            url: "/images/content/living-room-gray-armchair-two-seater-sofa.png",
                        },
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
            ]

            return {
                productTypes: mockProductTypes,
                count: mockProductTypes.length,
            }
        }
        throw error
    }
}

export const getProductTypeByHandle = async function (
    handle: string
): Promise<HttpTypes.StoreProductType> {
    try {
        return await sdk.client
            .fetch<
                PaginatedResponse<{
                    product_types: HttpTypes.StoreProductType[]
                    count: number
                }>
            >("/store/custom/product-types", {
                query: { handle, limit: 1 },
                next: { tags: ["product-types"] },
                cache: "force-cache",
            })
            .then(({ product_types }) => product_types[0])
    } catch (error: any) {
        if (
            process.env.NODE_ENV === "development" &&
            (error.status === 404 || error.message?.includes("fetch failed"))
        ) {
            return {
                id: handle,
                value: handle.charAt(0).toUpperCase() + handle.slice(1),
                metadata: {
                    image: { url: "/images/content/gray-sofa-against-concrete-wall.png" },
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        }

        throw error
    }
}