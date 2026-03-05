import { Server, EVENTS } from '@tus/server';
import { FileStore } from '@tus/file-store';
import path from 'path';
import { addToResumeData } from '../repository/resume.repository';
import { publishToQueue } from './rabbitmq';
import { config } from './env';

export const uploadPath = path.join(process.cwd(), 'uploads');

const tusServer = new Server({
    path: '/api/resume/upload',
    datastore: new FileStore({
        directory: uploadPath
    })
});


tusServer.on(EVENTS.POST_CREATE, async (req, upload) => {
    const metadata = upload.metadata;

    const fileName = metadata?.filename;
    let mimeType = metadata?.filetype;

    console.log('(POST_CREATE) - fileName:', fileName);
    console.log('(POST_CREATE) - mimeType:', mimeType);

    // if (!mimeType) mimeType = manualMimeTypeAssigner(fileName);

    if (!fileName || !mimeType) throw new Error('missing upload metadata');

    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(mimeType)) throw new Error('unsupported file type');
});

tusServer.on(EVENTS.POST_FINISH, async (req, upload: any) => {
    try {
        const storeUpload = await tusServer.datastore.getUpload(upload.id);
        const metadata = storeUpload?.metadata;

        const fileName = metadata?.filename;
        let mimeType = metadata?.filetype;

        console.log('(POST_FINISH) - fileName:', fileName);
        console.log('(POST_FINISH) - mimeType:', mimeType);
        // if (!mimeType) mimeType = manualMimeTypeAssigner(fileName);

        if (!fileName || !mimeType) throw new Error('missing upload metadata');

        const userId = (req as any).userInfo?.sub;

        if (!userId) throw new Error('unauthorized upload');

        const fileURL = path.join(process.cwd(), 'uploads', upload.id);

        // console.log('upload finished:', { userId, filename, filetype, filePath });

        const resumeId = await addToResumeData({ userId, fileName, mimeType, fileURL, status: 'queued' });

        await publishToQueue(config.queues.resumeParse, { resumeId }, 0)
    }
    catch (error) {
        console.error('POST_FINISH error:', error);
    }
});


// const manualMimeTypeAssigner = (fileName: any) => {
//     if (fileName?.includes('jpeg')) return 'image/jpeg'
//     else if (fileName?.includes('png')) return 'image/png'
//     else if (fileName?.includes('webp')) return 'image/webp'
//     else if (fileName?.includes('pdf')) return 'application/pdf'
//     else if (fileName?.includes('docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     else throw new Error('unsupported upload');
// }

export const tusHandler = tusServer.handle.bind(tusServer);