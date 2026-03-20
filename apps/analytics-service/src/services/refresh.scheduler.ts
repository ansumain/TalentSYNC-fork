import cron from 'node-cron';
import { runAnalyticsRefresh } from './refresh.service';
import { logger } from '@talentsync/config';

const CRON_EXPRESSION = '*/30 * * * *';

const startAnalyticsRefreshScheduler = () => {
    const job = cron.schedule(CRON_EXPRESSION, async () => {
        try {
            await runAnalyticsRefresh('cron', 'scheduled 30-minute refresh');
            logger.info('analytics-refresh: scheduled refresh completed');
        } catch (error) {
            logger.error(`analytics-refresh: scheduled refresh failed: ${error}`);
        }
    });

    logger.info(`analytics-refresh: scheduler started with expression: ${CRON_EXPRESSION}`);
    return job;
};

export { startAnalyticsRefreshScheduler };
