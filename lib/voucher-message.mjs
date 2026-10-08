/** Shared by the SMS server and preview so customers receive the same template. */
export function voucherMessage(v, now=new Date()) {
  const customer=String(v.customerName||'Customer').replace(/[\r\n]+/g,' ').trim();
  const value=Number(v.value);
  const money=v.value!==undefined&&Number.isFinite(value)&&value>0?`K${value.toLocaleString('en-ZM',{minimumFractionDigits:0,maximumFractionDigits:2})}`:'Not specified';
  let expiry='Not specified';
  if(v.expires){
    const end=Date.parse(String(v.expires).slice(0,10)+'T00:00:00Z');
    // All operator and customer expiry wording follows Zambia's calendar date.
    const today=new Date(now.getTime()+2*60*60*1000).toISOString().slice(0,10);
    const days=Math.round((end-Date.parse(today+'T00:00:00Z'))/86400000);
    if(Number.isFinite(days))expiry=days>0?`${days} ${days===1?'day':'days'} from today`:days===0?'today':'Expired';
  }
  return `PIMISA Cooking Oil Voucher\n========================\n\nDear ${customer},\n\nYou have received a cooking oil voucher.\n\nVoucher Code: ${v.code}\nValue: ${money}\nExpires: ${expiry}\n\nHow to redeem:\n1. Visit any PIMISA dispensing station\n2. Enter your phone number on the machine\n3. Enter the voucher code above\n4. Collect your cooking oil\n\nKeep this code private. Do not share it.\n\nPIMISA - Quality Cooking Oil For Every Home\nwww.pimisa.com`;
}
