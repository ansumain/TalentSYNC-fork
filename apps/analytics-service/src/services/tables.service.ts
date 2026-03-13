import { getAllTableDataRepository } from "../repository/tables.repository";

const getAllTableData = async (fromDate: string, toDate: string, jobId?: string) => {
    return getAllTableDataRepository(fromDate, toDate, jobId);
};

export { getAllTableData };