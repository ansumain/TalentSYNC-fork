import { getAllTableDataRepository } from "../repository/tables.repository";

const getAllTableData = async () => {
    return getAllTableDataRepository();
}

export { getAllTableData }