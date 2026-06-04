import tesseract from 'node-tesseract-ocr';
import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const require = createRequire(__filename);
const pdf = require('pdf-parse');
import fs from 'fs/promises';
import { convertPDFToImages } from './pdfToImage';
import mammoth from 'mammoth';
import { tesseractConfig } from '../config/tesseract-config';
import { logger } from '@talentsync/config';

// File - Image
const getTextUsingOCR = async (filePath: string) => {
    try {
        const text = await tesseract.recognize(filePath, tesseractConfig);
        return text.trim();
    } catch (error) {
        logger.error(`Error parsing image using tesseract: ${error}`);
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
        logger.error(`Error parsing PDF using pdf-parse: ${error}`);
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
        logger.error(`Error parsing image based PDF: ${error}`);
        throw new Error('Error parsing image based PDF');
    }
}

// File - DOCX
export const getTextUsingMammoth = async (filePath: string): Promise<string> => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });

        if (result.messages.length > 0) {
            logger.info(`Mammoth warnings: ${result.messages}`);
        }

        return result.value.trim();
    } catch (error) {
        logger.error(`Error parsing DOCX with Mammoth: ${error}`);
        throw new Error('Error parsing DOCX with Mammoth');
    }
};

export { getTextUsingOCR, getTextUsingPdfparse }