// Non-breaking space (U+00A0). Built from a char code so the source stays pure
// ASCII — no literal NBSP that could be silently transcribed as a normal space.
const NBSP = String.fromCharCode(0xa0);

/**
 * Widow control for body copy.
 *
 * Guarantees the last visual line of each line-break-delimited segment keeps at
 * least `minWords` words together, by joining the trailing words with
 * non-breaking spaces. The bound group can only wrap as a unit, so the last
 * line never strands fewer than `minWords` words — if they don't fit, the whole
 * group drops to a new line together.
 *
 * Operates per `\n` segment so it composes with `whitespace-pre-line` text
 * (e.g. FAQ answers that embed hard line breaks).
 *
 * This is the canonical way to enforce the ">= 3 word widow" rule site-wide.
 * Do NOT do it with hand-placed `&nbsp;`/`<br>` in the copy. The "how it works"
 * step cards are intentionally excluded — never run their text through this.
 */
export function noWidows(text: string, minWords = 3): string {
  return text
    .split("\n")
    .map((segment) => {
      const words = segment.split(" ");
      if (words.length <= minWords) return segment;
      const head = words.slice(0, -minWords);
      const tail = words.slice(-minWords).join(NBSP);
      return [...head, tail].join(" ");
    })
    .join("\n");
}
