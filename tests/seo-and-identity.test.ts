import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), 'utf8');

const collectFiles = (dir: string): string[] =>
  readdirSync(join(root, dir)).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(join(root, path)).isDirectory() ? collectFiles(path) : [path];
  });

describe('SEO técnico del documento inicial', () => {
  const html = read('index.html');

  it('declara idioma, descripción, robots y título', () => {
    expect(html).toMatch(/<html lang="es">/);
    expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
    expect(html).toMatch(/<meta name="robots" content="index, follow"/);
    expect(html).toMatch(/<title>SPEFIBER S\.A\.S\. \|/);
  });

  it('incluye JSON-LD Organization válido con datos verificados', () => {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    const data = JSON.parse(match![1]) as Record<string, unknown>;
    expect(data['@type']).toBe('Organization');
    expect(data.legalName).toBe('SPEFIBER S.A.S.');
    expect(data).not.toHaveProperty('telephone');
    expect(data).not.toHaveProperty('address');
  });

  it('mantiene Twitter Cards y Open Graph básicos', () => {
    expect(html).toMatch(/property="og:title"/);
    expect(html).toMatch(/property="og:description"/);
    expect(html).toMatch(/name="twitter:card" content="summary_large_image"/);
  });

  it('robots.txt permite el rastreo sin exponer rutas internas', () => {
    const robots = read('public/robots.txt');
    expect(robots).toMatch(/User-agent: \*/);
    expect(robots).toMatch(/Allow: \//);
  });
});

describe('identidad corporativa', () => {
  it('no presenta SPEFIBER como proveedor de Wi-Fi, fibra óptica o telecomunicaciones en la interfaz', () => {
    const sources = [...collectFiles('src').filter((f) => /\.(tsx?|css)$/.test(f)), 'index.html'];
    const offending = sources.filter((file) => /wi-?fi|fibra óptica|telecomunicaciones/i.test(read(file)));
    expect(offending).toEqual([]);
  });
});
