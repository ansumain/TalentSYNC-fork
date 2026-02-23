import app from './app';
import { config } from './config/env';

const startServer = async () => {
    try {
        app.listen(config.port, () => {
            console.log(`Resume Parser service running on port ${config.port}`);
        });
    } catch (error) {
        console.error('Unable to start Resume Parser service', error);
        process.exit(1);
    }
};

startServer();
