# Shopify App Node

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

This is a sample app to help developers bootstrap their Shopify app development.

It leverages the [Shopify API Library](https://github.com/Shopify/shopify-node-api) on the backend to create [an embedded app](https://shopify.dev/apps/tools/app-bridge/getting-started#embed-your-app-in-the-shopify-admin), and [Polaris](https://github.com/Shopify/polaris-react) and [App Bridge React](https://shopify.dev/tools/app-bridge/react-components) on the frontend.

This is the repository used when you create a new Node app with the [Shopify CLI](https://shopify.dev/apps/tools/cli).

## Requirements

- If you don’t have one, [create a Shopify partner account](https://partners.shopify.com/signup).
- If you don’t have one, [create a Development store](https://help.shopify.com/en/partners/dashboard/development-stores#create-a-development-store) where you can install and test your app.
- **If you are not using the Shopify CLI**, in the Partner dashboard, [create a new app](https://help.shopify.com/en/api/tools/partner-dashboard/your-apps#create-a-new-app). You’ll need this app’s API credentials during the setup process.

## Installation

Using the [Shopify CLI](https://github.com/Shopify/shopify-cli) run:

```sh
shopify app create node -n APP_NAME
```

Or, you can run `npx degit shopify/shopify-app-node` and create a `.env` file containing the following values:

```yaml
SHOPIFY_API_KEY={api key}           # Your API key
SHOPIFY_API_SECRET={api secret key} # Your API secret key
SCOPES={scopes}                     # Your app's required scopes, comma-separated
HOST={your app's host}              # Your app's host, without the protocol prefix
```

## Developer resources

- [Introduction to Shopify apps](https://shopify.dev/apps/getting-started)
  - [App authentication](https://shopify.dev/apps/auth)
- [Shopify CLI command reference](https://shopify.dev/apps/tools/cli/app)
- [Shopify API Library documentation](https://github.com/Shopify/shopify-node-api/tree/main/docs)

## License

This repository is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
#   c u s t o m - r e c o m m e n d e r - a p p 
 
 


App setup white list url ex

https://f9d3-103-18-10-46.ngrok-free.app/oauth/callback
https://f9d3-103-18-10-46.ngrok-free.app/auth/shopify/callback
https://f9d3-103-18-10-46.ngrok-free.app/api/auth/callback


App .env 
SHOPIFY_API_KEY=19de158a2f7959c60bd00a47f6d6c2e8
SHOPIFY_API_SECRET=05ea643631abdbe289c6c1cb071b1532
SHOP=my-store-dev-01.myshopify.com
SCOPES=read_products,write_products,write_themes,read_themes,write_script_tags,read_publications,write_publications,write_files,read_inventory,write_inventory
HOST=https://926b-2400-c600-3588-f5b2-1d19-143-8523-1a59.ngrok-free.app
NODE_ENV=test
PORT=8081
TEST_CHARGES=True
APP_HANDLE=19de158a2f7959c60bd00a47f6d6c2e8
APP_NAME=shephbeats
DATABASE_NAME=sephbeats
API_PASSWORD=sephbeats123
AFTER_AUTH_REDIRECT=home
BUCKET_NAME="sephbeats-spaces"
BUCKET_REGION="us-east-1"
ACCESS_KEY_ID=DO00XTCLR9NAZBAREVLQ
SECRET_ACCESS_KEY=xu4xqJSgxQzoay/qskRrm48sXPofV6BWdQEcveDyF8I
ENDPOINT=https://sephbeats-spaces.nyc3.digitaloceanspaces.com
