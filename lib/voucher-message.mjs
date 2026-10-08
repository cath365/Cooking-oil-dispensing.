/** Shared by the SMS server and preview so customers receive the exact preview. */
export function voucherMessage(v) {
  let expiry='Not set';
  if(v.expires){
    const date=new Date(v.expires);
    if(!Number.isNaN(date.getTime())){
      const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      expiry=`${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
    }
  }
  const litres=Number(v.litres);
  return `PIMISA COOKING OIL\nYour oil voucher is ready.\nCode: ${v.code}\nQuantity: ${litres} ${litres===1?'litre':'litres'}\nValid until: ${expiry}\nShow this SMS to collect your oil. Keep the code private.`;
}
