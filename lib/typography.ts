// Non-breaking space (U+00A0). Built from a char code so the source stays pure
// ASCII — no literal NBSP that could be silently transcribed as a normal space.
const NBSP = String.fromCharCode(0xa0);

// Tokens that end in a dot but are NOT a sentence end. Lower-cased, dot stripped.
// Only the abbreviations that actually appear in the EN + IT copy (FAQ, legal).
const ABBREVIATIONS = new Set([
  "etc", "ecc", "es", "ad", "cfr", "pag", "pp", "vol", "art", "artt",
  "n", "nr", "no", "fig", "sig", "sigg", "dr", "dott", "prof",
  "mr", "mrs", "ms", "st", "vs", "ca", "approx", "tel", "fax", "al",
]);

// Keep the first few words of every sentence together so a sentence never
// restarts with 1–3 stranded words after a period. LEAD_MAX_CHARS caps the
// bound group so it can never get wide enough to overflow a ~375px screen —
// this is the "reduce 4 → 3 → 2 words on overflow" rule resolved at build time
// (we can't measure the viewport during SSR, so we bound by width instead).
const LEAD_MAX_WORDS = 4;
const LEAD_MAX_CHARS = 22;
const LEAD_MIN_SEGMENT_WORDS = 7; // only worth doing on real multi-clause prose

/**
 * True when the gap between `prev` and `next` is a real sentence boundary —
 * not an abbreviation ("etc.", "ecc."), a number/decimal ("3.5", "§5.2"), or a
 * single-letter initial ("S."). URLs stay intact because they are a single
 * token with no internal space, so no boundary ever falls inside them.
 */
function startsNewSentence(prev: string, next: string): boolean {
  // The next word must open a sentence: a capital letter, a digit, or an
  // opening quote/bracket leading into one.
  if (!/^[\dA-ZÀ-Þ"'(\[]/.test(next)) return false;
  // The previous word must end with . ! ? (optionally wrapped in quotes/brackets).
  if (!/[^\s.!?][.!?]+["')\]]*$/.test(prev)) return false;
  const core = prev.replace(/[.!?"')\]]+$/g, "");
  if (/\d/.test(core)) return false; // numbers, decimals, §5.2, codes
  if (/^[A-ZÀ-Þ]$/.test(core)) return false; // single-letter initial
  if (ABBREVIATIONS.has(core.toLowerCase())) return false;
  return true;
}

/**
 * Bind awkward word groups with non-breaking spaces inside a single
 * line-break-delimited segment:
 *   1. the last `minTail` words (widow control), and
 *   2. the leading words of each sentence (orphan-start control).
 * A bound group can only wrap as a unit, so it drops to the next line whole
 * instead of stranding one or two words. Only spaces are swapped for NBSP — no
 * characters are added or removed, so the visible text is byte-identical and
 * `**bold**` / `[label](href)` markdown delimiters are never touched.
 */
function tidy(segment: string, minTail: number): string {
  const words = segment.split(" ");
  const n = words.length;
  if (n <= minTail) return segment;

  // sep[i] is the gap between words[i] and words[i + 1]; default = normal space.
  const sep: string[] = new Array(n - 1).fill(" ");

  // 1) Widow control — keep the last `minTail` words on the same line.
  for (let i = Math.max(0, n - minTail); i < n - 1; i++) sep[i] = NBSP;

  // 2) Sentence-start control — bind the first words of each sentence.
  if (n >= LEAD_MIN_SEGMENT_WORDS) {
    const starts = [0];
    for (let i = 0; i < n - 1; i++) {
      if (startsNewSentence(words[i], words[i + 1])) starts.push(i + 1);
    }
    for (const s of starts) {
      let chars = words[s].length;
      for (let k = 1; k < LEAD_MAX_WORDS && s + k < n; k++) {
        const w = words[s + k];
        if (chars + 1 + w.length > LEAD_MAX_CHARS) break; // budget → fewer words
        sep[s + k - 1] = NBSP;
        chars += 1 + w.length;
      }
    }
  }

  let out = words[0];
  for (let i = 1; i < n; i++) out += sep[i - 1] + words[i];
  return out;
}

/**
 * Tidy body copy for clean reading: no widows (1–2 words alone on the last
 * line) and no sentences that restart with 1–3 stranded words.
 *
 * Operates per `\n` segment so it composes with `whitespace-pre-line` text
 * (e.g. FAQ answers that embed hard line breaks). This is the canonical way to
 * enforce these rules site-wide — do NOT hand-place `&nbsp;`/`<br>` in copy.
 * The "how it works" step cards are intentionally excluded — never run their
 * text through this.
 */
export function noWidows(text: string, minWords = 3): string {
  return text
    .split("\n")
    .map((segment) => tidy(segment, minWords))
    .join("\n");
}
