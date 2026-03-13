import { getAllGraphDataRepository } from "../repository/graphs.repository";

const getAllGraphData = async (fromDate: string, toDate: string, top: 3 | 5 | 10) => {
    return getAllGraphDataRepository(fromDate, toDate, top);
};

export { getAllGraphData };