"""Positioned-text Gazette parser. Candidate data must remain outside Git/public.

This family requires two repeated Roll-No/Name/Result-I headings. Unsupported
geometry, unassigned text and ambiguous continuations are held, never guessed.
Coordinates are PDF points; page references are physical one-based pages.
"""
import argparse
import collections
import hashlib
import json
from pathlib import Path
import re
import statistics
import time

import fitz

PARSER_VERSION = "grw-positioned-1.0.0"
NORMALIZATION_VERSION = "gazette-1.0.0"


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def lines(words):
    """Geometric line grouping, independent of PDF object extraction order."""
    output = []
    for word in sorted(words, key=lambda w: (w[1], w[0])):
        if not output or abs(output[-1][0][1] - word[1]) > min(word[3]-word[1], 3) * .55:
            output.append([word])
        else:
            output[-1].append(word)
    return [sorted(line, key=lambda w: w[0]) for line in output]


def text(words):
    return "\n".join(" ".join(w[4] for w in line) for line in lines(words))


def geometry(words, width, height):
    rolls = sorted([w for w in words if w[4] == "Roll-No"], key=lambda w: w[0])
    if not rolls:
        return None
    if len(rolls) != 2:
        raise ValueError("unexpected-columns")
    names = sorted([w for w in words if w[4] == "Name" and abs(w[1]-rolls[0][1]) < 10], key=lambda w: w[0])
    results = sorted([w for w in words if w[4] == "Result-I" and abs(w[1]-rolls[0][1]) < 10], key=lambda w: w[0])
    if len(names) != 2 or len(results) != 2:
        raise ValueError("missing-column-headings")
    font = statistics.median(w[3]-w[1] for w in rolls)
    # Right-column roll heading establishes the gutter independently per page.
    # The roll/name gap also accommodates an institution heading left of rolls.
    split = rolls[1][0] - (names[1][0]-rolls[1][0]) * .5
    cols = []
    for i in range(2):
        left, right = (0, split) if i == 0 else (split, width)
        body = max(w[3] for w in [rolls[i], names[i], results[i]])
        candidate_words = [w for w in words if left <= w[0] < right and w[1] > body]
        aligned = [w for w in candidate_words if abs(w[0]-rolls[i][0]) < font*1.15 and re.fullmatch(r"\d{6}", w[4])]
        # Heading anchors are evidence even on a sparse final column.
        roll_x = statistics.median(w[0] for w in aligned) if aligned else rolls[i][0]
        cols.append(dict(left=left, right=right, body=body, bottom=height,
                         rollX=roll_x, nameX=names[i][0],
                         resultX=results[i][0]-font*2, font=font))
    return dict(split=split, columns=cols)


def normalize_status(value):
    # Keep the full printed status. Do not invent grades, maxima or subject marks.
    if re.fullmatch(r"\d{1,4}", value):
        return dict(obtainedMarks=int(value), normalizedResultStatus="pass")
    if re.fullmatch(r"\d{1,4} MARKS IMP\.", value):
        return dict(obtainedMarks=int(value.split()[0]), remarks="MARKS IMP.")
    return {}


def parse_page(words, width, height, page_number, institution=None):
    g = geometry(words, width, height)
    if g is None:
        return [], [], institution, None
    records, problems = [], []
    for ci, col in enumerate(g["columns"]):
        body = [w for w in words if col["left"] <= w[0] < col["right"] and w[1] > col["body"]]
        anchors = sorted([w for w in body if abs(w[0]-col["rollX"]) < col["font"]*.7 and re.match(r"\d", w[4])], key=lambda w: w[1])
        # Institution text starts to the left of the roll field, with a code or
        # a region/private heading. It can wrap across the Name/Result boundary.
        heading_words = [w for w in body if w[0] < col["rollX"]-col["font"]*.7 and (re.match(r"^\d{6}-", w[4]) or w[4] == "PRIVATE")]
        events = [(w[1], "row", w) for w in anchors] + [(w[1], "heading", w) for w in heading_words]
        events.sort(key=lambda e: e[0])
        used = set()
        for ei, (y, kind, anchor) in enumerate(events):
            end = events[ei+1][0]-col["font"]*.65 if ei+1 < len(events) else col["bottom"]
            start = y-col["font"]*.65
            row_words = [w for w in body if start <= w[1] < end]
            used.update(id(w) for w in row_words)
            if kind == "heading":
                heading = " ".join(text(row_words).split())
                if not heading:
                    problems.append(dict(page=page_number, column=ci, kind="empty-heading"))
                elif re.match(r"^\d{6}-", heading):
                    institution = heading
                elif heading == "PRIVATE CANDIDATES":
                    institution = None
                else:
                    # Private/district headings must reset an earlier institution.
                    institution = None
                    problems.append(dict(page=page_number, column=ci, kind="unclassified-heading", raw=heading))
                continue
            roll = anchor[4]
            name_words = [w for w in row_words if w[0] > anchor[2] and w[0] < col["resultX"]]
            status_words = [w for w in row_words if w[0] >= col["resultX"]]
            name = " ".join(text(name_words).split())
            status = text(status_words)
            box = [col["left"], start, col["right"], end]
            record = dict(rollNumber=roll, candidateName=name, rawResultStatus=status,
                          sourceReference=f"PDF page {page_number}, {'left' if ci == 0 else 'right'} column",
                          **normalize_status(status))
            if institution:
                record["institution"] = institution
            issue = None
            if not re.fullmatch(r"\d{6}", roll):
                issue = "malformed-roll-number"
            elif not name or not re.fullmatch(r"[A-Z .,'()/_-]+", name):
                issue = "malformed-name"
            elif not status:
                issue = "missing-result-or-continuation"
            elif "obtainedMarks" in record and not 0 <= record["obtainedMarks"] <= 1200:
                issue = "marks-out-of-range"
            raw = dict(page=page_number, column=ci, bbox=box, raw=text(row_words), record=record)
            if issue:
                problems.append(dict(**raw, kind=issue))
            else:
                records.append(raw)
        leftovers = [w for w in body if id(w) not in used]
        if leftovers:
            # Never join a boundary fragment to the last candidate by guesswork.
            problems.append(dict(page=page_number, column=ci, kind="unassigned-text-or-continuation", raw=text(leftovers)))
    return records, problems, institution, g


def ingest(original, manifest_path, output):
    manifest = json.loads(Path(manifest_path).read_text(encoding="utf-8"))
    original = Path(original)
    if hashlib.sha256(original.read_bytes()).hexdigest() != manifest["checksum"] or original.stat().st_size != manifest["sizeBytes"]:
        raise ValueError("Original checksum/size does not match registry")
    if not manifest["provenanceVerified"]:
        raise ValueError("Unverified provenance")
    output = Path(output)
    output.mkdir(parents=True, exist_ok=False)  # immutable run, never overwrite
    started = time.perf_counter()
    doc = fitz.open(original)
    if "GUJRANWALA" not in doc[0].get_text() or "2025" not in doc[0].get_text():
        raise ValueError("Source identity mismatch")
    institution, seen = None, set()
    counts = collections.Counter()
    statuses = collections.Counter()
    splits = set()
    with (output/"records.jsonl").open("w", encoding="utf-8", newline="\n") as normalized, (output/"raw.jsonl").open("w", encoding="utf-8", newline="\n") as raw_file, (output/"rejected.jsonl").open("w", encoding="utf-8", newline="\n") as rejected:
        for n, page in enumerate(doc, 1):
            words = page.get_text("words")
            try:
                rows, problems, institution, g = parse_page(words, page.rect.width, page.rect.height, n, institution)
            except ValueError as error:
                rows, problems, g = [], [dict(page=n, kind=str(error))], None
            if g:
                counts["candidatePages"] += 1
                splits.add(round(g["split"], 3))
            else:
                counts["nonCandidatePages"] += 1
            for problem in problems:
                counts[problem["kind"]] += 1
                rejected.write(compact(problem)+"\n")
            for row in rows:
                record = row["record"]
                record.update({k: manifest[k] for k in ("boardId", "year", "examination", "session", "datasetId")})
                record.update(parserVersion=PARSER_VERSION, normalizationVersion=NORMALIZATION_VERSION)
                key = (record["boardId"], record["year"], record["examination"], record["rollNumber"])
                counts["parsed"] += 1
                if key in seen:
                    counts["duplicateKeys"] += 1
                    rejected.write(compact(dict(**row, kind="duplicate-key"))+"\n")
                    continue
                seen.add(key)
                counts["valid"] += 1
                statuses[record["rawResultStatus"] if "obtainedMarks" not in record else "numeric"] += 1
                normalized.write(compact(record)+"\n")
                raw_file.write(compact(row)+"\n")
    report = dict(datasetId=manifest["datasetId"], parserVersion=PARSER_VERSION, normalizationVersion=NORMALIZATION_VERSION,
                  sourceChecksum=manifest["checksum"], sourcePages=len(doc), counts=dict(counts),
                  detectedSplits=sorted(splits), parseSeconds=time.perf_counter()-started,
                  statuses=dict(statuses), status="staged", originalUnchanged=hashlib.sha256(original.read_bytes()).hexdigest()==manifest["checksum"])
    (output/"parse-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    (output/"source.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(compact({k:v for k,v in report.items() if k!="statuses"}))


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("original")
    cli.add_argument("manifest")
    cli.add_argument("output")
    args = cli.parse_args()
    ingest(args.original, args.manifest, args.output)
