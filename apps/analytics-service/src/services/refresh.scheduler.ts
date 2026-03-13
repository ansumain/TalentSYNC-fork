import cron from 'node-cron';
import { runAnalyticsRefresh } from './refresh.service';

const CRON_EXPRESSION = '*/30 * * * *';

const startAnalyticsRefreshScheduler = () => {
    const job = cron.schedule(CRON_EXPRESSION, async () => {
        try {
            await runAnalyticsRefresh('cron', 'scheduled 30-minute refresh');
            console.log('analytics-refresh: scheduled refresh completed');
        } catch (error) {
            console.error('analytics-refresh: scheduled refresh failed', error);
        }
    });

    console.log(`analytics-refresh: scheduler started with expression: ${CRON_EXPRESSION}`);
    return job;
};

export { startAnalyticsRefreshScheduler };
