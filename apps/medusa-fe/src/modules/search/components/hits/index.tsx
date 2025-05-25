import { clx } from '@medusajs/ui'
import type React from 'react'
import type { JSX } from 'react'
import { type UseHitsProps, useHits, useSearchBox } from 'react-instantsearch'

import type { ProductHit } from '../hit'
import ShowAll from '../show-all'

type HitsProps<THit> = React.ComponentProps<'div'> &
  UseHitsProps & {
    hitComponent: (props: { hit: THit }) => JSX.Element
  }

const Hits = ({
  hitComponent: Hit,
  className,
  ...props
}: HitsProps<ProductHit>) => {
  const { query } = useSearchBox()
  const { hits } = useHits(props)

  return (
    <div
      className={clx(
        'mb-1 w-full p-px transition-[height,max-height,opacity] duration-300 ease-in-out sm:w-[50vw] sm:overflow-hidden',
        className,
        {
          'max-h-full opacity-100': !!query,
          'max-h-0 opacity-0': !query && !hits.length,
        }
      )}
    >
      <div
        className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
        data-testid="search-results"
      >
        {hits.slice(0, 6).map((hit, index) => (
          <li
            key={index}
            className={clx('list-none', {
              'hidden sm:block': index > 2,
            })}
          >
            <Hit hit={hit as unknown as ProductHit} />
          </li>
        ))}
      </div>
      <ShowAll />
    </div>
  )
}

export default Hits
