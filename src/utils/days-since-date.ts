export default function daysSinceDate(startDate: string, endDate?: string) {
    // const today = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const elapsedMs = end.getTime() - start.getTime();

    return Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
}