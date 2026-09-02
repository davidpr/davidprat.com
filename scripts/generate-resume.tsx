// Generates an ATS-friendly résumé PDF from content/site.ts.
// Usage: npm run generate:resume
//
// ATS-safety rules followed here: single-column reading order, standard
// Helvetica font (no embedding needed), real text layer (react-pdf never
// rasterizes text — only the photo/logos are images), standard section
// headings. Colour, the photo and company logos are purely decorative
// and never the only carrier of any text (name/dates/bullets are always
// real text), so they don't hurt parsing.
import { writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import sharp from "sharp";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { site, type ExperienceItem } from "../content/site";

const CONTACT_EMAIL = "david.prat@gmail.com";
const CONTACT_PHONE = "+34 606 59 14 42";
// Résumé-only elaboration of the summary, synthesized from site.aboutHighlights
// and site.aboutClosing — kept out of content/site.ts since a résumé summary
// reads more compressed/achievement-first than the website's About prose.
const RESUME_SUMMARY_EXTRA =
  "Recent highlights include leading AI initiatives at Multiverse Computing that delivered €20M+ in new revenue and roughly 50% average cost savings for enterprise clients through quantum-inspired LLM compression; directing aviation-maintenance technical products at IAG that generated over €40M in measurable cost savings; and founding Datapta and Finlooker, building a rotating team of 40+ engineers. Currently building Finlooker.io independently while completing an Executive MBA at EAE, and exploring my next senior engineering leadership role.";
const EARLY_CAREER_CUTOFF_YEAR = 2016; // roles starting before this are condensed to one line
const PUBLIC_DIR = join(process.cwd(), "public");
const ACCENT = "#6d28d9"; // violet-700, matches the site's gradient-text accent
const SUBACCENT = "#0e7490"; // cyan-700, matches the site's role-label color
const MUTED = "#525252";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.3,
    padding: "32 40",
    color: "#111111",
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { flex: 1, paddingRight: 16 },
  photo: { width: 56, height: 56, borderRadius: 28 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", color: ACCENT, lineHeight: 1.2 },
  headline: { fontSize: 12, marginTop: 6, lineHeight: 1.2 },
  contactGrid: { flexDirection: "row", marginTop: 8, gap: 28 },
  contactCol: { flexDirection: "column" },
  contactItem: { flexDirection: "row", fontSize: 9, marginTop: 2.5 },
  contactLabel: { color: MUTED, width: 48 },
  contactValue: { color: "#111111" },
  headerRule: { height: 2, backgroundColor: ACCENT, marginTop: 12 },
  section: { marginTop: 12 },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: ACCENT,
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: { fontSize: 9.5, marginTop: 4 },
  skillsText: { fontSize: 9.5 },
  role: { marginBottom: 7 },
  roleHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  roleOrgRow: { flexDirection: "row", alignItems: "center" },
  logo: { width: 16, height: 16, marginRight: 6, objectFit: "contain" },
  roleTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  rolePeriod: { fontSize: 9, color: MUTED },
  roleSubtitle: { fontSize: 9.5, fontStyle: "italic", color: SUBACCENT, marginTop: 1 },
  bulletRow: { flexDirection: "row", marginTop: 2.5 },
  bulletMark: { width: 9, fontSize: 9.5, color: ACCENT },
  bulletText: { flex: 1, fontSize: 9.5 },
  earlyCareerLine: { fontSize: 9.5, marginTop: 3 },
  eduLine: { fontSize: 9.5, marginTop: 4 },
  eduSchool: { fontFamily: "Helvetica-Bold" },
  certLine: { fontSize: 9.5, marginTop: 2 },
  langLine: { fontSize: 9.5, marginTop: 3 },
});

function startYear(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : 0;
}

const recentExperience = site.experience.filter(
  (e) => startYear(e.period) >= EARLY_CAREER_CUTOFF_YEAR
);
const earlyExperience = site.experience.filter(
  (e) => startYear(e.period) < EARLY_CAREER_CUTOFF_YEAR
);

type LogoSource = string | { data: Buffer; format: "png" };

async function loadLogo(relPath: string): Promise<LogoSource> {
  const abs = join(PUBLIC_DIR, relPath);
  if (extname(abs).toLowerCase() === ".svg") {
    const png = await sharp(abs)
      .resize(96, 96, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .png()
      .toBuffer();
    return { data: png, format: "png" };
  }
  return abs; // react-pdf loads local PNG/JPG file paths directly under Node
}

async function loadLogos(experience: ExperienceItem[]): Promise<Map<string, LogoSource>> {
  const entries = await Promise.all(
    experience
      .filter((e): e is ExperienceItem & { logo: string } => Boolean(e.logo))
      .map(async (e) => [`${e.org}-${e.role}`, await loadLogo(e.logo)] as const)
  );
  return new Map(entries);
}

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function findLink(label: string): string {
  return site.heroLinks.find((l) => l.label === label)?.href ?? "";
}

const contactItems: { label: string; value: string }[] = [
  { label: "Email", value: CONTACT_EMAIL },
  { label: "Phone", value: CONTACT_PHONE },
  { label: "Location", value: site.location },
  { label: "LinkedIn", value: findLink("LinkedIn") },
  { label: "Website", value: "https://davidprat.com" },
  { label: "GitHub", value: findLink("GitHub") },
];
const contactColLeft = contactItems.filter((_, i) => i % 2 === 0);
const contactColRight = contactItems.filter((_, i) => i % 2 === 1);

function ContactColumn({ items }: { items: { label: string; value: string }[] }) {
  return (
    <View style={styles.contactCol}>
      {items.map((item) => (
        <View key={item.label} style={styles.contactItem}>
          <Text style={styles.contactLabel}>{item.label}</Text>
          <Text style={styles.contactValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function ResumeDocument({ logos }: { logos: Map<string, LogoSource> }) {
  return (
    <Document title={`${site.name} — Résumé`} author={site.name} subject={site.headline}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{site.name}</Text>
            <Text style={styles.headline}>{site.headline}</Text>
            <View style={styles.contactGrid}>
              <ContactColumn items={contactColLeft} />
              <ContactColumn items={contactColRight} />
            </View>
          </View>
          <Image style={styles.photo} src={join(PUBLIC_DIR, "avatar.jpg")} />
        </View>
        <View style={styles.headerRule} />

        <View style={styles.section}>
          <SectionTitle>Summary</SectionTitle>
          {[...site.about, RESUME_SUMMARY_EXTRA].map((p) => (
            <Text key={p} style={styles.summaryText}>
              {p}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>Skills</SectionTitle>
          <Text style={styles.skillsText}>{site.topSkills.join(" · ")}</Text>
        </View>

        <View style={styles.section}>
          <SectionTitle>Professional Experience</SectionTitle>
          {recentExperience.map((e) => {
            const logo = logos.get(`${e.org}-${e.role}`);
            return (
              <View key={`${e.org}-${e.role}`} style={styles.role} wrap={false}>
                <View style={styles.roleHeaderRow}>
                  <View style={styles.roleOrgRow}>
                    {logo && <Image style={styles.logo} src={logo} />}
                    <Text style={styles.roleTitle}>{e.org}</Text>
                  </View>
                  <Text style={styles.rolePeriod}>{e.period}</Text>
                </View>
                <Text style={styles.roleSubtitle}>{e.role}</Text>
                {e.points.map((point) => (
                  <View key={point} style={styles.bulletRow}>
                    <Text style={styles.bulletMark}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <SectionTitle>Early Career</SectionTitle>
          {earlyExperience.map((e) => (
            <Text key={`${e.org}-${e.role}`} style={styles.earlyCareerLine}>
              {e.role}, {e.org} ({e.period})
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>Education</SectionTitle>
          {site.education.map((ed) => (
            <Text key={`${ed.school}-${ed.degree}`} style={styles.eduLine}>
              <Text style={styles.eduSchool}>{ed.school}</Text> — {ed.degree} ({ed.period})
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>Certifications</SectionTitle>
          {site.certifications.map((c) => (
            <Text key={c.name} style={styles.certLine}>
              {c.name} — {c.issuer}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <SectionTitle>Languages</SectionTitle>
          {site.languages.map((l) => (
            <Text key={l.name} style={styles.langLine}>
              {l.name} ({l.level}){l.credential ? ` — ${l.credential}` : ""}
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
}

async function main() {
  const logos = await loadLogos(recentExperience);
  const buffer = await renderToBuffer(<ResumeDocument logos={logos} />);
  const outPath = join(PUBLIC_DIR, "david-prat-robles-resume.pdf");
  await writeFile(outPath, buffer);
  console.log(`Wrote ${outPath} (${(buffer.length / 1024).toFixed(0)} KB)`);
}

main();
