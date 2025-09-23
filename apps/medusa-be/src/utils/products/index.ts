import * as Steps from "../../workflows/seed/steps";

export function toCreateProductsStepInput(products: any): Steps.CreateProductsStepInput {
    return products.map(((raw: any) => {
        const i = {
            ...raw,
            images: JSON.parse(raw.images),
            variants: JSON.parse(raw.variants),
            options: JSON.parse(raw.options),
            categories: JSON.parse(raw.categories),
            producer: JSON.parse(raw.producer),
        }

        const options = i.options.map((o: any) => {
            return {
                title: o.title ?? 'Variant',
                values: o.option_values ?? ['Default'],
            }
        })

        const variants = i.variants.filter((f: any) => f.sku !== null).map((v: any) => {
            return {
                title: v.title ?? undefined,
                sku: v.sku ?? undefined,
                ean: v.ean ?? undefined,
                material: v.material ?? undefined,
                collection: v.collection ?? undefined,
                options: v.options?.Variant === null ? {"Variant": 'Default'} : v.options,
                prices: v.prices,
                images: (v.images ?? []).filter((im: { url?: string }) => im?.url !== null),
                thumbnail: v.thumbnail ?? undefined,
                metadata: {
                    attributes: v.metadata?.attributes ?? undefined,
                    user_code: v.metadata?.user_code ?? undefined,
                },
                quantities: v.quantities,
            }
        })

        return {
            title: i.title,
            categories: i.categories,
            description: i.description,
            handle: i.handle,
            weight: 1,
            shippingProfileName: 'Default Shipping Profile',
            thumbnail: i.thumbnail,
            images: i.images,
            options: options.length === 0 ? undefined : options,
            producer: i.producer,
            variants: variants.length === 0 ? undefined : variants,
            salesChannelNames: ['Default Sales Channel'],
        }
    }))
}