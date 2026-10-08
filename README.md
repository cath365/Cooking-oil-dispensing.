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
ESP32 redemption, telemetry and Mobile Money are not connected. Voucher SMS is integrated through Tessapay/SMSala; live delivery testing remains pending. Manual redemption records actual dispensing confirmed by the operator; it does not run the pump. Manually entered revenue represents amounts entered in sale/redemption records, not independently verified payment-provider receipts.

## Vercel
This is not a drop-in Vercel deployment. Adapt the Cloudflare D1 layer and ChatGPT Sites authentication before deploying there.

## Voucher SMS
The server sends POST requests to `https://www.tessapay.com/sms/v1/send` using provider `smsala`. Configure `TESSAPAY_SMS_TOKEN` as a hosted runtime secret; never put its value into source or browser code. A voucher must be active, unexpired and owned by the signed-in user. Choose **Send SMS**, verify the recipient and preview, then confirm. Local Zambian numbers beginning with 0 are normalized to country code 260.

The API response is logged as Accepted, Failed or Unconfirmed. Accepted does not prove handset delivery. A timeout is unconfirmed and never triggers an automatic retry; check the provider before explicitly resending. A cooldown and database claim prevent accidental simultaneous sends. Live SMS may incur provider charges. No live SMS was sent during implementation.

Run mock tests with `node --test tests/sms-service.test.mjs` and database dispatch checks with `python tests/sms_dispatch_integrity.py`. Tests use fake responses and do not validate real credentials, account balance or handset delivery.
