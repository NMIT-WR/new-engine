import { HttpTypes } from "@medusajs/types"
import { isEqual, pick } from "lodash"

export default function compareAddresses(
  address1: Pick<
    HttpTypes.StoreCartAddress,
    | "first_name"
    | "last_name"
    | "address_1"
    | "address_2"
    | "company"
    | "postal_code"
    | "city"
    | "country_code"
    | "province"
    | "phone"
  >,
  address2: Pick<
    HttpTypes.StoreCartAddress,
    | "first_name"
    | "last_name"
    | "address_1"
    | "address_2"
    | "company"
    | "postal_code"
    | "city"
    | "country_code"
    | "province"
    | "phone"
  >
) {
  return isEqual(
    pick(address1, [
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ]),
    pick(address2, [
      "first_name",
      "last_name",
      "address_1",
      "address_2",
      "company",
      "postal_code",
      "city",
      "country_code",
      "province",
      "phone",
    ])
  )
}
