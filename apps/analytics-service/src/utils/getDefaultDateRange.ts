export const getDefaultDateRange = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
        fromDate: firstDayOfMonth.toISOString().slice(0, 10),
        toDate: now.toISOString().slice(0, 10),
    };
};