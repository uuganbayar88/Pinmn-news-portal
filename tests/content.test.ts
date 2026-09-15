import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureArticles, fixtureDigest } from '../src/lib/fixtures';
import { articleSchema, filterArticles } from '../src/lib/schema';
test('Mongolian search normalizes case and whitespace; filters combine', () => {
  const matches = filterArticles(fixtureArticles, { q: '  СУРГУУЛЬ  ', category: 'society' });
  assert.equal(matches.length, 2);
  assert.ok(matches.every((a) => a.category === 'society'));
  assert.equal(filterArticles(fixtureArticles, { q: 'сургууль', category: 'world' }).length, 0);
});
test('sorting is chronological and does not mutate editorial order', () => {
  const original = fixtureArticles.map((a) => a.id);
  const sorted = filterArticles(fixtureArticles, { sort: 'oldest' });
  assert.equal(sorted[0].id, 'venice-biennale');
  assert.deepEqual(
    fixtureArticles.map((a) => a.id),
    original,
  );
});
test('daily briefing has 7–10 unique resolvable stories', () => {
  assert.ok(fixtureDigest.articleIds.length >= 7 && fixtureDigest.articleIds.length <= 10);
  assert.equal(new Set(fixtureDigest.articleIds).size, fixtureDigest.articleIds.length);
  for (const id of fixtureDigest.articleIds) assert.ok(fixtureArticles.some((a) => a.id === id));
});
test('untrusted API URLs and unsupported content are rejected', () => {
  const article = fixtureArticles[0];
  assert.equal(
    articleSchema.safeParse({ ...article, source: { name: 'Bad', url: 'javascript:alert(1)' } })
      .success,
    false,
  );
  assert.equal(
    articleSchema.safeParse({
      ...article,
      image: { src: '//untrusted.example/a.jpg', alt: '', credit: '' },
    }).success,
    false,
  );
  assert.equal(articleSchema.safeParse({ ...article, slug: '../admin' }).success, false);
  assert.equal(
    articleSchema.safeParse({ ...article, keyPoints: ['x'.repeat(111), 'short'] }).success,
    false,
  );
});
