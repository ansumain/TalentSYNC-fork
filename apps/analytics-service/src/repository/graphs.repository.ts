import { QueryTypes } from 'sequelize';
import { sequelize } from '@talentsync/config';
import { Graphs } from '../types/Graphs.type';
import { getLatestTimestamp } from '../utils/getLatestTimeStamp';
import { toNumber } from '../utils/toNumber';

const getAllGraphDataRepository = async (fromDate: string, toDate: string, top: 3 | 5 | 10): Promise<Graphs> => {
    const skillGapQuery = `
        SELECT
            "skillId",
            "skillName",
            COALESCE(SUM("demandCount"), 0) AS "demandCount",
            COALESCE(SUM("supplyCount"), 0) AS "supplyCount"
        FROM aggregation.analytics_graphs
        WHERE date BETWEEN :fromDate AND :toDate
        GROUP BY "skillId", "skillName"
        ORDER BY "demandCount" DESC
    `;

    const pieChartQuery = `
        SELECT
            "jobId",
            "jobTitle",
            COALESCE(SUM(applied), 0) AS "applicationCount"
        FROM aggregation.analytics_recruitment_funnel
        WHERE date BETWEEN :fromDate AND :toDate
        GROUP BY "jobId", "jobTitle"
        ORDER BY "applicationCount" DESC
        LIMIT :top
    `;

    const graphLastUpdatedQuery = `
        SELECT MAX("lastRefreshedAt") AS "lastUpdatedAt"
        FROM aggregation.analytics_graphs
        WHERE date BETWEEN :fromDate AND :toDate
    `;

    const funnelLastUpdatedQuery = `
        SELECT MAX("lastRefreshedAt") AS "lastUpdatedAt"
        FROM aggregation.analytics_recruitment_funnel
        WHERE date BETWEEN :fromDate AND :toDate
    `;

    const skillGapBar = await sequelize.query<{
        skillId: string;
        skillName: string;
        demandCount: string;
        supplyCount: string;
    }>(skillGapQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate }
        }
    );

    const jobApplicationsPie = await sequelize.query<{
        jobId: string;
        jobTitle: string;
        applicationCount: string;
    }>(pieChartQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate, top }
        }
    );

    const [graphLastUpdated] = await sequelize.query<{ lastUpdatedAt: string | null }>(graphLastUpdatedQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate }
        }
    );

    const [funnelLastUpdated] = await sequelize.query<{ lastUpdatedAt: string | null }>(funnelLastUpdatedQuery,
        {
            type: QueryTypes.SELECT,
            replacements: { fromDate, toDate }
        }
    );

    const lastUpdatedAt = getLatestTimestamp(graphLastUpdated?.lastUpdatedAt, funnelLastUpdated?.lastUpdatedAt);

    return {
        skillGapBar: skillGapBar.map((row: { skillId: string; skillName: string; demandCount: string; supplyCount: string }) => ({
            skillId: row.skillId,
            skillName: row.skillName,
            demandCount: toNumber(row.demandCount),
            supplyCount: toNumber(row.supplyCount),
        })),
        jobApplicationsPie: jobApplicationsPie.map((row: { jobId: string; jobTitle: string; applicationCount: string }) => ({
            jobId: row.jobId,
            jobTitle: row.jobTitle,
            applicationCount: toNumber(row.applicationCount),
        })),
        top,
        lastUpdatedAt,
    };
};

export { getAllGraphDataRepository };