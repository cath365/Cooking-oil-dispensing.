# Cooking Oil Dispensing — Pimisa Control

Private web app for voucher creation/cancellation, customers, dispenser registration, manual sales, CSV export and business settings. Records are saved in a Cloudflare D1 database and scoped to the signed-in user.

## Current deployment
https://pimisa-dispenser-control.mysticbuddy8.chatgpt.site

## Stack
React, TypeScript, Vinext, Cloudflare Workers, D1, Drizzle. Authentication is supplied by ChatGPT Sites.

## Development
Install dependencies with `npm install`, generate schema migrations with `npm run db:generate`, and run `npm run dev`. The project requires Node 22.13 or newer. Hosted authentication and D1 provisioning are supplied by Sites; another hosting provider requires explicit authentication and database configuration.

## Validation
TypeScript checks and the production build passed for the published version. Browser and hardware integration testing remain outstanding.

## Integration status
This is a new application, not an import of the original Pimisa database. ESP32 redemption, telemetry, SMS and Mobile Money are not connected. Manual sale recording does not activate the pump or redeem a voucher. Do not connect production hardware until authentication, API compatibility, unique voucher codes and redemption integrity have been implemented and tested.

## Vercel
This source is not a drop-in Vercel deployment. Port the D1 database layer and ChatGPT Sites authentication to suitable Vercel-compatible services first.
