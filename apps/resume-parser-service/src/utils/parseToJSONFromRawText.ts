import { FormattedJson } from "../services/parseResume.service";

export function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
}

export function extractPhone(text: string): string | null {
  const phoneRegex = /(\+?\d{1,3}[\s-]?)?[6-9]\d{9}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : null;
}

export function extractName(text: string): string | null {
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean)
    .slice(0, 5);

  for (const line of lines) {
    if (
      !/\d/.test(line) &&
      line.length >= 3 &&
      line.length <= 50 &&
      !/resume|cv|curriculum|profile/i.test(line)
    ) {
      return line;
    }
  }
  return null;
}

export function extractBasicDetails(rawText: string): FormattedJson {
  const text = normalizeText(rawText);

  return {
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text)
  };
}
