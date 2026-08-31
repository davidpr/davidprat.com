import { describe, it, expect } from "vitest";
import { site } from "@/content/site";

describe("site content", () => {
  it("has the core identity fields", () => {
    expect(site.name).toBe("David Prat Robles");
    expect(site.headline.length).toBeGreaterThan(10);
    expect(site.location).toContain("Barcelona");
  });

  it("contains no emoji or unicode-bold characters anywhere", () => {
    const all = JSON.stringify(site);
    expect(all).not.toMatch(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1D400}-\u{1D7FF}]/u);
  });

  it("has only absolute https hrefs in links", () => {
    const links = [
      ...site.heroLinks,
      ...site.writing.articles,
      ...site.writing.channels,
      ...site.contact.links,
    ];
    for (const l of links) expect(l.href).toMatch(/^https:\/\//);
  });

  it("does not publish an email address", () => {
    expect(JSON.stringify(site)).not.toMatch(/@gmail|mailto:/i);
  });

  it("carries the LinkedIn About substance", () => {
    expect(site.aboutHighlights.length).toBeGreaterThanOrEqual(4);
    const all = JSON.stringify(site.aboutHighlights);
    expect(all).toMatch(/€20M/);
    expect(all).toMatch(/€40M/);
    expect(site.writing.channels.map((c) => c.href)).toContain(
      "https://www.youtube.com/@davidpratr",
    );
    expect(site.writing.articles.length).toBeGreaterThanOrEqual(1);
  });

  it("has an availability line and stats", () => {
    expect(site.availability.length).toBeGreaterThan(10);
    expect(site.stats.length).toBeGreaterThanOrEqual(3);
    for (const s of site.stats) {
      expect(s.value).toBeTruthy();
      expect(s.label).toBeTruthy();
    }
  });

  it("has the full career timeline with periods", () => {
    expect(site.experience.length).toBeGreaterThanOrEqual(8);
    for (const e of site.experience) {
      expect(e.period).toMatch(/^\d{4}/);
      expect(e.org).toBeTruthy();
      expect(e.role).toBeTruthy();
      expect(e.points.length).toBeGreaterThan(0);
    }
    const orgs = site.experience.map((e) => e.org);
    expect(orgs).toContain("BNP Paribas Fortis");
    expect(orgs).not.toContain("Finlooker.io");
    expect(orgs[0]).toBe("Multiverse Computing");
    expect(site.experienceVisibleCount).toBe(3);
  });

  it("lists Finlooker and the model releases as projects", () => {
    const names = site.projects.map((p) => p.name);
    expect(names).toContain("Finlooker.io");
    expect(names.join(" ")).toMatch(/Blackstar/);
    for (const p of site.projects) {
      if (p.href) expect(p.href).toMatch(/^https:\/\//);
      expect(p.description).toBeTruthy();
      expect(p.byline).toBeTruthy();
    }
    expect(site.projectsVisibleCount).toBe(3);
  });

  it("has the full education history", () => {
    expect(site.education.length).toBeGreaterThanOrEqual(4);
    const schools = site.education.map((e) => e.school).join(" ");
    expect(schools).toMatch(/EAE/);
    expect(schools).toMatch(/Politècnica de Catalunya/);
  });
});
