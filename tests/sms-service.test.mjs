import test from 'node:test';
import assert from 'node:assert/strict';
import {smsPhone,voucherMessage,sendVoucherSms,SMS_ENDPOINT} from '../lib/sms-service.mjs';
test('Zambian local and international numbers normalize to country code',()=>{
 assert.equal(smsPhone('0964597302'),'260964597302');
 assert.equal(smsPhone('+260 964 597 302'),'260964597302');
 assert.throws(()=>smsPhone('abc'));assert.throws(()=>smsPhone('260'));
});
test('voucher text fits one basic SMS for ordinary vouchers',()=>{
 const m=voucherMessage({code:'123456',litres:2,expires:'2026-10-09T23:59:59Z'});
 assert.match(m,/123456/);assert.match(m,/9 Oct 2026/);assert.ok(m.length<=160);
});
test('request uses exact endpoint, provider, recipient and server authorization',async()=>{
 let requests=0;
 const result=await sendVoucherSms({token:'mock-test-token',to:'0964597302',message:'Voucher test',fetcher:async(url,opt)=>{
 requests++;assert.equal(url,SMS_ENDPOINT);assert.equal(opt.method,'POST');assert.equal(opt.headers.Authorization,'Bearer mock-test-token');assert.deepEqual(JSON.parse(opt.body),{to:'260964597302',message:'Voucher test',provider:'smsala'});
 return Response.json({success:true,messageId:'test-ref'});
 }});
 assert.equal(requests,1);assert.equal(result.status,'Accepted');assert.equal(result.reference,'test-ref');
});
test('HTTP rejection and provider rejection never report success',async()=>{
 const a=await sendVoucherSms({token:'mock',to:'260964597302',message:'test',fetcher:async()=>Response.json({error:'invalid token'},{status:401})});assert.equal(a.status,'Failed');
 const b=await sendVoucherSms({token:'mock',to:'260964597302',message:'test',fetcher:async()=>Response.json({success:false})});assert.equal(b.status,'Failed');
});
test('unknown network result never triggers an automatic retry',async()=>{
 let requests=0;await assert.rejects(sendVoucherSms({token:'mock',to:'260964597302',message:'test',fetcher:async()=>{requests++;throw new Error('timeout');}}));assert.equal(requests,1);
});

test('voucher message is readable and uses correct unit wording',()=>{
 const m=voucherMessage({code:'922120',litres:5,expires:'2026-10-12T23:59:59.999Z'});
 assert.equal(m, 'PIMISA COOKING OIL\nYour oil voucher is ready.\nCode: 922120\nQuantity: 5 litres\nValid until: 12 Oct 2026\nShow this SMS to collect your oil. Keep the code private.');
 assert.match(voucherMessage({code:'123456',litres:1}), /Quantity: 1 litre\n/);
 assert.match(voucherMessage({code:'123456',litres:0.5}), /Quantity: 0.5 litres/);
});
