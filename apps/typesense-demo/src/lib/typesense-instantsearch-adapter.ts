import { typesenseConfig } from '@/lib/typesense';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: typesenseConfig,
  additionalSearchParameters: {
    query_by: 'name,description,brand,categories',
  },
});
