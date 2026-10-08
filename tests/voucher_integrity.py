"""Verify voucher transition SQL against SQLite, including replay and ownership."""
import json, pathlib, re, sqlite3
root=pathlib.Path(__file__).resolve().parents[1]
c=sqlite3.connect(':memory:')
for p in sorted((root/'drizzle').glob('*.sql')):
    c.executescript(p.read_text().replace('--> statement-breakpoint',''))
source=(root/'app/api/records/route.ts').read_text()
queries=re.findall(r'prepare\("([^"\n]+)"\)',source)
update=next(q for q in queries if q.startswith('UPDATE records SET'))
sale=next(q for q in queries if "SELECT ?,owner,'sale'" in q)
audit=next(q for q in queries if "SELECT ?,owner,'audit'" in q)
now='2026-10-08T12:00:00.000Z'
def seed(id,owner='owner',status='Active',expires='2026-10-09T23:59:59.999Z'):
    c.execute('INSERT INTO records VALUES(?,?,?,?,?)',(id,owner,'voucher',json.dumps(dict(status=status,expires=expires,code='123456',litres=2)),now));c.commit()
def redeem(id,owner,receipt):
    d=json.dumps(dict(status='Redeemed',expires='2026-10-09T23:59:59.999Z',receipt=receipt))
    with c:
        count=c.execute(update,(d,id,owner,now)).rowcount
        c.execute(sale,('redemption:'+id,json.dumps({'litres':2}),now,id,owner,receipt))
        c.execute(audit,('audit:'+receipt,'{}',now,id,owner,receipt))
    return count
seed('ok');assert redeem('ok','owner','first')==1
assert redeem('ok','owner','replay')==0
assert c.execute("SELECT count(*) FROM records WHERE kind='sale'").fetchone()[0]==1
seed('expired',expires='2026-10-07T00:00:00.000Z');assert redeem('expired','owner','expiry')==0
seed('cancelled',status='Cancelled');assert redeem('cancelled','owner','cancel')==0
seed('other',owner='someone');assert redeem('other','owner','cross-owner')==0
c.execute('INSERT INTO voucher_codes VALUES(?,?,?)',('owner','123456','one'))
try:
    c.execute('INSERT INTO voucher_codes VALUES(?,?,?)',('owner','123456','two'))
    raise AssertionError('Duplicate voucher code accepted')
except sqlite3.IntegrityError: pass
c.rollback()
seed('rollback')
# Simulate failure during the sales insert: the transition must roll back.
c.execute('INSERT INTO records VALUES(?,?,?,?,?)',('redemption:rollback','owner','sale','{}',now));c.commit()
try: redeem('rollback','owner','failure')
except sqlite3.IntegrityError: pass
assert json.loads(c.execute("SELECT data FROM records WHERE id='rollback'").fetchone()[0])['status']=='Active'
print('PASS: one redemption, replay rejection, expiry, cancellation, ownership, unique codes, atomic rollback')
