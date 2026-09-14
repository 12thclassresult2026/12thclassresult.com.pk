/**
 * Stage OpenNext's prerender cache into the uploaded asset directory.
 *
 * THIS SCRIPT IS THE SECOND HALF OF THE ERROR 1102 FIX. Read
 * `open-next.config.ts` for the first half.
 *
 * `staticAssetsIncrementalCache` reads prerendered pages from
 * `cdn-cgi/_next_cache/<buildId>/<route>.cache` inside the deployed assets.
 * The OpenNext build writes them to `.open-next/cache/<buildId>/` and never
 * copies them across. Wrangler uploads `.open-next/assets` and nothing else.
 *
 * So without this step the cache override is configured, looks correct, and
 * has nothing to read. Every request misses, the Worker re-renders the whole
 * React tree, and under a result-day burst Cloudflare terminates it with
 * "Error 1102 — Worker exceeded resource limits". Intermittently, which is the
 * worst way for it to fail.
 *
 * It therefore exits non-zero on every failure mode rather than warning. A
 * deploy that quietly ships no cache is the bug returning, and a warning in a
 * build log is not a gate.
 */
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE = '.open-next/cache'
const DESTINATION = '.open-next/assets/cdn-cgi/_next_cache'

/** Recursively count files (not directories) under a path. */
function countFiles(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) total += countFiles(full)
    else if (entry.isFile()) total += 1
  }
  return total
}

function fail(message) {
  console.error(`stage-prerender-cache: ${message}`)
  console.error(
    'The incremental cache would have nothing to read, so every request would ' +
      're-render on the Worker. Refusing to continue.',
  )
  process.exit(1)
}

if (!existsSync(SOURCE) || !statSync(SOURCE).isDirectory()) {
  fail(`no build output at ${SOURCE} — run \`opennextjs-cloudflare build\` first.`)
}

const sourceCount = countFiles(SOURCE)
if (sourceCount === 0) {
  fail(`${SOURCE} exists but contains no cache files.`)
}

// Remove the destination first. A previous build's id would otherwise survive
// alongside the current one and ship a stale copy of every page.
rmSync(DESTINATION, { recursive: true, force: true })
cpSync(SOURCE, DESTINATION, { recursive: true })

const copiedCount = countFiles(DESTINATION)
if (copiedCount !== sourceCount) {
  fail(`copied ${copiedCount} of ${sourceCount} cache files — the copy is incomplete.`)
}

console.log(`stage-prerender-cache: staged ${copiedCount} cache files into ${DESTINATION}`)
