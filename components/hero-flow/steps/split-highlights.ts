export interface Highlight {
  /** Exact substring of the intake message to mark. */
  text: string;
  /** Chip label for the kind of data this keyword is (customer, date...). */
  entity: string;
}

export interface Segment {
  text: string;
  entity?: string;
  /** Order in which this marker animates (0-based), for marked segments. */
  markIndex?: number;
}

/**
 * Splits `message` into plain and highlighted segments. Highlights are
 * matched in order, each searched after the previous match, so the same
 * word can be marked more than once; a highlight not found is skipped.
 */
export function splitHighlights(message: string, highlights: Highlight[]): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;
  let markIndex = 0;
  for (const { text, entity } of highlights) {
    const at = message.indexOf(text, cursor);
    if (at === -1 || text === "") continue;
    if (at > cursor) segments.push({ text: message.slice(cursor, at) });
    segments.push({ text, entity, markIndex: markIndex++ });
    cursor = at + text.length;
  }
  if (cursor < message.length) segments.push({ text: message.slice(cursor) });
  return segments;
}
