export default function daysSinceStartDate(startDate: string) {
    const today = new Date();
    const start = new Date(startDate);

    const elapsedMs = today.getTime() - start.getTime();

    return Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
}