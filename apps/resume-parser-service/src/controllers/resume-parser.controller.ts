import { Request, Response } from 'express';
import { getTextUsingMammoth, getTextUsingOCR, getTextUsingPdfparse } from '../services/extractText.service';
import { UploadedFile } from '../types/UploadedFile';
import { allowedMimeTypes } from '../config/allowed-file-type';

export class ResumeParserController {
  static async parseResume(req: Request, res: Response): Promise<void> {
    try {
      if (!req.files) throw new Error('No File Uploaded');

      const files = req.files as unknown as UploadedFile[];
      let rawText: string[] = [];

      for (const file of files) {
        if (allowedMimeTypes.IMAGE.includes(file.mimetype)) rawText.push(await getTextUsingOCR(file.path));
        else if (allowedMimeTypes.PDF.includes(file.mimetype)) rawText.push(await getTextUsingPdfparse(file.path));
      }

      res.status(201).json({
        message: 'uploaded',
        rawText
      })

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      const errorMessage = error.message || 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  }
}
