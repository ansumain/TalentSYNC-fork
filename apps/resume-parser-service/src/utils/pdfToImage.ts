// import pdfPoppler from 'pdf-poppler';
// import path from 'path';
// import fs from 'fs';

// export const convertPDFToImages = async (pdfPath: string) => {
//     const outputDir = path.join(process.cwd(), "temp", `${path.basename(pdfPath)}-images`);

//     fs.mkdirSync(outputDir, { recursive: true });

//     const options = {
//         format: 'png' as const,
//         out_dir: outputDir,
//         out_prefix: 'page',
//         page: null,
//         dpi: 300
//     };

//     await pdfPoppler.convert(pdfPath, options);

//     return fs.readdirSync(outputDir).filter(file => file.startsWith('page')).map(file => path.join(outputDir, file));
// }

import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

// converts exec in a promise based function
const execAsync = promisify(exec);

// convert each pdf page to image.
export const convertPDFToImages = async (pdfPath: string) => {
    const outputDir = path.join(process.cwd(), "temp", `${path.basename(pdfPath)}-images`);

    fs.mkdirSync(outputDir, { recursive: true });

    const outputPrefix = path.join(outputDir, 'page');
    await execAsync(`pdftoppm -r 300 -png "${pdfPath}" "${outputPrefix}"`);

    return fs.readdirSync(outputDir)
        .filter(file => file.startsWith('page') && file.endsWith('.png'))
        .sort()
        .map(file => path.join(outputDir, file));
}