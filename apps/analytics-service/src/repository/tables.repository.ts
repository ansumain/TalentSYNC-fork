import { Tables } from "../types/Tables.type";

const getAllTableDataRepository = async () => {
    try {
        const demoTableData: Tables = {
            recentInterviewTable: [{
                applicantName: 'Ansuman Panda',
                interviewerName: 'Lakin Mohapatra',
                result: 'passed'
            }],
            dataBox: [{
                applied: 120,
                shortlisted: 120,
                interviewing: 80,
                selected: 30,
                hired: 10,
                timeToHire: '',
                conversionRate: '',
            }]
        }
        if (!demoTableData) throw new Error('counter data not found');
        return demoTableData;
    } catch (error: unknown) {
        throw error;
    }
}

export { getAllTableDataRepository }