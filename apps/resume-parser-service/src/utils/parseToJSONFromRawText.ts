export interface EducationEntry {
  name: string;
  batch: string;
}

export interface ExperienceEntry {
  company: string;
  designation: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
}

export interface ParsedResumeJson {
  name: string | null;
  email: string | null;
  phone: string | null;
  education: EducationEntry[];
  skills: string[];
  experience: ExperienceEntry[];
  totalExperience: number;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  january: 0, february: 1, march: 2, april: 3, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

const SECTION_HEADERS = /^(Profile|Education|Technologies|Experience)$/i;

export function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function extractSection(text: string, sectionName: string): string {
  const lines = text.split("\n");
  const startIdx = lines.findIndex(l => l.trim() === sectionName);
  if (startIdx === -1) return "";

  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (SECTION_HEADERS.test(lines[i].trim())) { endIdx = i; break; }
  }

  return lines.slice(startIdx + 1, endIdx).join("\n");
}

function parseDate(dateStr: string): Date | null {
  const s = dateStr.trim().toLowerCase();
  if (s === "present") return new Date();

  const my = s.match(/^([a-z]+)\s+(\d{4})$/);
  if (my) {
    const m = MONTHS[my[1]];
    const y = parseInt(my[2]);
    if (m !== undefined && !isNaN(y)) return new Date(y, m, 1);
  }

  const y = s.match(/^(\d{4})$/);
  if (y) return new Date(parseInt(y[1]), 0, 1);

  return null;
}

function monthsDiff(start: Date, end: Date): number {
  return Math.max(
    0,
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  );
}

export function extractName(text: string): string | null {
  const firstLine = text.split("\n").map(l => l.trim()).find(Boolean) ?? null;
  return firstLine;
}

export function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
  return match ? match[0] : null;
}

export function extractPhone(text: string): string | null {
  const match = text.match(/\b[1-9]\d{9}\b/);
  return match ? match[0] : null;
}

export function extractEducation(text: string): EducationEntry[] {
  const section = extractSection(text, "Education");
  if (!section) return [];

  const entries: EducationEntry[] = [];
  const lines = section.split("\n").map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const rangeMatch = line.match(/(\d{4})\s*[-\-]\s*(\d{4})/);
    const singleMatch = line.match(/\b(\d{4})\b/);

    if (rangeMatch || singleMatch) {
      const batch = rangeMatch
        ? `${rangeMatch[1]} - ${rangeMatch[2]}`
        : singleMatch![1];

      const name = line
        .replace(/\s*\d{4}\s*[-\-]\s*\d{4}.*$/, "")
        .replace(/\s*\b\d{4}\b.*$/, "")
        .replace(/[,\s]+$/, "")
        .trim();

      if (name) entries.push({ name, batch });
    } else {
      const nextLine = lines[i + 1] ?? "";
      const nextRange = nextLine.match(/^(\d{4})\s*[-\-]\s*(\d{4})$/);
      const nextSingle = nextLine.match(/^(\d{4})$/);

      if (nextRange || nextSingle) {
        const batch = nextRange
          ? `${nextRange[1]} - ${nextRange[2]}`
          : nextSingle![1];
        const name = line.replace(/[,\s]+$/, "").trim();
        if (name) entries.push({ name, batch });
        i++; 
      }
    }
  }

  return entries;
}

export function extractSkills(text: string): string[] {
  const section = extractSection(text, "Technologies");
  if (!section) return [];

  const skills: string[] = [];

  for (const line of section.split("\n").map(l => l.trim()).filter(Boolean)) {
    const content = line.includes(":") ? line.slice(line.indexOf(":") + 1) : line;
    content.split("|").forEach(part => {
      const skill = part.trim();
      if (skill) skills.push(skill);
    });
  }

  return [...new Set(skills)];
}

export function extractExperience(text: string): ExperienceEntry[] {
  const section = extractSection(text, "Experience") || extractSection(text, "EXPERIENCE");
  if (!section) return [];

  const entries: ExperienceEntry[] = [];

  const DATE_RANGE =
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})\s*[--]\s*((?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})|Present)/i;

  const GLUED_MONTH = /([a-z])(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/;

  const lines: string[] = [];
  for (const raw of section.split("\n").map(l => l.trim()).filter(Boolean)) {
    const glueMatch = raw.match(GLUED_MONTH);
    if (glueMatch) {
      const splitIdx = raw.search(GLUED_MONTH) + 1; 
      const left = raw.slice(0, splitIdx).trim();
      const right = raw.slice(splitIdx).trim();
      if (left) lines.push(left);
      if (right) lines.push(right);
    } else {
      lines.push(raw);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(DATE_RANGE);
    if (!dateMatch) continue; 

    const startDateStr = dateMatch[1];
    const endDateStr = dateMatch[2];
    const beforeDate = line.slice(0, dateMatch.index!).trim();

    let designation = "";
    let company = "";

    if (beforeDate) {
      const commaIdx = beforeDate.indexOf(",");
      designation = commaIdx !== -1 ? beforeDate.slice(0, commaIdx).trim() : beforeDate;
      company = commaIdx !== -1 ? beforeDate.slice(commaIdx + 1).trim() : "";
    } else if (i > 0 && !lines[i - 1].match(DATE_RANGE)) {
      const prevLine = lines[i - 1];
      const commaIdx = prevLine.indexOf(",");
      designation = commaIdx !== -1 ? prevLine.slice(0, commaIdx).trim() : prevLine;
      company = commaIdx !== -1 ? prevLine.slice(commaIdx + 1).trim() : "";
    }

    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);
    const durationMonths = startDate && endDate ? monthsDiff(startDate, endDate) : 0;

    entries.push({ company, designation, startDate: startDateStr, endDate: endDateStr, durationMonths });
  }

  return entries;
}

export function extractBasicDetails(rawText: string): ParsedResumeJson {
  const text = normalizeText(rawText);
  const experience = extractExperience(text);

  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
    education: extractEducation(text),
    skills: extractSkills(text),
    experience,
    totalExperience: experience.reduce((sum, e) => sum + e.durationMonths, 0),
  };
}
