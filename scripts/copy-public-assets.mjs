import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const copies = [
  ['public/images/melveo-grid', 'dist/images/melveo-grid'],
];

/*
  Filter out macOS Finder duplicates ("name 2.webp", "dir 3", …).
  This machine syncs the repo through iCloud Documents, which
  occasionally materializes " 2"/" 3" copies next to originals
  (see memory: icloud-git-corruption). They're gitignored, but this
  script used to blind-copy them into dist/ — meaning they DEPLOYED
  to production (audit 2026-07-10 found three live "* 2.webp" files).
  The filter keeps them out of the build output for good.
*/
const isFinderDupe = (p) => / \d+(\.[a-z0-9]+)?$/i.test(path.basename(p).replace(/\.[a-z0-9]+$/i, ''));

for (const [from, to] of copies) {
  await mkdir(path.dirname(to), { recursive: true });
  await rm(to, { recursive: true, force: true });
  await cp(from, to, {
    recursive: true,
    filter: (src) => !isFinderDupe(src),
  });
}
