import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {id:text('id').primaryKey(), owner:text('owner').notNull(), kind:text('kind').notNull(), data:text('data').notNull(), created:text('created').notNull()});
import { primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const voucherCodes = sqliteTable('voucher_codes',{owner:text('owner').notNull(),code:text('code').notNull(),voucherId:text('voucher_id').notNull()},(t)=>[primaryKey({columns:[t.owner,t.code]}),uniqueIndex('voucher_codes_id').on(t.voucherId)]);
