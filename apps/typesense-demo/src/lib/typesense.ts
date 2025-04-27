import type { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

const {
  TYPESENSE_HOST = 'typesense-86b-8108.prg1.zerops.app',
  TYPESENSE_PORT = 443,
  TYPESENSE_PROTOCOL = 'https',
  TYPESENSE_API_KEY = '2e6662307573526c3345374d746d6d7041512d663865796239345a7532635245',
} = process.env;

export const typesenseConfig: ConfigurationOptions = {
  nodes: [
    {
      host: TYPESENSE_HOST,
      port: Number(TYPESENSE_PORT),
      protocol: TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: TYPESENSE_API_KEY,
  retryIntervalSeconds: 2,
};
