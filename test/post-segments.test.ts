import { describe, it, expect } from "vitest";
import { splitDetails } from "@/lib/posts";

describe("splitDetails", () => {
  it("returns the whole body as one markdown segment when there is no block", () => {
    expect(splitDetails("Hello\n\nWorld")).toEqual([{ kind: "markdown", text: "Hello\n\nWorld" }]);
  });

  it("splits :::details blocks into collapsible segments", () => {
    const body = "Before\n\n:::details Show the original\n![img](/a.png)\n:::\n\nAfter";
    expect(splitDetails(body)).toEqual([
      { kind: "markdown", text: "Before\n\n" },
      { kind: "details", summary: "Show the original", text: "![img](/a.png)" },
      { kind: "markdown", text: "\n\nAfter" },
    ]);
  });

  it("handles several blocks", () => {
    const body = ":::details A\none\n:::\nmid\n:::details B\ntwo\n:::";
    const kinds = splitDetails(body).map((s) => s.kind);
    expect(kinds).toEqual(["details", "markdown", "details"]);
  });
});
