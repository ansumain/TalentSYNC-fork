import tesseract from 'node-tesseract-ocr';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import fs from 'fs/promises';
import { convertPDFToImages } from './pdfToImage';
import mammoth from 'mammoth';

const tesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 3,
    binary: "\"C:\\Program Files\\Tesseract-OCR\\tesseract.exe\""
};

// File - Image
const getTextUsingOCR = async (filePath: string) => {
    try {
        const text = await tesseract.recognize(filePath, tesseractConfig);
        return text.trim();
    } catch (error) {
        console.log('Error parsing image using tesseract', error);
        throw new Error('Error parsing image using tesseract');
    }
}

// File - Text Parsable PDF
const getTextUsingPdfparse = async (filePath: string) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        if (data.text.length < 100) {
            return await extractTextFromPDFImage(filePath);
        }
        return data.text.trim();
    } catch (error) {
        console.log('Error parsing PDF using pdf-parse', error);
        throw new Error('Error parsing PDF using pdf-parse');
    }
}

// File - Image based PDF
const extractTextFromPDFImage = async (filePath: string) => {
    try {
        const pdfPages = await convertPDFToImages(filePath);

        const ocrPromises = pdfPages.map(async (pagePath) => {
            return await getTextUsingOCR(pagePath);
        });

        const textFromPages = await Promise.all(ocrPromises);

        return textFromPages.join('\n');
    } catch (error) {
        console.log('Error parsing image based PDF', error);
        throw new Error('Error parsing image based PDF');
    }
}

// File - DOCX
export const getTextUsingMammoth = async (filePath: string): Promise<string> => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });

        if (result.messages.length > 0) {
            console.log('Mammoth warnings:', result.messages);
        }

        return result.value.trim();
    } catch (error) {
        console.log('Error parsing DOCX with Mammoth:', error);
        throw new Error('Error parsing DOCX with Mammoth');
    }
};

export { getTextUsingOCR, getTextUsingPdfparse }