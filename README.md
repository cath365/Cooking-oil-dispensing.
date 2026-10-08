# Cooking Oil Dispensing — Pimisa Control

Private web app for customers, vouchers, dispenser registration, manual cash sales, voucher redemption, audit trail and reports. Cloudflare D1 records are scoped to the signed-in user.

## Deployment
https://pimisa-dispenser-control.mysticbuddy8.chatgpt.site

## Workflow
1. Register a customer.
2. Create a customer-linked voucher with litres and an expiry date.
3. Print the voucher or save it as PDF using the print dialog.
4. After physically dispensing the full amount, use Redeem and enter payment received for this redemption. Enter zero if no payment is received at redemption.
5. The database atomically marks the voucher redeemed, records the sale and appends audit history. Replay, cancelled and expired redemption requests are rejected.
6. Filter sales by date, print receipts and export CSV. Customers and dispensers can be edited.

Voucher codes are unique per workspace. Historical vouchers created before the expiry feature may have no expiry date. No existing sales or customer data has been imported.

## Stack and development
React, TypeScript, Vinext, Cloudflare Workers, D1 and Drizzle. Authentication is provided by ChatGPT Sites. Node 22.13+ is required. Install with `npm install`, generate schema changes with `npm run db:generate`, run `npm run dev`, and build with `npm run build`. Another host requires explicit authentication and database setup.

## Validation
TypeScript and production build passed. Run `python tests/voucher_integrity.py` to verify SQL redemption safeguards, ownership, uniqueness and rollback. These use SQLite and do not constitute hosted browser or hardware tests; both remain outstanding.

## Hardware and payments
ESP32 redemption, telemetry, SMS and Mobile Money are not connected. Manual redemption records actual dispensing confirmed by the operator; it does not run the pump. Manually entered revenue represents amounts entered in sale/redemption records, not independently verified payment-provider receipts.

## Vercel
This is not a drop-in Vercel deployment. Adapt the Cloudflare D1 layer and ChatGPT Sites authentication before deploying there.
