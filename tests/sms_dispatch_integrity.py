import pathlib,re,sqlite3
root=pathlib.Path(__file__).resolve().parents[1]
c=sqlite3.connect(':memory:')
for p in sorted((root/'drizzle').glob('*.sql')):c.executescript(p.read_text().replace('--> statement-breakpoint',''))
s=(root/'app/api/sms/route.ts').read_text();query=next(q for q in re.findall(r'prepare\("([^"\n]+)"\)',s) if q.startswith('INSERT INTO sms_dispatches'))
def claim(attempt,now,cooldown,stale,owner='a'):
 return c.execute(query,(owner,'voucher',attempt,now,'260970000000',cooldown,stale)).rowcount
assert claim('first','2026-10-08T12:00:00Z','2026-10-08T11:59:00Z','2026-10-08T11:58:00Z')==1
assert claim('duplicate','2026-10-08T12:00:10Z','2026-10-08T11:59:10Z','2026-10-08T11:58:10Z')==0
assert claim('ongoing','2026-10-08T12:01:10Z','2026-10-08T12:00:10Z','2026-10-08T11:59:10Z')==0
c.execute("UPDATE sms_dispatches SET status='Accepted' WHERE owner='a'")
assert claim('explicit-resend','2026-10-08T12:01:10Z','2026-10-08T12:00:10Z','2026-10-08T11:59:10Z')==1
# A crashed request can be explicitly retried after two minutes, never automatically.
assert claim('stale-retry','2026-10-08T12:04:10Z','2026-10-08T12:03:10Z','2026-10-08T12:02:10Z')==1
assert claim('other-owner','2026-10-08T12:00:10Z','2026-10-08T11:59:10Z','2026-10-08T11:58:10Z','b')==1
print('PASS: SMS cooldown, in-flight exclusion, explicit resend, stale recovery and owner isolation')
