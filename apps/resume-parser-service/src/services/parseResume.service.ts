import { getTextUsingMammoth, getTextUsingOCR, getTextUsingPdfparse } from '../utils/extractText';
import { allowedMimeTypes } from '@talentsync/config';
import { internalServerError } from '@talentsync/types';
import { extractBasicDetails } from '../utils/parseToJSONFromRawText';
import type { ParsedResumeJson } from '../types/ExtractData.type';
export type { ParsedResumeJson as FormattedJson };
import type { FileType, ParseResumeOutput } from '../types/ParseResume.type';

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

    } catch {
        throw internalServerError('Parsing worker failed', 'RESUME_PARSE_FAILED');
    }

}

export { parseResume };
