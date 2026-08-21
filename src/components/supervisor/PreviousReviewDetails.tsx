import { OverlayTrigger, Table } from "react-bootstrap";
import Popover from "../common/Popover";
import type { Prompt, ReviewCategory } from "../../types/Review";
import mapReviewCategory from "../../utils/map-review-category";
import type { ReviewCategoryKeyType } from "../../types/reviewCategoryKey";
import { useState } from "react";
import Badge from "../common/Badge";
import type { User } from "../../types/User";
import formatDateTime from "../../utils/format-date-time";

interface PreviousReviewDetailsProps {
    user: User;
    prompts: Prompt[];
    categories: ReviewCategory[];
    milestone: string;
    reviewer: string;
}

export default function PreviousReviewDetails({user, prompts, categories, reviewer, milestone}: PreviousReviewDetailsProps) {
    const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);

    const categorySummary = prompts.reduce<Record<ReviewCategoryKeyType, typeof prompts>>((acc, prompt) => {
        if(!acc[prompt.category]) {
            acc[prompt.category] = [];
        }

        acc[prompt.category].push(prompt);

        return acc;
    }, {} as Record<ReviewCategoryKeyType, typeof prompts>);

    const categoriesObj = categories?.reduce((acc, cat): Record<string, ReviewCategory> => {
        acc[cat.category] = cat;
        return acc;
    }, {});

    const sortedCategorySummary = Object.fromEntries(
        Object.entries(categorySummary)
            .sort(([, promptsA], [, promptsB]) => 
                categoriesObj[promptsA[0]?.category]?.category_order - 
                categoriesObj[promptsB[0]?.category]?.category_order
            )
            .map(([category, prompts]) => [
                category,
                prompts.sort((a, b) => 
                    categoriesObj[category].prompts?.filter(p => p.id === a.id)[0]?.prompt_order -
                    categoriesObj[category].prompts?.filter(p => p.id === b.id)[0]?.prompt_order
                )
            ])
    );

    const getMilestoneDate = (reviewMilestone: string): string => {
        const milestoneAchievementDate = new Date(user.start_date);
        milestoneAchievementDate.setDate(milestoneAchievementDate.getDate() + Number.parseInt(reviewMilestone));
        return formatDateTime(milestoneAchievementDate.toISOString(), true);
    }

    return (
        <div>
            {
                (milestone && reviewer) &&    
                <div className="d-flex justify-content-between mb-2" style={{fontSize: '.8em'}}>
                    <small><span className="fw-semibold">Milestone Achieved On: </span> {getMilestoneDate(milestone)}</small>
                    <small><span className="fw-semibold">Reviewer: </span>{reviewer}</small>
                </div>
            }
            {
                Object.entries(sortedCategorySummary).map(category => (
                    <Table striped bordered size="sm" className="w-100"
                        key={`${category[0]}-${category[1][0].review_id}`}    
                    >
                        <colgroup>
                            <col style={{ width: "90%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>
                                    <h5 className="mb-1">{mapReviewCategory(category[0] as ReviewCategoryKeyType)}</h5>
                                </th>
                                <th>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Badge 
                                            type="category_score" 
                                            text={`${category[1].reduce((acc, prompt) => acc += prompt.score, 0)} / ${category[1].length * 3}`}
                                            size="md"
                                        ></Badge>
                                    </div>
                                </th>
                            </tr>
                            {
                                category[1]?.map(prompt => (
                                    <tr key={prompt.id}>
                                        <td className="py-1 px-2">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="fw-semibold text-muted">
                                                    {/* {categoriesObj[category[0]]?.prompts?.filter(p => p.id === prompt.id)[0]?.prompt_text} */}
                                                    {categoriesObj[category[0]]?.prompts?.filter(p => p.id === prompt.prompt_id)[0]?.prompt_text}
                                                </small>

                                                {prompt.feedback && (
                                                    <OverlayTrigger
                                                        trigger={['hover', 'focus']}
                                                        placement="top"
                                                        onToggle={(nextShow) => {
                                                            setActiveFeedbackId(nextShow ? prompt.id.toString() : null);
                                                        }}
                                                        overlay={
                                                            <Popover
                                                                title="Feedback"
                                                                body_text={prompt.feedback}
                                                            />
                                                        }
                                                    >
                                                        <i className={`bi bi-${
                                                            (activeFeedbackId === prompt.id.toString() ? 
                                                                'bi bi-chat-quote-fill' : 
                                                                'bi bi-chat-quote'
                                                            )} ms-2`}></i>
                                                    </OverlayTrigger>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-1 px-2 fw-semibold text-center align-middle">
                                            <small>
                                                <Badge 
                                                    type={prompt.score === 3 ? 'prompt_score_success' : 'prompt_score'}
                                                    text={`${prompt.score} / 3`}
                                                ></Badge>
                                            </small>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>                    
                ))
            }
        </div>
    );
}