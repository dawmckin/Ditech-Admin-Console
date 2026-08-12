import type { ReviewCategoryKeyType } from "../types/reviewCategoryKey";

const categoryMappings: Record<ReviewCategoryKeyType, string> = {
    attendance: 'Attendance',
    be_positive: 'Be Positive',
    clean_up_work_area: 'Clean Up Work Area',
    labeling: 'Labeling',
    paycom: 'Paycom',
    plex: 'Plex',
    production_goals: 'Production Goals',
    quality: 'Quality',
    wear_ppe: 'Wear PPE'
}

export default function mapReviewCategory(categoryKey: ReviewCategoryKeyType): string {
    return categoryMappings[categoryKey] ?? categoryKey;
}