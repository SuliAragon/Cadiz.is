import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import matter from 'gray-matter';

test('generated metadata preserves quotes, backslashes and newlines in both languages', () => {
  const title = 'Cádiz: "Vino y se Quedó" \\ rutas\nSegunda línea';
  const excerpt = '"Vino y se Quedó… de Tapas" invita a descubrir Cádiz.\n---\nMás información.';
  const body = '## Cádiz\n\nTexto del artículo.\n\n---\n\nFinal.';
  // Load only the real writer so this regression test needs no API keys,
  // network access or optional Python clients used by content generation.
  const output = execFileSync('python3', ['-c', `
import ast
import contextlib
import io
import json
import tempfile
from pathlib import Path

tree = ast.parse(Path('scripts/generate_content.py').read_text(encoding='utf-8'))
writer = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'write_markdown')
article = json.loads(input())
with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    namespace = {'json': json, 'ARTICLES_ES': root / 'es', 'ARTICLES_EN': root / 'en'}
    for lang in ('es', 'en'):
        (root / lang).mkdir()
    exec(compile(ast.Module(body=[writer], type_ignores=[]), '<writer>', 'exec'), namespace)
    with contextlib.redirect_stdout(io.StringIO()):
        namespace['write_markdown'](article, None)
    print(json.dumps([(root / lang / '2026-11-04-prueba.md').read_text(encoding='utf-8') for lang in ('es', 'en')]))
`], {
    input: JSON.stringify({
      slug: 'prueba', date: '2026-11-04', publishedAt: '2026-11-04T07:00:00Z',
      section: 'gastronomia', es: { title, excerpt, body }, en: { title, excerpt, body },
    }),
    encoding: 'utf8',
  });
  for (const [index, markdown] of JSON.parse(output).entries()) {
    const parsed = matter(markdown);
    assert.equal(parsed.data.title, title);
    assert.equal(parsed.data.excerpt, excerpt);
    assert.equal(parsed.data.articleSlug, 'prueba');
    assert.equal(parsed.data.publishedAt, '2026-11-04T07:00:00Z');
    assert.equal(parsed.data.lang, ['es', 'en'][index]);
    assert.equal(parsed.data.image, '/images/articles/placeholder.png');
    assert.equal(parsed.content.trim(), body);
  }
});
