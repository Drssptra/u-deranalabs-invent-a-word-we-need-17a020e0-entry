// main.ts — resubmit v2, make.fun "Invent a Word We Need"
// competition u-deranalabs-invent-a-word-we-need-17a020e0
//
// Rewritten from scratch for the resubmit. The entry itself is
// unchanged, byte for byte — only the program around it is new:
// the line is composed from its parts, checked by a dedicated
// gate function, and emitted by an async writer that reads the
// file back to prove the write landed exactly.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

// The word, its part of speech, and its definition, kept apart so
// the shape of the line is visible: "Fridget" fuses fridge and
// forget, naming the blank moment of opening the fridge and
// forgetting what you came for — a lapse English has no single
// word for, which is exactly what this competition asks for.
const WORD = "Fridget";
const PART_OF_SPEECH = "(n.)";
const DEFINITION = "opening the fridge and forgetting what you came for";

function composeEntry(): string {
  return `${WORD} ${PART_OF_SPEECH}: ${DEFINITION}.`;
}

// The scorer's gate: one line, 1–140 characters, not only
// whitespace. The entry is 66 characters, comfortably inside.
const GATE = Object.freeze({ min: 1, max: 140 });

function checkGate(text: string): void {
  const chars = [...text].length;
  const problems: string[] = [];
  if (chars < GATE.min || chars > GATE.max) {
    problems.push(`length ${chars} is outside ${GATE.min}–${GATE.max}`);
  }
  if (/[\r\n]/.test(text)) problems.push("must be a single line");
  if (text.trim().length === 0) problems.push("must not be blank");
  if (problems.length > 0) {
    throw new Error(`Entry fails the gate: ${problems.join("; ")}`);
  }
}

async function emit(text: string): Promise<string> {
  const dir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  await mkdir(dir, { recursive: true });
  const path = join(dir, "entry.txt");
  // Written exactly as-is: no trailing newline in the file.
  await writeFile(path, text, "utf8");
  return path;
}

async function verify(path: string, expected: string): Promise<void> {
  const back = await readFile(path, "utf8");
  if (back !== expected) {
    throw new Error(`entry.txt round-trip mismatch at ${path}`);
  }
}

async function main(): Promise<void> {
  const entry = composeEntry();
  checkGate(entry);
  const path = await emit(entry);
  await verify(path, entry);
  // Stdout may carry a trailing newline, so print the usual way.
  process.stdout.write(`${entry}\n`);
  process.stderr.write(`wrote ${path} (${[...entry].length} chars)\n`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
