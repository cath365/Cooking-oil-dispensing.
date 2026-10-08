import test from 'node:test';
import assert from 'node:assert/strict';
import {smsPhone,voucherMessage,sendVoucherSms,SMS_ENDPOINT} from '../lib/sms-service.mjs';
test('Zambian local and international numbers normalize to country code',()=>{
 assert.equal(smsPhone('0964597302'),'260964597302');
 assert.equal(smsPhone('+260 964 597 302'),'260964597302');
 assert.throws(()=>smsPhone('abc'));assert.throws(()=>smsPhone('260'));
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

test('requested personalized voucher format uses actual stored value and expiry',()=>{
 const m=voucherMessage({customerName:'Andrew McNaught',code:'393501',litres:5,value:45,expires:'2026-10-15T23:59:59.999Z'},new Date('2026-10-08T12:00:00Z'));
 assert.match(m,/Dear Andrew McNaught,/);
 assert.match(m,/Voucher Code: 393501\nValue: K45\nExpires: 7 days from today/);
 assert.match(m,/1\. Visit any PIMISA dispensing station/);
 assert.ok(m.endsWith('www.pimisa.com'));
 assert.ok(m.length>160);
});
test('expiry is computed from Zambia calendar day, including midnight and older vouchers',()=>{
 const v={code:'123456',expires:'2026-10-09T23:59:59.999Z'};
 assert.match(voucherMessage(v,new Date('2026-10-08T20:00:00Z')),/Expires: 1 day from today/);
 assert.match(voucherMessage(v,new Date('2026-10-08T23:00:00Z')),/Expires: today/);
 assert.match(voucherMessage(v,new Date('2026-10-10T12:00:00Z')),/Expires: Expired/);
 assert.match(voucherMessage({code:'123456'}),/Value: Not specified/);
});
