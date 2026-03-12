const getAllCounterDataRepository = async () => {
    try {
        const demoData = {
            interviews: {
                completed: 12,
                pending: 10,
                cancelled: 19
            },
            jobs: 20,
            hires: 18
        }
        if (!demoData) throw new Error('counter data not found');
        return demoData;
    } catch (error: unknown) {
        throw error;
    }
}

export { getAllCounterDataRepository }