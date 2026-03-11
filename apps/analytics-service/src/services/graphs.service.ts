import { getAllGraphDataRepository } from "../repository/graphs.repository";

const getAllGraphData = async () => {
    return getAllGraphDataRepository();
}

export { getAllGraphData }