import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { getArticle, getArticles, getDigest } from '../src/lib/content';
import { fixtureArticles, fixtureDigest } from '../src/lib/fixtures';
test('headless HTTP adapter validates data, propagates errors and never falls back', async () => {
  let mode = 'valid';
  let lastQuery = '';
  const server = createServer((req, res) => {
    lastQuery = req.url ?? '';
    res.setHeader('Content-Type', 'application/json');
    if (mode === 'error') {
      res.writeHead(503);
      res.end('{}');
      return;
    }
    if (lastQuery.includes('/articles/missing')) {
      res.writeHead(404);
      res.end('{}');
      return;
    }
    if (mode === 'invalid') {
      res.end(JSON.stringify({ articles: [{ title: 'bad' }], total: 1 }));
      return;
    }
    res.end(
      JSON.stringify(
        lastQuery.includes('/digests/')
          ? fixtureDigest
          : lastQuery.includes('/articles?')
            ? { articles: fixtureArticles, total: fixtureArticles.length }
            : fixtureArticles[0],
      ),
    );
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const addr = server.address();
  if (!addr || typeof addr === 'string') throw new Error('No test port');
  const originalSource = process.env.CONTENT_SOURCE;
  const originalUrl = process.env.CONTENT_API_URL;
  process.env.CONTENT_SOURCE = 'api';
  process.env.CONTENT_API_URL = 'http://127.0.0.1:' + addr.port;
  try {
    assert.equal((await getArticles({ q: 'сургууль', category: 'society' })).length, 7);
    assert.equal(new URL(lastQuery, 'http://test').searchParams.get('q'), 'сургууль');
    assert.equal(new URL(lastQuery, 'http://test').searchParams.get('category'), 'society');
    assert.equal((await getArticle('2027-mungunii-bodlogo'))?.id, fixtureArticles[0].id);
    assert.equal(await getArticle('missing'), null);
    assert.deepEqual(await getDigest(), fixtureDigest);
    mode = 'error';
    await assert.rejects(() => getArticles(), /503/);
    mode = 'invalid';
    await assert.rejects(() => getArticles());
    delete process.env.CONTENT_API_URL;
    await assert.rejects(() => getArticles(), /CONTENT_API_URL/);
  } finally {
    if (originalSource === undefined) delete process.env.CONTENT_SOURCE;
    else process.env.CONTENT_SOURCE = originalSource;
    if (originalUrl === undefined) delete process.env.CONTENT_API_URL;
    else process.env.CONTENT_API_URL = originalUrl;
    await new Promise<void>((resolve, reject) => server.close((e) => (e ? reject(e) : resolve())));
  }
});
