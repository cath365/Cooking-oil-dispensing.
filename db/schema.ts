import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {id:text('id').primaryKey(), owner:text('owner').notNull(), kind:text('kind').notNull(), data:text('data').notNull(), created:text('created').notNull()});
import { primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const voucherCodes = sqliteTable('voucher_codes',{owner:text('owner').notNull(),code:text('code').notNull(),voucherId:text('voucher_id').notNull()},(t)=>[primaryKey({columns:[t.owner,t.code]}),uniqueIndex('voucher_codes_id').on(t.voucherId)]);
export const smsDispatches=sqliteTable('sms_dispatches',{owner:text('owner').notNull(),voucherId:text('voucher_id').notNull(),attemptId:text('attempt_id').notNull(),lastAttempt:text('last_attempt').notNull(),status:text('status').notNull(),recipient:text('recipient').notNull(),reference:text('reference').notNull()},(t)=>[primaryKey({columns:[t.owner,t.voucherId]})]);
