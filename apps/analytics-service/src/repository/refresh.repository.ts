import { QueryTypes } from 'sequelize';
import type { Transaction } from 'sequelize';
import { sequelize } from '@talentsync/config';
import { internalServerError } from '@talentsync/types';
import type { RefreshRunStatus } from '../types/Refresh.type';

type TriggeredBy = 'cron' | 'manual';

const insertRefreshRunRepository = async (
  transaction: Transaction,
  triggeredBy: TriggeredBy,
  notes?: string
): Promise<number> => {
  const rows = await sequelize.query<{ refreshId: number }>(
    `WITH inserted AS (
      INSERT INTO aggregation.analytics_refresh_runs ("startedAt", status, "triggeredBy", notes)
      VALUES (CURRENT_TIMESTAMP, 'running', :triggeredBy, :notes)
      RETURNING "refreshId"
    )
    SELECT "refreshId" FROM inserted`,
    {
      type: QueryTypes.SELECT,
      replacements: { triggeredBy, notes: notes ?? null },
      transaction,
    }
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    throw internalServerError('failed to create refresh run', 'REFRESH_RUN_CREATE_FAILED');
  }

  return Number(rows[0].refreshId);
};

const upsertCountersRepository = async (transaction: Transaction, date: string) => {
  await sequelize.query(
    `INSERT INTO aggregation.analytics_counters
      (date, scheduled, completed, cancelled, "noShow", "openJobs", hires, "lastRefreshedAt")
     SELECT
      :date::date,
      COALESCE(i.scheduled, 0),
      COALESCE(i.completed, 0),
      COALESCE(i.cancelled, 0),
      COALESCE(i."noShow", 0),
      COALESCE(j."openJobs", 0),
      COALESCE(h.hires, 0),
      CURRENT_TIMESTAMP
     FROM (
      SELECT
        COUNT(*) FILTER (WHERE status = 'scheduled') AS scheduled,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
        COUNT(*) FILTER (WHERE status = 'noshow') AS "noShow"
      FROM management.interviews
     ) i
     CROSS JOIN (
      SELECT COUNT(*) AS "openJobs" FROM management.jobs
     ) j
     CROSS JOIN (
      SELECT COUNT(*) AS hires
      FROM management.job_applications
      WHERE "currentStatus" = 'hired'
     ) h
     ON CONFLICT (date)
     DO UPDATE SET
      scheduled = EXCLUDED.scheduled,
      completed = EXCLUDED.completed,
      cancelled = EXCLUDED.cancelled,
      "noShow" = EXCLUDED."noShow",
      "openJobs" = EXCLUDED."openJobs",
      hires = EXCLUDED.hires,
      "lastRefreshedAt" = EXCLUDED."lastRefreshedAt"`,
    {
      replacements: { date },
      transaction,
    }
  );
};

const upsertSkillGapGraphRepository = async (transaction: Transaction, date: string) => {
  await sequelize.query(
    `WITH demand AS (
      SELECT js."skillId", COUNT(*) AS "demandCount"
      FROM management.job_skills js
      GROUP BY js."skillId"
     ),
     hired_users AS (
      SELECT DISTINCT ja."userId"
      FROM management.job_applications ja
      WHERE ja."currentStatus" = 'hired'
     ),
     supply AS (
      SELECT us."skillId", COUNT(*) AS "supplyCount"
      FROM resume.user_skills us
      INNER JOIN hired_users hu ON hu."userId" = us."userId"
      GROUP BY us."skillId"
     )
     INSERT INTO aggregation.analytics_graphs
      (date, "skillId", "skillName", "demandCount", "supplyCount", "lastRefreshedAt")
     SELECT
      :date::date,
      s."skillId",
      s."skillName",
      COALESCE(d."demandCount", 0),
      COALESCE(sp."supplyCount", 0),
      CURRENT_TIMESTAMP
     FROM management.skills s
     LEFT JOIN demand d ON d."skillId" = s."skillId"
     LEFT JOIN supply sp ON sp."skillId" = s."skillId"
     ON CONFLICT (date, "skillId")
     DO UPDATE SET
      "skillName" = EXCLUDED."skillName",
      "demandCount" = EXCLUDED."demandCount",
      "supplyCount" = EXCLUDED."supplyCount",
      "lastRefreshedAt" = EXCLUDED."lastRefreshedAt"`,
    {
      replacements: { date },
      transaction,
    }
  );
};

const upsertRecruitmentFunnelRepository = async (transaction: Transaction, date: string) => {
  await sequelize.query(
    `WITH funnel AS (
      SELECT
        j."jobId",
        j.title AS "jobTitle",
        COUNT(ja."applicationId") AS applied,
        COUNT(*) FILTER (WHERE ja."currentStatus" = 'shortlisted') AS shortlisted,
        COUNT(*) FILTER (WHERE ja."currentStatus" = 'selected') AS selected,
        COUNT(*) FILTER (WHERE ja."currentStatus" = 'hired') AS hired,
        COALESCE(
          AVG(EXTRACT(EPOCH FROM (ja."updatedAt" - ja."createdAt")) / 86400)
          FILTER (WHERE ja."currentStatus" = 'hired')
        , 0) AS "timeToHireDays"
      FROM management.jobs j
      LEFT JOIN management.job_applications ja ON ja."jobId" = j."jobId"
      GROUP BY j."jobId", j.title
     )
     INSERT INTO aggregation.analytics_recruitment_funnel
      (date, "jobId", "jobTitle", "timeToHireDays", "conversionRate", applied, shortlisted, selected, hired, "lastRefreshedAt")
     SELECT
      :date::date,
      f."jobId",
      f."jobTitle",
      ROUND(f."timeToHireDays"::numeric, 2),
      ROUND(
        CASE
          WHEN f.applied = 0 THEN 0
          ELSE (f.hired::numeric / f.applied::numeric) * 100
        END
      , 2),
      f.applied,
      f.shortlisted,
      f.selected,
      f.hired,
      CURRENT_TIMESTAMP
     FROM funnel f
     ON CONFLICT (date, "jobId")
     DO UPDATE SET
      "jobTitle" = EXCLUDED."jobTitle",
      "timeToHireDays" = EXCLUDED."timeToHireDays",
      "conversionRate" = EXCLUDED."conversionRate",
      applied = EXCLUDED.applied,
      shortlisted = EXCLUDED.shortlisted,
      selected = EXCLUDED.selected,
      hired = EXCLUDED.hired,
      "lastRefreshedAt" = EXCLUDED."lastRefreshedAt"`,
    {
      replacements: { date },
      transaction,
    }
  );
};

const upsertInterviewerPerformanceRepository = async (transaction: Transaction, date: string) => {
  await sequelize.query(
    `WITH perf AS (
      SELECT
        i."interviewerId",
        u.name AS "interviewerName",
        COUNT(i."interviewId") AS "totalInterviews",
        COUNT(*) FILTER (WHERE i.result = 'passed') AS "passedCount",
        COUNT(*) FILTER (WHERE i.result = 'failed') AS "failedCount"
      FROM management.interviews i
      INNER JOIN auth.users u ON u.id = i."interviewerId"
      GROUP BY i."interviewerId", u.name
     )
     INSERT INTO aggregation.analytics_interviewers
      (date, "interviewerId", "interviewerName", "totalInterviews", "passedCount", "failedCount", "passRate", "lastRefreshedAt")
     SELECT
      :date::date,
      p."interviewerId",
      p."interviewerName",
      p."totalInterviews",
      p."passedCount",
      p."failedCount",
      ROUND(
        CASE
          WHEN p."totalInterviews" = 0 THEN 0
          ELSE (p."passedCount"::numeric / p."totalInterviews"::numeric) * 100
        END
      , 2),
      CURRENT_TIMESTAMP
     FROM perf p
     ON CONFLICT (date, "interviewerId")
     DO UPDATE SET
      "interviewerName" = EXCLUDED."interviewerName",
      "totalInterviews" = EXCLUDED."totalInterviews",
      "passedCount" = EXCLUDED."passedCount",
      "failedCount" = EXCLUDED."failedCount",
      "passRate" = EXCLUDED."passRate",
      "lastRefreshedAt" = EXCLUDED."lastRefreshedAt"`,
    {
      replacements: { date },
      transaction,
    }
  );
};

const markRefreshRunSuccessRepository = async (transaction: Transaction, refreshId: number) => {
  await sequelize.query(
    `UPDATE aggregation.analytics_refresh_runs
     SET "completedAt" = CURRENT_TIMESTAMP,
         status = 'success'
     WHERE "refreshId" = :refreshId`,
    {
      replacements: { refreshId },
      transaction,
    }
  );
};

const markRefreshRunFailedRepository = async (refreshId: number, errorMessage: string) => {
  await sequelize.query(
    `UPDATE aggregation.analytics_refresh_runs
     SET "completedAt" = CURRENT_TIMESTAMP,
         status = 'failed',
         notes = COALESCE(notes, '') || :errorMessage
     WHERE "refreshId" = :refreshId`,
    {
      replacements: { refreshId, errorMessage },
      type: QueryTypes.UPDATE,
    }
  );
};

const getLatestRefreshStatusRepository = async (): Promise<RefreshRunStatus | null> => {
  const [latest] = await sequelize.query<RefreshRunStatus>(
    `SELECT
      "refreshId",
      "startedAt",
      "completedAt",
      status,
      "triggeredBy",
      notes
     FROM aggregation.analytics_refresh_runs
     ORDER BY "refreshId" DESC
     LIMIT 1`,
    {
      type: QueryTypes.SELECT,
    }
  );

  return latest ?? null;
};

export {
  insertRefreshRunRepository,
  upsertCountersRepository,
  upsertSkillGapGraphRepository,
  upsertRecruitmentFunnelRepository,
  upsertInterviewerPerformanceRepository,
  markRefreshRunSuccessRepository,
  markRefreshRunFailedRepository,
  getLatestRefreshStatusRepository,
};