import tesseract from 'node-tesseract-ocr';

export const tesseractConfig = {
    lang: "eng",
    oem: 1,
    psm: 3,
    binary: "\"C:\\Program Files\\Tesseract-OCR\\tesseract.exe\""
};

const getTextFromResume = async (filePath: string) => {
    try {
        const text = await tesseract.recognize(filePath, tesseractConfig);
        return text.trim();
    } catch {
        console.log('error parsing the uploaded file');
    }
}

export { getTextFromResume }