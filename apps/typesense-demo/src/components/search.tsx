'use client';
import { CurrentRefinements } from '@/components/instantsearch/current-refinements';
import { Facet } from '@/components/instantsearch/facet';
import { InfiniteHits } from '@/components/instantsearch/infinite-hits';
import { SearchBox } from '@/components/instantsearch/searchbox';
import { SortBy } from '@/components/instantsearch/sort-by';
import { collectionName } from '@/lib/constants';
import { typesenseInstantsearchAdapter } from '@/lib/typesense-instantsearch-adapter';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

const sortByItems = [
  {
    label: 'Relevance',
    value: collectionName,
  },
  {
    label: 'Cena (Od nejnižší k nejvyšší)',
    value: `${collectionName}/sort/price:asc`,
  },
  {
    label: 'Cena (Od nejvyšší k nejnižší)',
    value: `${collectionName}/sort/price:desc`,
  },
  {
    label: 'Oblíbenost',
    value: `${collectionName}/sort/popularity:desc`,
  },
];

export default function Search() {
  return (
    <InstantSearchNext
      searchClient={typesenseInstantsearchAdapter.searchClient}
      indexName="items_full"
      routing
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="flex flex-col px-2 lg:px-0">
        <div className="flex items-end justify-end gap-3">
          <CurrentRefinements />
          <SortBy items={sortByItems} />
        </div>
        <div className="flex">
          <aside className="mt-16 mr-10 hidden flex-col gap-3 xl:flex">
            <div className="flex flex-col gap-8">
              <div>
                <Facet attribute="categories" />
              </div>
              <div>
                <Facet attribute="price" />
              </div>
              <div>
                <Facet attribute="popularity" />
              </div>
            </div>
          </aside>
          <div className="flex-1 flex-col">
            <SearchBox />
            <InfiniteHits />
          </div>
        </div>
      </div>
    </InstantSearchNext>
  );
}
