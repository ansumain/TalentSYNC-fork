import { QueryTypes } from 'sequelize';
import { sequelize } from '@talentsync/config';
import { Counters } from '../types/Counters.type';
import { getLastUpdated } from '../utils/getLastUpdated';
import { toNumber } from '../utils/toNumber';

const getAllCounterDataRepository = async (fromDate: string, toDate: string): Promise<Counters> => {
    const summaryQuery = `
        SELECT
            COALESCE(SUM(scheduled), 0) AS scheduled,
            COALESCE(SUM(completed), 0) AS completed,
            COALESCE(SUM(cancelled), 0) AS cancelled,
            COALESCE(SUM("noShow"), 0) AS "noShow",
            COALESCE(SUM(hires), 0) AS hires,
            MAX("lastRefreshedAt") AS "lastUpdatedAt"
        FROM aggregation.analytics_counters
        WHERE date BETWEEN :fromDate AND :toDate
    `;

    const openJobsQuery = `
        SELECT "openJobs"
        FROM aggregation.analytics_counters
        WHERE date BETWEEN :fromDate AND :toDate
        ORDER BY date DESC
        LIMIT 1
    `;

    const [summary] = await sequelize.query<{
        scheduled: string;
        completed: string;
        cancelled: string;
        noShow: string;
        hires: string;
        lastUpdatedAt: string | null;
    }>(summaryQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate }
        }
    );

    const [openJobsSnapshot] = await sequelize.query<{ openJobs: string }>(openJobsQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate }
        }
    );

    return {
        interviews: {
            scheduled: toNumber(summary?.scheduled),
            completed: toNumber(summary?.completed),
            cancelled: toNumber(summary?.cancelled),
            noShow: toNumber(summary?.noShow),
        },
        openJobs: toNumber(openJobsSnapshot?.openJobs),
        hires: toNumber(summary?.hires),
        lastUpdatedAt: getLastUpdated(summary?.lastUpdatedAt),
    };
};

export { getAllCounterDataRepository };