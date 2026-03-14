const { Client } = require('pg');
require('dotenv').config();

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL_IPV4_SESSION_POOLER });
  await client.connect();
  const { rows } = await client.query('SELECT id, name, category FROM tools ORDER BY category, name');

  const byCat = {};
  rows.forEach(r => {
    if (!byCat[r.category]) byCat[r.category] = [];
    byCat[r.category].push(r.name);
  });

  for (const [cat, tools] of Object.entries(byCat).sort()) {
    console.log('\n' + cat + ' (' + tools.length + '):');
    tools.forEach(t => console.log('  ✓', t));
  }
  console.log('\nTotal:', rows.length);
  await client.end();
})();
