import { supabase } from "../lib/supabase";
import type { User } from "../types/User";

export async function getUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select(`*`)
        .order('last_name');

    if(error) {
        throw Error;
    }

    return data;
}

export async function getPendingReviewUsers(): Promise<User[]> {
    const reviewRangeDate = new Date;
    reviewRangeDate.setDate(reviewRangeDate.getDate() + 60);

    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            reviews!reviews_employee_id_fkey (
                *,
                prompts:prompt_responses!prompt_responses_review_id_fkey (
                    *,
                    category_data:prompt_responses_category_fkey (
                        category_title,
                        category_order
                    ),
                    prompt_data:prompt_responses_prompt_id_fkey (
                        prompt_text,
                        prompt_order
                    )
                )
            )
        `)
        .eq('user_role', 'frontline')
        .lte('start_date', reviewRangeDate.toISOString())
        .order('next_review_date');

    if(error) {
        throw Error;
    }

    return data;
}