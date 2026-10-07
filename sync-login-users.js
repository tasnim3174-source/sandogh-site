const fs = require('fs');
const https = require('https');
const XLSX = require('xlsx');

const SOURCES = [
  'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/data.xlsx',
  'https://raw.githubusercontent.com/tasnim3174-source/sandogh-site/main/data1.xlsx'
];

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}
function findCol(headers, candidates) {
  const norm = s => String(s || '').trim().toLowerCase();
  for (const c of candidates) {
    const x = headers.find(h => norm(h) === norm(c));
    if (x) return x;
  }
  for (const h of headers) {
    const n = norm(h);
    if (candidates.some(c => n.includes(norm(c)))) return h;
  }
  return '';
}

(async () => {
  const byAccount = new Map();

  for (const url of SOURCES) {
    try {
      const buf = await get(url);
      const wb = XLSX.read(buf, {type:'buffer', raw:false});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {defval:'', raw:false});
      if (!rows.length) continue;

      const headers = Object.keys(rows[0]);
      const account = findCol(headers, ['شماره حساب']);
      const username = findCol(headers, ['karbari','کاربری','username']);
      const password = findCol(headers, ['ramz','رمز','password']);
      const name = findCol(headers, ['name','نام']);
      const phone = findCol(headers, ['phone','تلفن','تلفن 1']);
      const phone2 = findCol(headers, ['phone2','تلفن2','تلفن 2']);
      const family = findCol(headers, ['heh1','کد خانوار']);
      if (!account) continue;

      for (const row of rows) {
        const acc = String(row[account] || '').trim();
        if (!acc) continue;
        const u = String((username ? row[username] : '') || '').trim() || acc;
        const pw = String((password ? row[password] : '') || '').trim() || acc;
        byAccount.set(acc, {
          id: acc, accountNumber: acc, username: u, password: pw,
          firstName: name ? String(row[name] || '').trim() : '',
          phone: phone ? String(row[phone] || '').trim() : '',
          phone1: phone ? String(row[phone] || '').trim() : '',
          phone2: phone2 ? String(row[phone2] || '').trim() : '',
          heh1: family ? String(row[family] || '').trim() : '',
          familyCount: 1, role: 'member'
        });
      }
    } catch (e) {
      console.warn('Source skipped:', url, e.message);
    }
  }

  const users = Array.from(byAccount.values());
  const familyCounts = {};
  users.forEach(u => { if (u.heh1) familyCounts[u.heh1] = (familyCounts[u.heh1] || 0) + 1; });
  users.forEach(u => { u.familyCount = familyCounts[u.heh1] || 1; });

  users.push({
    id:'admin', accountNumber:'admin', username:'admin',
    password:'admin123', role:'admin', memberId:null, familyCount:1
  });

  users.sort((a,b) => String(a.accountNumber).localeCompare(String(b.accountNumber)));
  fs.writeFileSync('login-users.json', JSON.stringify(users, null, 2) + '\n', 'utf8');
  console.log('Synced users:', users.length);
})();
