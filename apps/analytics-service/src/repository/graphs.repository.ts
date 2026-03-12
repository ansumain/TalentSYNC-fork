import { Graphs } from "../types/Graphs.type";

const getAllGraphDataRepository = async () => {
    try {
        const demoGraphData: Graphs = {
            barGraph: [
                {
                    date: 'someDate1',
                    skills: [
                        { skill: 'node', count: 20 },
                        { skill: 'java', count: 12 },
                        { skill: 'python', count: 78 },
                        { skill: 'aws', count: 18 },
                        { skill: 'docker', count: 21 }
                    ]
                },
                {
                    date: 'someDate2',
                    skills: [
                        { skill: 'node', count: 20 },
                        { skill: 'java', count: 12 },
                        { skill: 'python', count: 78 },
                        { skill: 'aws', count: 18 },
                        { skill: 'docker', count: 21 }
                    ]
                }
            ]
        }


        if (!demoGraphData) throw new Error('counter data not found');
        return demoGraphData;
    } catch (error: unknown) {
        throw error;
    }
}

export { getAllGraphDataRepository }