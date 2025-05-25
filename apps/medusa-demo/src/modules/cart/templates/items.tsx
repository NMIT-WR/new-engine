import type { HttpTypes } from '@medusajs/types'

import Item from '@modules/cart/components/item'

type ItemsTemplateProps = {
  items?: HttpTypes.StoreCartLineItem[]
}

const ItemsTemplate = ({ items }: ItemsTemplateProps) => {
  return (
    <div>
      <div className="border-b border-b-grayscale-100 pb-8 md:pb-12">
        <h1 className="text-md leading-none md:text-2xl">Your shopping cart</h1>
      </div>
      <div>
        {items
          ? items
              .sort((a, b) => {
                return (a.created_at ?? '') > (b.created_at ?? '') ? -1 : 1
              })
              .map((item) => {
                return <Item key={item.id} item={item} />
              })
          : null}
      </div>
    </div>
  )
}

export default ItemsTemplate
