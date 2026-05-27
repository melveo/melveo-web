import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const copies = [
  ['public/images/melveo-grid/thumbs', 'dist/images/melveo-grid/thumbs'],
];

for (const [from, to] of copies) {
  await mkdir(path.dirname(to), { recursive: true });
  await cp(from, to, { recursive: true });
}
