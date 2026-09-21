/**
 * BISE Lahore 2025 HSSC-II Gazette PDF -> D1 SQL batches
 * 
 * Usage: node scripts/gazette/extract-lahore.mjs
 */
import { createWriteStream, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const PDF_PATH = 'gazette/2025-annual-12th/bise-lahore_12th_2025-annual.pdf';
const OUT_DIR = 'gazette-private/d1-sql-lahore';
const BOARD_ID = 'bise-lahore';
const YEAR = 2025;
const EXAM = 'first-annual';
const ROWS_PER_STMT = 200;
const ROWS_PER_FILE = 20000;

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`);
const n = (v) => (v === null || v === undefined ? 'NULL' : String(Number(v)));

async function main() {
  console.log(`[Lahore] Loading PDF: ${PDF_PATH}`);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await readFile(PDF_PATH));
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
  const doc = await loadingTask.promise;
  console.log(`[Lahore] Total Pages: ${doc.numPages}`);

  mkdirSync(OUT_DIR, { recursive: true });

  let fileIndex = 0;
  let file = null;
  let rowsInFile = 0;
  let batch = [];
  let totalCandidates = 0;

  function openFile() {
    fileIndex++;
    const path = `${OUT_DIR}/${String(fileIndex).padStart(3, '0')}-rows.sql`;
    file = createWriteStream(path, { encoding: 'utf8' });
    rowsInFile = 0;
  }

  function flushBatch() {
    if (batch.length === 0) return;
    file.write('INSERT OR REPLACE INTO result VALUES\n' + batch.join(',\n') + ';\n');
    batch = [];
  }

  openFile();

  const startTime = Date.now();

  for (let pageNum = 54; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const items = content.items
      .filter((i) => 'str' in i && i.str.trim() !== '')
      .map((i) => ({
        x: Math.round(i.transform[4]),
        y: Math.round(i.transform[5]),
        str: i.str.trim(),
      }));

    // Lahore has 3 columns:
    // Col 0: x < 280
    // Col 1: 280 <= x < 530
    // Col 2: x >= 530
    // Headings are at y >= 555
    const candidateItems = items.filter((i) => i.y < 555);

    const cols = [
      candidateItems.filter((i) => i.x < 280),
      candidateItems.filter((i) => i.x >= 280 && i.x < 530),
      candidateItems.filter((i) => i.x >= 530),
    ];

    for (let c = 0; c < cols.length; c++) {
      const colItems = cols[c];
      const rolls = colItems.filter((i) => /^\d{6}$/.test(i.str));
      rolls.sort((a, b) => b.y - a.y); // top to bottom

      for (let r = 0; r < rolls.length; r++) {
        const roll = rolls[r];
        const nextRoll = rolls[r + 1];
        const yTop = roll.y + 5;
        const yBottom = nextRoll ? nextRoll.y + 5 : 0;

        const rowItems = colItems.filter((i) => i.y <= yTop && i.y > yBottom && i !== roll);
        const nameMaxX = c === 0 ? 195 : c === 1 ? 440 : 685;

        const nameParts = [];
        const resultParts = [];

        for (const item of rowItems) {
          if (item.x < nameMaxX) {
            nameParts.push(item.str);
          } else {
            resultParts.push(item.str);
          }
        }

        const name = nameParts.join(' ').replace(/\s+/g, ' ').trim();
        const rawStatus = resultParts.join(' ').replace(/\s+/g, ' ').trim();

        if (name.length < 2 || name.includes('ROLL NO') || name.includes('PAGE :')) {
          continue;
        }

        let status = 'unknown';
        let marks = null;
        let remarks = null;

        const marksMatch = rawStatus.match(/\b(\d{3,4})\b/);
        if (marksMatch) {
          marks = parseInt(marksMatch[1], 10);
          status = 'passed';
          if (/MARKS\s+IMP/i.test(rawStatus)) {
            remarks = 'MARKS IMPROVED';
          }
        } else if (/ABSENT/i.test(rawStatus)) {
          status = 'absent';
        } else if (/FEE\s+DEFAULTER/i.test(rawStatus)) {
          status = 'fee-defaulter';
          remarks = 'FEE DEFAULTER';
        } else if (/CANCEL/i.test(rawStatus)) {
          status = 'cancelled';
        } else {
          status = 'compartment';
          remarks = rawStatus.length > 0 ? rawStatus : null;
        }

        const rowSql = `(${q(BOARD_ID)},${YEAR},${q(EXAM)},${q(roll.str)},${q(name)},NULL,${q(status)},${n(marks)},NULL,NULL,${q(remarks)},${q(rawStatus)},${pageNum},${c})`;

        batch.push(rowSql);
        rowsInFile++;
        totalCandidates++;

        if (batch.length >= ROWS_PER_STMT) {
          flushBatch();
        }

        if (rowsInFile >= ROWS_PER_FILE) {
          flushBatch();
          file.end();
          openFile();
        }
      }
    }

    if (pageNum % 100 === 0 || pageNum === doc.numPages) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[Lahore] Processed page ${pageNum}/${doc.numPages} (${totalCandidates} candidates, ${elapsed}s)`);
    }
  }

  flushBatch();
  file.end();

  // Create dataset header SQL
  const datasetSql = `INSERT OR REPLACE INTO dataset VALUES (
    'bise-lahore-2025-first-annual-v1',
    '${BOARD_ID}',
    ${YEAR},
    '${EXAM}',
    'active',
    'bise-lahore-pdf',
    'https://result.biselahore.com',
    'lhr-three-column-1.0.0',
    'gazette-normalize-1.0.0',
    ${totalCandidates}
  );\n`;

  const metaPath = `${OUT_DIR}/000-dataset.sql`;
  const metaFile = createWriteStream(metaPath, { encoding: 'utf8' });
  metaFile.write(datasetSql);
  metaFile.end();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[Lahore] FINISHED! Total: ${totalCandidates} candidates across ${fileIndex} SQL files in ${totalTime}s.`);

  await loadingTask.destroy();
}

main().catch((err) => {
  console.error('[Lahore] Extraction error:', err);
  process.exit(1);
});
