/**
 * Pre-compress the images in `public/`, because nothing else will.
 *
 *   node scripts/optimize-images.mjs [--write]
 *
 * WHY THIS EXISTS. `next.config.ts` sets `images.unoptimized: true`, and for a
 * good documented reason: OpenNext on Cloudflare resizes only through an IMAGES
 * binding, none is configured, and `/_next/image` would otherwise return the
 * untouched original through a Worker invocation while losing the static-asset
 * security headers. Serving files directly is the right call — but it means the
 * bytes on disk are exactly the bytes a phone downloads. Nothing shrinks them
 * at request time, so they have to be right in the repository.
 *
 * What prompted it: PageSpeed measured mobile LCP at 8.6s against a desktop 95.
 * The hero was `hero-bg.webp` — a 952 KB JPEG wearing a .webp extension, at
 * 1376x768. On throttled 4G that single file is the whole gap.
 *
 * Runs as a dry run by default and prints what it would save; pass --write to
 * apply. Re-run it whenever an image is added.
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

import sharp from 'sharp'

const WRITE = process.argv.includes('--write')
const ROOT = 'public'

/**
 * Widths worth keeping. A hero is displayed at most ~1440 CSS px on desktop;
 * anything wider is bytes nobody sees. Logos and icons are left alone — they
 * are already small and re-encoding them risks the transparency they rely on.
 */
const MAX_WIDTH = 1600
/** Below this, re-encoding costs more in risk than it saves in bytes. */
const MIN_BYTES = 60 * 1024

const QUALITY = 72

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const results = []

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png', '.webp', '.img'].includes(ext)) continue

  const before = (await stat(file)).size

  /*
   * Read into a buffer first. sharp keeps its input file open, and writing the
   * result back to the same path fails on Windows with an UNKNOWN open error —
   * which is how this script failed the first time it was run with --write.
   */
  const source = await readFile(file)
  let meta
  try {
    meta = await sharp(source).metadata()
  } catch {
    results.push({ file, before, note: 'unreadable by sharp — left alone' })
    continue
  }

  // An extension that lies about the format breaks content negotiation and
  // misleads every later reader; record it either way.
  const mislabelled =
    !ext.includes(meta.format ?? '') && !(ext === '.jpg' && meta.format === 'jpeg')

  if (before < MIN_BYTES && !mislabelled) continue

  const width = Math.min(meta.width ?? MAX_WIDTH, MAX_WIDTH)

  /*
   * THE OUTPUT FORMAT FOLLOWS THE EXTENSION.
   *
   * The first draft of this script encoded everything to WebP and wrote it back
   * to the original path — which would have put WebP bytes inside logo.png, the
   * exact lie it was written to remove (hero-bg.webp held a JPEG). A path that
   * says .png must contain a PNG.
   *
   * Re-encoding in place still wins big: these files are not badly formatted,
   * they are badly compressed.
   */
  const pipeline = sharp(source).resize({ width, withoutEnlargement: true })
  const encoded =
    ext === '.webp'
      ? await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer()
      : ext === '.png'
        ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
        : ext === '.jpg' || ext === '.jpeg'
          ? await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer()
          : null

  if (encoded === null) {
    results.push({ file, before, note: `${ext} is not a format this script rewrites` })
    continue
  }

  results.push({
    file,
    before,
    after: encoded.length,
    format: meta.format,
    ext,
    mislabelled,
    dims: `${meta.width}x${meta.height}`,
    width,
  })

  if (WRITE && encoded.length < before) {
    // Written to the SAME path. Every reference in the codebase keeps working,
    // and a `.webp` path finally contains an actual WebP.
    await writeFile(file, encoded)
  }
}

results.sort((a, b) => (b.before ?? 0) - (a.before ?? 0))

const kb = (n) => `${Math.round(n / 1024)} KB`
let totalBefore = 0
let totalAfter = 0

console.log(WRITE ? 'REWRITING:' : 'DRY RUN (pass --write to apply):')
for (const r of results) {
  totalBefore += r.before
  totalAfter += r.after ?? r.before
  if (r.note) {
    console.log(`  ${basename(r.file).padEnd(30)} ${kb(r.before).padStart(8)}  ${r.note}`)
    continue
  }
  const saved = Math.round((1 - r.after / r.before) * 100)
  const flag = r.mislabelled ? `  [${r.ext} actually contains ${r.format}]` : ''
  console.log(
    `  ${basename(r.file).padEnd(30)} ${kb(r.before).padStart(8)} -> ${kb(r.after).padStart(8)}  (-${saved}%)  ${r.dims}${flag}`,
  )
}
console.log(
  `\n  TOTAL ${kb(totalBefore)} -> ${kb(totalAfter)}  (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`,
)
