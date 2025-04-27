import { eshops } from './ALL_ESHOPS'

const TESTED_ESHOP_NAME = (() => {
  const testedEshopName = process.env.TESTED_ESHOP_NAME as keyof typeof eshops
  if (!testedEshopName) {
    throw new Error('TESTED_ESHOP_NAME is not set in the environment.')
  }
  if (!eshops[testedEshopName]) {
    throw new Error(
      `TESTED_ESHOP_NAME=${testedEshopName} is not in the list of supported eshops.`
    )
  }
  return testedEshopName
})()
const TESTED_ESHOP_URL = eshops[TESTED_ESHOP_NAME]

export const testedEshops = process.env['TEST_ALL_ESHOPS']
  ? eshops
  : { [TESTED_ESHOP_NAME]: TESTED_ESHOP_URL }
