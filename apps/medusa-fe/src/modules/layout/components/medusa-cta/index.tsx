import { Text } from '@medusajs/ui'

import Medusa from '../../../common/icons/medusa'
import NextJs from '../../../common/icons/nextjs'

const MedusaCTA = () => {
  return (
    <Text className="txt-compact-small-plus flex items-center gap-x-2">
      Powered by
      <a href="https://www.medusajs.com" target="_blank" rel="noreferrer">
        <Medusa fill="#9ca3af" className="fill-[#9ca3af]" />
      </a>
      &
      <a href="https://nextjs.org" target="_blank" rel="noreferrer">
        <NextJs fill="#9ca3af" />
      </a>
    </Text>
  )
}

export default MedusaCTA
