import formatDateTime from "./format-date-time";

export default function getMilestoneDate(reviewMilestone: string, startDate: string): string {
    const milestoneAchievementDate = new Date(startDate);
    milestoneAchievementDate.setDate(milestoneAchievementDate.getDate() + Number.parseInt(reviewMilestone));
    return formatDateTime(milestoneAchievementDate.toISOString(), true);
}