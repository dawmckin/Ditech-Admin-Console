import { supabase } from "../lib/supabase";
import type { UpdateUserResponse, User } from "../types/User";

const usersReviewsQuery =`
                            *,
                            reviews!reviews_employee_id_fkey (
                                *,
                                supervisor_data:reviews_supervisor_id_fkey (
                                    user_id,
                                    first_name,
                                    last_name
                                ),
                                prompts:prompt_responses!prompt_responses_review_id_fkey (*)
                            )
                        `

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
        .select(usersReviewsQuery)
        .eq('user_role', 'frontline')
        .lte('start_date', reviewRangeDate.toISOString())
        .order('next_review_date');

    if(error) {
        throw Error;
    }

    return data;
}

export async function getSingleUserReviews(userId: string): Promise<User> {
    const { data, error } = await supabase
        .from('users')
        .select(usersReviewsQuery)
        .eq('user_id', userId)
        .single();

    if(error) {
        throw Error;
    }

    return data;
}

export async function updateUser(userData: User): Promise<UpdateUserResponse> {
    const { data, error } = await supabase
        // .from('users')
        // .select('*')
        // .eq('user_id', userData.user_id);
        .from('users')
        .update(userData)
        .eq('user_id', userData.user_id)
        .select();

    if(error) {
        throw Error;
        // return {'success': false, error};
    }

    return {success: true, data: data[0]};
}