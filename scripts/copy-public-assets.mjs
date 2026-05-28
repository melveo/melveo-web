import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const copies = [
  ['public/images/melveo-grid', 'dist/images/melveo-grid'],
];

for (const [from, to] of copies) {
  await mkdir(path.dirname(to), { recursive: true });
  await rm(to, { recursive: true, force: true });
  await cp(from, to, { recursive: true });
}
