import { supabase } from "../lib/supabase";
import type { UpdateUserResponse, User, UserRole } from "../types/User";

export interface CreateEmployeeData {
    email: string;
    phone: string;
    password: string;
    first_name: string;
    last_name: string;
    user_role: UserRole | null;
    supervisor_id?: string | null;
    start_date: string | null;
    is_active?: boolean;
}

export interface UpdateEmployeeData {
    user_id: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    user_role: UserRole | null;
    supervisor_id?: string | null;
    start_date: string | null;
    is_active?: boolean;
}

interface ManageEmployeeResponse {
    success: boolean;
    user?: User;
    error?: string;
}

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
        .order('is_active', {ascending: false})
        .order('last_name');

    if(error) {
        throw Error;
    }

    return data;
}

export async function createEmployee(employee: CreateEmployeeData): Promise<User> {
    const {data, error} = await supabase.functions.invoke<ManageEmployeeResponse>('admin-users', {
        body: {
            action: "create",
            user: employee
        },
    })

    if(error) {
        throw error;
    }

    if(!data?.success || !data?.user) {
        throw new Error(data?.error ?? 'Unable to create user');
    }

    return data?.user;
}

export async function updateEmployee(employee: UpdateEmployeeData): Promise<User> {
    const {data, error} = await supabase.functions.invoke<ManageEmployeeResponse>('admin-users', {
        body: {
            action: "update",
            user: employee,
        },
    })

    if(error) {
        throw error;
    }

    if(!data?.success || !data?.user) {
        throw new Error(data?.error ?? 'Unable to update user');
    }

    return data?.user;
}

export async function disableEmployee(employee: UpdateEmployeeData): Promise<User> {
    const {data, error} = await supabase.functions.invoke<ManageEmployeeResponse>('admin-users', {
        body: {
            action: "disable",
            user: employee,
        },
    })

    if(error) {
        throw error;
    }

    if(!data?.success || !data?.user) {
        throw new Error(data?.error ?? 'Unable to disable user');
    }

    return data?.user;
}

export async function getPastReviewUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select(usersReviewsQuery)
        .eq('user_role', 'frontline')
        .order('is_active', {ascending: false})
        .order('last_name');

    if(error) {
        throw Error;
    }

    return data;
}

export async function getPendingReviewUsers(): Promise<User[]> {
    const reviewRangeDate = new Date;
    reviewRangeDate.setDate(reviewRangeDate.getDate() + 66);

    const { data, error } = await supabase
        .from('users')
        .select(usersReviewsQuery)
        .eq('user_role', 'frontline')
        .neq('current_milestone', '75')
        .lte('start_date', reviewRangeDate.toISOString())
        .order('is_active', {ascending: false})
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
        // .order('milestone', {foreignTable: 'reviews', ascending: false})
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