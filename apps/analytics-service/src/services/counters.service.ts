import { getAllCounterDataRepository } from "../repository/counters.repository";

const getAllCounterData = async (fromDate: string, toDate: string) => {
    return getAllCounterDataRepository(fromDate, toDate);
};

export { getAllCounterData };