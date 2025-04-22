# Fashion-Starter Storefront Demo

This demo implementation integrates the Medusa Fashion-Starter template as a storefront in our monorepo structure, connecting to our existing Medusa backend.

## Prerequisites

- Running Medusa backend instance
- MeiliSearch instance (optional but recommended)
- Medusa publishable API key with assigned sales channel

## Installation

1. Clone this repository
2. Navigate to the project root:

```bash
cd new-engine
```

3. Install dependencies:

```bash
pnpm install
```

Configuration

Create a .env.local file in apps/demo/storefront based on the template:

NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_SEARCH_ENDPOINT=http://localhost:7700
NEXT_PUBLIC_SEARCH_API_KEY=<meilisearch-master-key>
NEXT_PUBLIC_STRIPE_KEY=pk_test_placeholder

Configure your publishable API key in Medusa admin:

Navigate to Settings → Sales Channels
Create or select a sales channel
Go to API Keys section
Assign your publishable key to the selected sales channel

Starting the Application

```bash
cd apps/demo/storefront
pnpm dev
```

Access the storefront:

- Frontend: http://localhost:8001
- MeiliSearch: http://localhost:7700

## Notes

- Ensure the Medusa backend is running and accessible at http://localhost:9000
- MeiliSearch is optional but recommended for better search performance
- Adjust environment variables as needed for your setup
