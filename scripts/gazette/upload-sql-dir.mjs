/**
 * Upload all SQL files in a directory to Cloudflare D1
 * Usage: node scripts/gazette/upload-sql-dir.mjs <dir>
 */
import { readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: node scripts/gazette/upload-sql-dir.mjs <dir>');
  process.exit(1);
}

const files = readdirSync(dir)
  .filter((f) => f.endsWith('-rows.sql'))
  .sort();

console.log(`[Upload] Found ${files.length} files in ${dir}`);

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const filePath = path.join(dir, file);
  console.log(`[Upload] (${i + 1}/${files.length}) Executing ${file}...`);
  
  let success = false;
  let attempts = 0;
  
  while (!success && attempts < 3) {
    attempts++;
    try {
      execSync(`npx wrangler d1 execute 12thclassresult-gazette --remote --file="${filePath}"`, {
        stdio: 'inherit',
      });
      success = true;
    } catch (err) {
      console.error(`[Upload] Attempt ${attempts} failed for ${file}:`, err.message);
      if (attempts < 3) {
        console.log('[Upload] Retrying in 3 seconds...');
        execSync('node -e "setTimeout(() => {}, 3000)"');
      } else {
        console.error(`[Upload] Fatal failure on ${file}`);
        process.exit(1);
      }
    }
  }
}

console.log(`[Upload] ALL ${files.length} FILES SUCCESSFULLY UPLOADED!`);
