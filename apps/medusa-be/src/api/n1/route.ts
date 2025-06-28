import type {MedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import seedN1Workflow, {SeedN1WorkflowInput} from "../../workflows/seed/workflows/seed-n1";

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    const countries = ["cz", "gb", "de", "dk", "se", "fr", "es", "it", 'pl', 'at', 'sk']
    const input: SeedN1WorkflowInput = {
        salesChannels: [{
            name: "Default Sales Channel",
            default: true,
        }],
        currencies: [{
            code: "czk",
            default: true,
        }, {
            code: "eur",
            default: false,
        }, {
            code: "usd",
            default: false,
        }],
        regions: [
            {name: "Czechia", currencyCode: "czk", countries: ['cz'], paymentProviders: undefined},
            {
                name: "Europe",
                currencyCode: "eur",
                countries: countries.filter(c => c !== 'cz'),
                paymentProviders: undefined
            },
        ],
        taxRegions: {
            countries,
            taxProviderId: undefined,
        },
        stockLocations: {
            locations: [
                {
                    name: 'European Warehouse',
                    address: {
                        city: 'Copenhagen',
                        country_code: 'DK',
                        address_1: '',
                    },
                },
            ],
        },
        fulfillmentProviderId: undefined,
        defaultShippingProfile: {
            name: 'Default Shipping Profile',
        },
        fulfillmentSets: {
            name: "European Warehouse delivery",
            type: "shipping",
            serviceZones: [
                {
                    name: "Europe",
                    geoZones: countries.map(c => ({
                        countryCode: c
                    }))
                },
            ],
        },
        shippingOptions: [
            {
                name: 'Standard Shipping',
                type: {
                    label: "Standard",
                    description: "Ship in 2-3 days.",
                    code: "standard",
                },
                prices: [
                    {
                        currencyCode: "usd",
                        amount: 10,
                    },
                    {
                        currencyCode: "eur",
                        amount: 10,
                    },
                    {
                        currencyCode: "czk",
                        amount: 250,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            },
            {
                name: 'Express Shipping',
                type: {
                    label: "Express",
                    description: "Ship in 24 hours.",
                    code: "express",
                },
                prices: [
                    {
                        currencyCode: "usd",
                        amount: 10,
                    },
                    {
                        currencyCode: "eur",
                        amount: 10,
                    },
                    {
                        currencyCode: "czk",
                        amount: 250,
                    },
                ],
                rules: [
                    {
                        attribute: "enabled_in_store",
                        value: "true",
                        operator: "eq",
                    },
                    {
                        attribute: "is_return",
                        value: "false",
                        operator: "eq",
                    },
                ],
            }
        ],
        publishableKey: {
            title: 'Webshop'
        },
    }

    const {result} = await seedN1Workflow(req.scope)
        .run({
            input
        })

    res.send(result)
}