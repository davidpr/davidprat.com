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
    expect(site.externalArticles.length).toBeGreaterThanOrEqual(1);
    for (const a of site.externalArticles) {
      expect(a.href).toMatch(/^https:\/\//);
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(a.source).toBeTruthy();
    }
  });

  it("has an availability line and top skills", () => {
    expect(site.availability.length).toBeGreaterThan(10);
    expect(site.topSkills.length).toBe(5);
    for (const s of site.topSkills) {
      expect(s).toBeTruthy();
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

  it("keeps projects in chronological order with portfolio imports and existing images", () => {
    expect(site.projects.length).toBeGreaterThanOrEqual(17);
    expect(site.projects.map((p) => p.name).join(" ")).toMatch(/Tegra 2/);
    const names = site.projects.map((p) => p.name).join(" | ");
    expect(names).toMatch(/Universal Data Catalog/);
    expect(names).toMatch(/Electricity Consumption/);
    expect(names).toMatch(/Genomics Data Catalog/);
    expect(names).toMatch(/Finlooker\.com \(v1\)/);
    expect(names).toMatch(/Fincoach/);
    expect(names).toMatch(/Estabanell/);
    const years = site.projects.map((p) => {
      const m = p.period.match(/(\d{4})(?!.*\d{4})/);
      return p.period.includes("present") ? 9999 : Number(m![1]);
    });
    for (let i = 1; i < years.length; i++) {
      expect(years[i - 1] >= years[i], `order at ${site.projects[i].name}`).toBe(true);
    }
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
