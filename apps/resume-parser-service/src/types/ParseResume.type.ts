import type { ParsedResumeJson } from "./ExtractData.type";

interface FileType {
    fileURL: string;
    mimeType: string;
}

interface ParseResumeOutput {
    rawText: string;
    parsedJSON: ParsedResumeJson;
}

export type { FileType, ParseResumeOutput };