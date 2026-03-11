import { getAllCounterDataRepository } from "../repository/counters.repository";

const getAllCounterData = async () => {
    return getAllCounterDataRepository();
}

export { getAllCounterData }