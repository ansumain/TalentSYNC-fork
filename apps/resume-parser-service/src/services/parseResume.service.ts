import { getTextUsingMammoth, getTextUsingOCR, getTextUsingPdfparse } from '../utils/extractText';
import { allowedMimeTypes } from '@talentsync/config';
import { extractBasicDetails } from '../utils/parseToJSONFromRawText';

export interface FormattedJson {
    name: string | null;
    phone: string | null;
    email: string | null;
}

export interface FileType {
    fileURL: string;
    mimeType: string;
}

export interface ParseResumeOutput {
    rawText: string;
    parsedJSON: FormattedJson;
}


const parseResume = async (file: FileType): Promise<ParseResumeOutput> => {
    const { mimeType, fileURL } = file;
    try {

        let extractedText = '';
        let formattedJson: FormattedJson = { name: '', phone: '', email: '' };

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
            formattedJson = extractBasicDetails(extractedText);
        }

        return {
            rawText: extractedText,
            parsedJSON: formattedJson
        }

    } catch (error: any) {
        throw new Error('Parsing worker failed');
    }

}

export { parseResume };
