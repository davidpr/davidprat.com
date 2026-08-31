import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav } from "@/components/Nav";

const expected = [
  ["About", "#about"],
  ["Experience", "#experience"],
  ["Portfolio", "#portfolio"],
  ["Education", "#education"],
  ["Certifications", "#certifications"],
  ["Languages", "#languages"],
  ["Articles", "#articles"],
  ["Contact", "#contact"],
];

describe("Nav", () => {
  it("links every section anchor in order", () => {
    render(<Nav />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(expected.length);
    links.forEach((link, i) => {
      expect(link).toHaveTextContent(expected[i][0]);
      expect(link).toHaveAttribute("href", expected[i][1]);
    });
  });
});
