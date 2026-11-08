import { describe, expect, it } from "vitest";
import { splitHighlights, type Highlight } from "@/components/hero-flow/steps/split-highlights";
import he from "@/messages/he.json";
import en from "@/messages/en.json";

describe("splitHighlights", () => {
  it("splits plain and marked segments in order", () => {
    const segs = splitHighlights("a bc d bc", [
      { text: "bc", entity: "x" },
      { text: "bc", entity: "y" },
    ]);
    expect(segs).toEqual([
      { text: "a " },
      { text: "bc", entity: "x", markIndex: 0 },
      { text: " d " },
      { text: "bc", entity: "y", markIndex: 1 },
    ]);
  });

  it("skips highlights that are not in the message", () => {
    expect(splitHighlights("hello", [{ text: "zzz", entity: "x" }])).toEqual([{ text: "hello" }]);
  });

  // Guards copy edits: every analysis keyword must appear in the intake message.
  for (const [name, messages] of [["he", he], ["en", en]] as const) {
    it(`${name}: every hero highlight is found in the intake message`, () => {
      const { message } = messages.hero.flow.steps.intake;
      const highlights = messages.hero.flow.steps.analysis.highlights as Highlight[];
      const marked = splitHighlights(message, highlights).filter((s) => s.entity);
      expect(marked).toHaveLength(highlights.length);
      expect(marked.map((s) => s.text).join("")).toBe(highlights.map((h) => h.text).join(""));
    });
  }
});
