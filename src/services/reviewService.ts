import { supabase } from "../lib/supabase";
import type { ReviewCategory, InsertReviewResponse } from "../types/Review";
import type { EmployeeReviewForm } from "../components/supervisor/NewReview";

export async function getReviewCategories(): Promise<ReviewCategory[]> {
    const { data, error } = await supabase
        .from('review_categories')
        .select(`
                *,
                prompts:review_prompts(*)
            `);

    if(error) {
        throw Error;
    }

    return data;
}

export async function insertPromptResponses(categoryData: any, reviewId: string): Promise<InsertReviewResponse> {
    const prompts = Object.values(categoryData)
                            .flatMap((category: any) => category.prompts)
                            .map(prompt => ({
                                review_id: reviewId,
                                category: prompt.category,
                                prompt_id: prompt.id,
                                score: prompt.score,
                                feedback: prompt.feedback

                            }));

    const {data, error} = await supabase
        .from('prompt_responses')
        .insert(prompts)

    if(data) {
        return {success: true}
    }

    if(error) {
        throw Error;
    }

    return {success: false};
}

export async function insertReview(reviewData: EmployeeReviewForm): Promise<InsertReviewResponse> {
    const {categories, ...updateReviewData} = reviewData;
    const { data, error } = await supabase
        .from('reviews')
        .insert(updateReviewData)
        .select()

    if(error) {
        throw Error;
        // return {'success': false, error};
    }

    if(data) {
        insertPromptResponses(categories, data[0].review_id);
    }

    return {success: true};
}