/**
 * BISE DG Khan 2025 HSSC-II Gazette PDF -> D1 SQL batches
 * 
 * Usage: node scripts/gazette/extract-dgkhan.mjs
 */
import { createWriteStream, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const PDF_PATH = 'gazette/2025-annual-12th/bise-dg-khan_12th_2025-annual.pdf';
const OUT_DIR = 'gazette-private/d1-sql-dgkhan';
const BOARD_ID = 'bise-dg-khan';
const YEAR = 2025;
const EXAM = 'first-annual';
const ROWS_PER_STMT = 200;
const ROWS_PER_FILE = 20000;

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`);
const n = (v) => (v === null || v === undefined ? 'NULL' : String(Number(v)));

async function main() {
  console.log(`[DG Khan] Loading PDF: ${PDF_PATH}`);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await readFile(PDF_PATH));
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
  const doc = await loadingTask.promise;
  console.log(`[DG Khan] Total Pages: ${doc.numPages}`);

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

  for (let pageNum = 70; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const items = content.items
      .filter((i) => 'str' in i && i.str.trim() !== '')
      .map((i) => ({
        x: Math.round(i.transform[4]),
        y: Math.round(i.transform[5]),
        str: i.str.trim(),
      }));

    // In DG Khan, header is at y >= 530
    const body = items.filter((i) => i.y < 530);

    // Roll items are strings starting with 6 digits:
    // Col 0: x < 100
    // Col 1: x >= 400 && x < 460
    const cols = [
      {
        rollItems: body.filter((i) => i.x < 100 && /^\d{6}\b/.test(i.str)),
        resultFilter: (i) => i.x >= 220 && i.x < 420,
      },
      {
        rollItems: body.filter((i) => i.x >= 400 && i.x < 460 && /^\d{6}\b/.test(i.str)),
        resultFilter: (i) => i.x >= 580,
      },
    ];

    for (let c = 0; c < 2; c++) {
      const col = cols[c];
      const rollItems = col.rollItems.sort((a, b) => b.y - a.y);

      for (let r = 0; r < rollItems.length; r++) {
        const item = rollItems[r];
        const roll = item.str.slice(0, 6);
        const name = item.str.slice(6).replace(/\s+/g, ' ').trim();

        const rowResults = body.filter((i) => Math.abs(i.y - item.y) <= 4 && col.resultFilter(i));
        const rawStatus = rowResults.map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim();

        if (name.length < 2 || name.includes('BOARD OF INTERMEDIATE')) {
          continue;
        }

        let status = 'unknown';
        let marks = null;
        let remarks = null;

        const marksMatch = rawStatus.match(/\b(\d{3,4})\b/);
        if (marksMatch) {
          marks = parseInt(marksMatch[1], 10);
          status = 'passed';
        } else if (/ABSENT/i.test(rawStatus)) {
          status = 'absent';
        } else if (/CANCEL/i.test(rawStatus)) {
          status = 'cancelled';
        } else {
          status = 'compartment';
          remarks = rawStatus.length > 0 ? rawStatus : null;
        }

        const rowSql = `(${q(BOARD_ID)},${YEAR},${q(EXAM)},${q(roll)},${q(name)},NULL,${q(status)},${n(marks)},NULL,NULL,${q(remarks)},${q(rawStatus)},${pageNum},${c})`;

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

    if (pageNum % 250 === 0 || pageNum === doc.numPages) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[DG Khan] Processed page ${pageNum}/${doc.numPages} (${totalCandidates} candidates, ${elapsed}s)`);
    }
  }

  flushBatch();
  file.end();

  const datasetSql = `INSERT OR REPLACE INTO dataset VALUES (
    'bise-dg-khan-2025-first-annual-v1',
    '${BOARD_ID}',
    ${YEAR},
    '${EXAM}',
    'active',
    'bise-dg-khan-pdf',
    'https://www.bisedgkhan.edu.pk',
    'dgk-two-column-1.0.0',
    'gazette-normalize-1.0.0',
    ${totalCandidates}
  );\n`;

  const metaPath = `${OUT_DIR}/000-dataset.sql`;
  const metaFile = createWriteStream(metaPath, { encoding: 'utf8' });
  metaFile.write(datasetSql);
  metaFile.end();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[DG Khan] FINISHED! Total: ${totalCandidates} candidates across ${fileIndex} SQL files in ${totalTime}s.`);

  await loadingTask.destroy();
}

main().catch((err) => {
  console.error('[DG Khan] Extraction error:', err);
  process.exit(1);
});
