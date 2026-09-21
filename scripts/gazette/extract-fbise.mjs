/**
 * FBISE Islamabad 2025 HSSC-II Gazette PDF -> D1 SQL batches
 * 
 * Usage: node scripts/gazette/extract-fbise.mjs
 */
import { createWriteStream, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const PDF_PATH = 'gazette/2025-annual-12th/fbise_12th_2025-annual.pdf';
const OUT_DIR = 'gazette-private/d1-sql-fbise';
const BOARD_ID = 'fbise-islamabad';
const YEAR = 2025;
const EXAM = 'first-annual';
const ROWS_PER_STMT = 200;
const ROWS_PER_FILE = 20000;

const q = (v) => (v === null || v === undefined ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`);
const n = (v) => (v === null || v === undefined ? 'NULL' : String(Number(v)));

async function main() {
  console.log(`[FBISE] Loading PDF: ${PDF_PATH}`);
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(await readFile(PDF_PATH));
  const loadingTask = pdfjs.getDocument({ data, useSystemFonts: true });
  const doc = await loadingTask.promise;
  console.log(`[FBISE] Total Pages: ${doc.numPages}`);

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

  for (let pageNum = 130; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    const items = content.items
      .filter((i) => 'str' in i && i.str.trim() !== '')
      .map((i) => ({
        x: Math.round(i.transform[4]),
        y: Math.round(i.transform[5]),
        str: i.str.trim(),
      }));

    // Header/Footer filter: body y is between 30 and 535
    const body = items.filter((i) => i.y >= 30 && i.y <= 535);

    const cols = [
      {
        rolls: body.filter((i) => i.x < 100 && /^\d{7}$/.test(i.str)),
        nameFilter: (i) => i.x >= 100 && i.x < 270,
        resultFilter: (i) => i.x >= 270 && i.x < 440,
      },
      {
        rolls: body.filter((i) => i.x >= 430 && i.x < 480 && /^\d{7}$/.test(i.str)),
        nameFilter: (i) => i.x >= 480 && i.x < 640,
        resultFilter: (i) => i.x >= 640,
      },
    ];

    for (let c = 0; c < 2; c++) {
      const col = cols[c];
      const rolls = col.rolls.sort((a, b) => b.y - a.y);

      for (let r = 0; r < rolls.length; r++) {
        const roll = rolls[r];
        const rowItems = body.filter((i) => Math.abs(i.y - roll.y) <= 3 && i !== roll);

        const nameParts = rowItems.filter(col.nameFilter).map((i) => i.str);
        const resultParts = rowItems.filter(col.resultFilter).map((i) => i.str);

        const name = nameParts.join(' ').replace(/\s+/g, ' ').trim();
        const rawStatus = resultParts.join(' ').replace(/\s+/g, ' ').trim();

        if (name.length < 2 || name.includes('FEDERAL BOARD') || name.includes('Roll No')) {
          continue;
        }

        let status = 'unknown';
        let marks = null;
        let grade = null;
        let remarks = null;

        const marksMatch = rawStatus.match(/\b(\d{3,4})\b/);
        const gradeMatch = rawStatus.match(/\b(A1|A\+|A|B|C|D|E)\b/);

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

        if (gradeMatch) {
          grade = gradeMatch[1];
        }

        const rowSql = `(${q(BOARD_ID)},${YEAR},${q(EXAM)},${q(roll.str)},${q(name)},NULL,${q(status)},${n(marks)},${q(grade)},NULL,${q(remarks)},${q(rawStatus)},${pageNum},${c})`;

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
      console.log(`[FBISE] Processed page ${pageNum}/${doc.numPages} (${totalCandidates} candidates, ${elapsed}s)`);
    }
  }

  flushBatch();
  file.end();

  const datasetSql = `INSERT OR REPLACE INTO dataset VALUES (
    'fbise-islamabad-2025-first-annual-v1',
    '${BOARD_ID}',
    ${YEAR},
    '${EXAM}',
    'active',
    'fbise-pdf',
    'https://www.fbise.edu.pk',
    'fbise-two-column-1.0.0',
    'gazette-normalize-1.0.0',
    ${totalCandidates}
  );\n`;

  const metaPath = `${OUT_DIR}/000-dataset.sql`;
  const metaFile = createWriteStream(metaPath, { encoding: 'utf8' });
  metaFile.write(datasetSql);
  metaFile.end();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`[FBISE] FINISHED! Total: ${totalCandidates} candidates across ${fileIndex} SQL files in ${totalTime}s.`);

  await loadingTask.destroy();
}

main().catch((err) => {
  console.error('[FBISE] Extraction error:', err);
  process.exit(1);
});
