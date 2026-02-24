import { Request, Response } from 'express';
import { getTextUsingMammoth, getTextUsingOCR, getTextUsingPdfparse } from '../services/extractText.service';
import { UploadedFile } from '../types/UploadedFile';
import { allowedMimeTypes } from '../config/allowed-file-type';
import { extractBasicDetails } from '../services/parseToJSONFromRawText.service';

export interface FormattedJson {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export class ResumeParserController {
  static async parseResume(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files || (req.files as any).length === 0) throw new Error('No File Uploaded');

      const files = req.files as unknown as UploadedFile[];
      let rawTextData: string[] = [];
      let formattedJson: FormattedJson[] = [];

      for (const file of files) {
        let extractedText = '';

        if (allowedMimeTypes.IMAGE.includes(file.mimetype)) {
          extractedText = await getTextUsingOCR(file.path);
        } 
        else if (allowedMimeTypes.PDF.includes(file.mimetype)) {
          extractedText = await getTextUsingPdfparse(file.path);
        } 
        else if (allowedMimeTypes.DOCX.includes(file.mimetype)) {
          extractedText = await getTextUsingMammoth(file.path);
        }

        if (extractedText) {
          rawTextData.push(`${file.mimetype} == ${extractedText}`);
          formattedJson.push(extractBasicDetails(extractedText));
        }
      }

      res.status(201).json({
        message: 'uploaded',
        rawTextData,
        formattedJson
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  }
}
