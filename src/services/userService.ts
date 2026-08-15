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
        .select(`*`)
        .eq('user_role', 'frontline')
        .lte('start_date', reviewRangeDate.toISOString())
        .order('next_review');

    if(error) {
        throw Error;
    }

    return data;
}