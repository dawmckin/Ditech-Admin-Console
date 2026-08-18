import type { Review } from "./Review";

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
    supervisor_id: string;
    current_milestone: string;
    start_date: string;
    last_review_date: string;
    next_review_date: string;
    created_at: string;
    reviews: Review[];
}