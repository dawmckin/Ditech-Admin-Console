export type UserRole = 
    | 'admin'
    | 'supervisor'
    | 'frontline';

export interface User {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    user_role: UserRole;
    current_milestone: string;
    start_date: string;
    next_review: string;
    created_at: string;
}