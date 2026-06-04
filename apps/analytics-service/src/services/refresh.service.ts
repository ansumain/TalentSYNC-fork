import { sequelize } from '@talentsync/config';
import type { RefreshRunStatus } from '../types/Refresh.type';
import {
  getLatestRefreshStatusRepository,
  insertRefreshRunRepository,
  markRefreshRunFailedRepository,
  markRefreshRunSuccessRepository,
  upsertCountersRepository,
  upsertInterviewerPerformanceRepository,
  upsertRecruitmentFunnelRepository,
  upsertSkillGapGraphRepository,
} from '../repository/refresh.repository';

type TriggeredBy = 'cron' | 'manual';

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const runAnalyticsRefresh = async (
  triggeredBy: TriggeredBy,
  notes?: string
): Promise<{ refreshId: number; date: string }> => {
  const date = getTodayDate();
  const transaction = await sequelize.transaction();
  let refreshId: number | null = null;

  try {
    refreshId = await insertRefreshRunRepository(transaction, triggeredBy, notes);

    await upsertCountersRepository(transaction, date);
    await upsertSkillGapGraphRepository(transaction, date);
    await upsertRecruitmentFunnelRepository(transaction, date);
    await upsertInterviewerPerformanceRepository(transaction, date);

    await markRefreshRunSuccessRepository(transaction, refreshId);

    await transaction.commit();
    return { refreshId, date };
  } catch (error) {
    await transaction.rollback();

    if (refreshId !== null) {
      await markRefreshRunFailedRepository(
        refreshId,
        ` | error: ${error instanceof Error ? error.message : 'unknown'}`
      );
    }

    throw error;
  }
};

const getLatestRefreshStatus = async (): Promise<RefreshRunStatus | null> => {
  return getLatestRefreshStatusRepository();
};

export { runAnalyticsRefresh, getLatestRefreshStatus };
