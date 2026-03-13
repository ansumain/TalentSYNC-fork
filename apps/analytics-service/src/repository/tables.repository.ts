import { QueryTypes } from 'sequelize';
import { sequelize } from '@talentsync/config';
import { Tables } from '../types/Tables.type';
import { toNumber } from '../utils/toNumber';
import { getLatestTimestamp } from '../utils/getLatestTimeStamp';

const round2 = (value: number) => Math.round(value * 100) / 100;

const getAllTableDataRepository = async (fromDate: string, toDate: string, jobId?: string): Promise<Tables> => {
        const isAllJobs = !jobId || jobId === 'all';

        const funnelAllJobsQuery = `
                SELECT
                        NULL::uuid AS "jobId",
                        'All Jobs' AS "jobTitle",
                        COALESCE(SUM(applied), 0) AS applied,
                        COALESCE(SUM(shortlisted), 0) AS shortlisted,
                        COALESCE(SUM(selected), 0) AS selected,
                        COALESCE(SUM(hired), 0) AS hired,
                        COALESCE(AVG("timeToHireDays"), 0) AS "timeToHireDays"
                FROM aggregation.analytics_recruitment_funnel
                WHERE date BETWEEN :fromDate AND :toDate
        `;

        const funnelSingleJobQuery = `
                SELECT
                        "jobId",
                        MAX("jobTitle") AS "jobTitle",
                        COALESCE(SUM(applied), 0) AS applied,
                        COALESCE(SUM(shortlisted), 0) AS shortlisted,
                        COALESCE(SUM(selected), 0) AS selected,
                        COALESCE(SUM(hired), 0) AS hired,
                        COALESCE(AVG("timeToHireDays"), 0) AS "timeToHireDays"
                FROM aggregation.analytics_recruitment_funnel
                WHERE date BETWEEN :fromDate AND :toDate
                  AND "jobId" = :jobId
                GROUP BY "jobId"
        `;

        const [funnel] = await sequelize.query<{
                jobId: string | null;
                jobTitle: string | null;
                applied: string;
                shortlisted: string;
                selected: string;
                hired: string;
                timeToHireDays: string;
        }>(isAllJobs ? funnelAllJobsQuery : funnelSingleJobQuery, {
                type: QueryTypes.SELECT,
                replacements: isAllJobs ? { fromDate, toDate } : { fromDate, toDate, jobId }
        });

        const interviewerPerformance = await sequelize.query<{
                interviewerId: string;
                interviewerName: string;
                totalInterviews: string;
                passedCount: string;
                failedCount: string;
        }>(
                `SELECT
                        "interviewerId",
                        "interviewerName",
                        COALESCE(SUM("totalInterviews"), 0) AS "totalInterviews",
                        COALESCE(SUM("passedCount"), 0) AS "passedCount",
                        COALESCE(SUM("failedCount"), 0) AS "failedCount"
                FROM aggregation.analytics_interviewers
                WHERE date BETWEEN :fromDate AND :toDate
                GROUP BY "interviewerId", "interviewerName"
                ORDER BY "totalInterviews" DESC`,
                {
                        type: QueryTypes.SELECT,
                        replacements: { fromDate, toDate }
                }
        );

        const funnelLastUpdatedAllJobsQuery = `
                SELECT MAX("lastRefreshedAt") AS "lastUpdatedAt"
                FROM aggregation.analytics_recruitment_funnel
                WHERE date BETWEEN :fromDate AND :toDate
        `;

        const funnelLastUpdatedSingleJobQuery = `
                SELECT MAX("lastRefreshedAt") AS "lastUpdatedAt"
                FROM aggregation.analytics_recruitment_funnel
                WHERE date BETWEEN :fromDate AND :toDate
                  AND "jobId" = :jobId
        `;

        const [funnelLastUpdated] = await sequelize.query<{ lastUpdatedAt: string | null }>(
                isAllJobs ? funnelLastUpdatedAllJobsQuery : funnelLastUpdatedSingleJobQuery,
                {
                        type: QueryTypes.SELECT,
                        replacements: isAllJobs ? { fromDate, toDate } : { fromDate, toDate, jobId }
                }
        );

        const [interviewerLastUpdated] = await sequelize.query<{ lastUpdatedAt: string | null }>(
                `SELECT MAX("lastRefreshedAt") AS "lastUpdatedAt"
                FROM aggregation.analytics_interviewers
                WHERE date BETWEEN :fromDate AND :toDate`,
                {
                        type: QueryTypes.SELECT,
                        replacements: { fromDate, toDate }
                }
        );

        const lastUpdatedAt = getLatestTimestamp(funnelLastUpdated?.lastUpdatedAt, interviewerLastUpdated?.lastUpdatedAt);

        const applied = toNumber(funnel?.applied);
        const hired = toNumber(funnel?.hired);
        const conversionRate = applied === 0 ? 0 : round2((hired / applied) * 100);

        return {
                funnel: {
                        jobId: (funnel?.jobId as string | null) ?? 'all',
                        jobTitle: funnel?.jobTitle ?? 'All Jobs',
                        applied,
                        shortlisted: toNumber(funnel?.shortlisted),
                        selected: toNumber(funnel?.selected),
                        hired,
                        timeToHireDays: round2(toNumber(funnel?.timeToHireDays)),
                        conversionRate,
                },
                interviewerPerformance: interviewerPerformance.map((row: {
                        interviewerId: string;
                        interviewerName: string;
                        totalInterviews: string;
                        passedCount: string;
                        failedCount: string;
                }) => {
                        const totalInterviews = toNumber(row.totalInterviews);
                        const passedCount = toNumber(row.passedCount);

                        return {
                                interviewerId: row.interviewerId,
                                interviewerName: row.interviewerName,
                                totalInterviews,
                                passedCount,
                                failedCount: toNumber(row.failedCount),
                                passRate: totalInterviews === 0 ? 0 : round2((passedCount / totalInterviews) * 100),
                        };
                }),
                lastUpdatedAt,
        };
};

export { getAllTableDataRepository };