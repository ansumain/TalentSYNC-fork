export const getLastUpdated = (a: string | null | undefined, b?: string | null | undefined) => {
    const timestamps = [a, b].filter(Boolean) as string[];
    if (timestamps.length === 0) return null;
    return timestamps.sort().at(-1) ?? null;
};