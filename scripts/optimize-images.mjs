import { readdir, stat, writeFile, unlink, rename } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../public/equipamentos/', import.meta.url));
const MAX_WIDTH = 1600;
const QUALITY = 78;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

const files = (await walk(ROOT)).filter(isImage);
console.log(`Optimizing ${files.length} images (max width ${MAX_WIDTH}px, quality ${QUALITY})...`);

let savedBefore = 0;
let savedAfter = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  savedBefore += before;

  const image = sharp(file).rotate(); // respect EXIF orientation
  const meta = await image.metadata();
  const ext = extname(file).toLowerCase();

  let pipeline = image;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  if (ext === '.png') {
    pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });
  }

  const buffer = await pipeline.toBuffer();
  const tmp = file + '.tmp';
  await writeFile(tmp, buffer);
  await unlink(file);
  await rename(tmp, file);

  const after = (await stat(file)).size;
  savedAfter += after;

  const reduction = (((before - after) / before) * 100).toFixed(0);
  console.log(`  ${file.split(/[\\/]/).slice(-2).join('/')}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (-${reduction}%)`);
}

const totalBeforeMB = (savedBefore / 1024 / 1024).toFixed(1);
const totalAfterMB = (savedAfter / 1024 / 1024).toFixed(1);
const totalReduction = (((savedBefore - savedAfter) / savedBefore) * 100).toFixed(0);
console.log(`\nDone. Total: ${totalBeforeMB} MB -> ${totalAfterMB} MB (-${totalReduction}%)`);
