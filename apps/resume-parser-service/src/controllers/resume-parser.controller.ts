import { Request, Response } from 'express';
import { getTextFromResume } from '../services/tesseract.service';

export class ResumeParserController {
  static async parseResume(req: Request, res: Response): Promise<void> {
    try {

        if(!req.file) throw new Error('No File Uploaded');

        const rawTextFromResume = await getTextFromResume(req.file.path);
        console.log('raw text - ', rawTextFromResume);
        if(rawTextFromResume){
            res.status(201).json({
                rawText: rawTextFromResume
            })
        } else {
            res.status(201).json({
                message: 'Resume uploaded but not parsed!'
            })
        }

      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
