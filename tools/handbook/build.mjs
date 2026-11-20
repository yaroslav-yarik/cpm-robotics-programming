import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { marked } from 'marked';

const root = fileURLToPath(new URL('../../', import.meta.url));
const source = join(root, 'notes/cpp-algorithms');
const output = join(root, 'docs');
const marker = '<!-- interactive -->';
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function write(name, html) {
  const path = join(output, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
}

const sections = [
  ['hardware', 'Устройство компьютера'], ['cpp', 'Язык C++'],
  ['algorithms', 'Базовые алгоритмы'], ['robotics', 'Прикладные алгоритмы']
];
const legacy = {
  'cpu.html': 'hardware/cpu.html', 'bits.html': 'cpp/bits-and-bitset.html',
  'memory.html': 'cpp/memory-layout.html', 'search.html': 'algorithms/binary-search.html'
};

function build(relative, group) {
  const markdown = readFileSync(join(source, relative), 'utf8').replaceAll('\r\n', '\n')
    .replace(/^\[Читать на сайте с интерактивами\]\([^\n]+\)\.\n\n/m, '')
    .replace(/^\[(Оглавление|Справочник)\]\(\.\.\/README\.md\) [·›] [^\n]+\n\n/m, '');
  const title = /^# (.+)$/m.exec(markdown)[1];
  let body = marked.parse(markdown, { gfm: true }).replace(/href="([^":#?]+)\.md(#[^"]*)?"/g,
    (_, path, anchor = '') => 'href="' + path.replace(/(^|\/)README$/, '$1index') + '.html' + anchor + '"');
  if (group) {
    const widget = readFileSync(join(root, 'widgets', relative.replace(/\.md$/, '.html')), 'utf8');
    assert.equal(body.split(marker).length, 2, 'Точка вставки: ' + relative);
    body = body.replace(marker, () => '<div id="practice">' + widget + '</div>');
  } else {
    for (const [slug, label] of sections) {
      body = body.replace('<h2>' + label + '</h2>', '<h2 id="' + slug + '">' + label + '</h2>');
    }
  }
  const nav = group
    ? '<nav class="reader-nav"><a href="../index.html">Оглавление</a><span> / </span><a href="../index.html#' + group[0] + '">' + group[1] + '</a><a class="jump" href="#practice">К опыту</a></nav>'
    : '<nav class="reader-nav" aria-label="Разделы">' + sections.map(([slug,label]) => '<a href="#' + slug + '">' + label + '</a>').join(' ') + '</nav>';
  write(group ? relative.replace(/\.md$/, '.html') : 'index.html',
    '<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' +
    escape(title) + ' · Справочник ЦПМ</title><link rel="stylesheet" href="' + (group ? '../' : '') +
    'style.css"></head><body><main class="reader">' + nav + '<article>' + body + '</article></main></body></html>\n');
}

build('README.md', null);
for (const group of sections) {
  for (const name of readdirSync(join(source, group[0])).filter(name => name.endsWith('.md'))) {
    build(group[0] + '/' + name, group);
  }
}
for (const dir of readdirSync(join(source, 'assets'))) {
  for (const file of readdirSync(join(source, 'assets', dir))) {
    const rel = join('assets', dir, file);
    write(rel, readFileSync(join(source, rel)));
  }
}
for (const [name, chapter] of Object.entries(legacy)) {
  const url = chapter + '#practice';
  write(name, '<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=' + url + '"><title>Опыт в главе</title><p><a href="' + url + '">Открыть опыт в тексте главы</a></p></html>\n');
}
write('.nojekyll', '');
