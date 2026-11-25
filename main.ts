// main.ts — entry for make.fun "Invent a Word We Need"
// (competition u-deranalabs-invent-a-word-we-need-17a020e0)
//
// The program prints one invented word with its one-line definition and
// writes that same line to $MAKEFUN_OUTPUT_DIR/entry.txt, where the
// sealed scorer reads it. The gate allows 1 to 140 characters, a single
// line, not only whitespace — so the text below is kept short and plain.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a brand-new word for the tiredness that comes from a day
// spent doing absolutely nothing — a feeling English has no word for.
// "Restigue" blends rest and fatigue, so it sounds like a word English
// could have grown on its own: sayable, spellable, easy to remember.
const ENTRY =
  "Restigue (n.): the exhaustion of a day spent doing absolutely nothing.";

// The gate: 1 to 140 characters, one line, not only whitespace.
// Check the entry against it here so a bad edit fails loudly instead
// of silently producing an entry the scorer refuses.
const MAX_CHARS = 140;
if (
  ENTRY.length < 1 ||
  ENTRY.length > MAX_CHARS ||
  ENTRY.includes("\n") ||
  ENTRY.trim().length === 0
) {
  throw new Error(
    `Entry breaks the gate: ${ENTRY.length} chars, must be one line of 1-${MAX_CHARS} characters.`,
  );
}

// Where the scorer looks for the entry text.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const entryPath = join(outputDir, "entry.txt");

// The entry is written exactly as-is: no trailing newline in the file.
mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, ENTRY, "utf8");

// Stdout may carry a trailing newline, so print the line the usual way.
console.log(ENTRY);
