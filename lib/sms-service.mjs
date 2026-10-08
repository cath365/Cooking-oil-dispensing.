export const SMS_ENDPOINT = 'https://www.tessapay.com/sms/v1/send';
export function smsPhone(input) {
  let n=String(input||'').replace(/[\s()+-]/g,'');
  if(/^0[0-9]{9}$/.test(n)) n='260'+n.slice(1);
  if(!/^[1-9][0-9]{8,14}$/.test(n)) throw new Error('Use a phone number with country code, for example 26097XXXXXXX.');
  return n;
}
export function voucherMessage(v) {
  return `Pimisa oil voucher: ${v.code}. Allocation: ${Number(v.litres)} L. Expires: ${v.expires?v.expires.slice(0,10):'not set'}. Present this code and your registered phone number to the attendant.`;
}
export async function sendVoucherSms({token,to,message,fetcher=fetch}) {
  const response=await fetcher(SMS_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({to:smsPhone(to),message,provider:'smsala'}),signal:AbortSignal.timeout(15000)});
  let body={};try{body=await response.json();}catch{}
  if(!response.ok||body?.success===false||body?.error||['failed','error','rejected'].includes(String(body?.status||'').toLowerCase()))return {status:'Failed',httpStatus:response.status};
  // An HTTP success is API acceptance, not proof of delivery to the handset.
  return {status:'Accepted',reference:String(body?.messageId||body?.message_id||body?.id||body?.data?.messageId||body?.data?.id||'').slice(0,200)};
}
