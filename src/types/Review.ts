import type { ReviewCategoryKeyType } from "./reviewCategoryKey";
import type { User } from "./User";

export interface Prompt {
    id: number,
    prompt_id: number,
    category: ReviewCategoryKeyType;
    category_data?: Record<string, string>;
    category_title: string;
    category_order: number;
    prompt_data?: Record<string, string>;
    prompt_text: string;
    prompt_note: string;
    prompt_order: number;
    score: number;
    feedback: string;
    review_id?: string;

}

export interface ReviewCategory {
    id: number;
    category: string;
    category_title: string;
    category_order: number;
    prompts: Prompt[];
    created_at?: string;
}

export interface Review {
    review_id: string;
    employee_id: string;
    supervisor_data: Record<string, string>;
    review_date: string;
    milestone: string;
    total_score: number;
    final_feedback: string;
    review_status: string;
    created_at: string;
    prompts?: Prompt[];
    user_data: User;
}

export interface InsertReviewResponse {
    success: boolean;
    data?: ReviewCategory;
    error?: unknown;
}