"use client";
import { CurrentRefinements } from "@/components/instantsearch/current-refinements";
import { Facet } from "@/components/instantsearch/facet";
import { InfiniteHits } from "@/components/instantsearch/infinite-hits";
import { SearchBox } from "@/components/instantsearch/searchbox";
import { SortBy } from "@/components/instantsearch/sort-by";
import { typesenseInstantsearchAdapter } from "@/lib/typesense-instantsearch-adapter";
import { DynamicWidgets } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";

const hitsPerPageItems = [
  {
    label: "16 hits per page",
    value: 16,
    default: true,
  },
  {
    label: "32 hits per page",
    value: 32,
  },
  {
    label: "64 hits per page",
    value: 64,
  },
];

const sortByItems = [
  {
    label: "Relevance",
    value: "items",
  },
  {
    label: "Cena (Od nejnižší k nejvyšší)",
    value: "items/sort/price:asc",
  },
  {
    label: "Cena (Od nejvyšší k nejnižší)",
    value: "items/sort/price:desc",
  },
  {
    label: "Oblíbenost",
    value: "items/sort/popularity:desc",
  },
];

export default function Search() {
  return (
    <InstantSearchNext
      searchClient={typesenseInstantsearchAdapter.searchClient}
      indexName="items"
      routing
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <div className="flex flex-col px-2 lg:px-0">
        <div className="flex justify-end gap-3 items-end">
          <CurrentRefinements />
          <SortBy items={sortByItems} />
        </div>
        <div className="flex">
          <aside className="xl:flex flex-col gap-3 mr-10 mt-16 hidden">
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
