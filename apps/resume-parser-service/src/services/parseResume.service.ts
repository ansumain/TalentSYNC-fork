import { getTextUsingMammoth, getTextUsingOCR, getTextUsingPdfparse } from '../utils/extractText';
import { allowedMimeTypes } from '@talentsync/config';
import { extractBasicDetails, ParsedResumeJson } from '../utils/parseToJSONFromRawText';
export type { ParsedResumeJson as FormattedJson };

export interface FileType {
    fileURL: string;
    mimeType: string;
}

export interface ParseResumeOutput {
    rawText: string;
    parsedJSON: ParsedResumeJson;
}


const parseResume = async (file: FileType): Promise<ParseResumeOutput> => {
    const { mimeType, fileURL } = file;
    try {

        let extractedText = '';
        let parsedJSON: ParsedResumeJson = {
            name: null, email: null, phone: null,
            education: [], skills: [], experience: [], totalExperience: 0
        };

        if (allowedMimeTypes.IMAGE.includes(mimeType)) {
            extractedText = await getTextUsingOCR(fileURL);
        }
        else if (allowedMimeTypes.PDF.includes(mimeType)) {
            extractedText = await getTextUsingPdfparse(fileURL);
        }
        else if (allowedMimeTypes.DOCX.includes(mimeType)) {
            extractedText = await getTextUsingMammoth(fileURL);
        }

        if (extractedText) {
            parsedJSON = extractBasicDetails(extractedText);
        }

        return {
            rawText: extractedText,
            parsedJSON
        }

    } catch (error: any) {
        throw new Error('Parsing worker failed');
    }

}

export { parseResume };
