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
    start_date: string;
    created_at: string;
}