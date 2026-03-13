interface EducationEntry {
    name: string;
    batch: string;
}

interface ExperienceEntry {
    company: string;
    designation: string;
    startDate: string;
    endDate: string;
    durationMonths: number;
}

interface ParsedResumeJson {
    name: string | null;
    email: string | null;
    phone: string | null;
    education: EducationEntry[];
    skills: string[];
    experience: ExperienceEntry[];
    totalExperience: number;
}

export type {
    EducationEntry,
    ExperienceEntry,
    ParsedResumeJson
}