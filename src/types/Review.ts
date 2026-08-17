export interface Prompt {
    id: number,
    category: string;
    prompt_text: string,
    prompt_note: string,
    prompt_order: number,
    score: number,
    feedback: string
}

export interface ReviewCategory {
    id: number,
    category: string,
    category_title: string,
    category_order: number,
    prompts: Prompt[],
    created_at?: string
}

export interface Review {
    review_id: string;
    employee_id: string;
    supervisor_id: string;
    review_date: string;
    milestone: string;
    total_score: number;
    final_feedback: string;
    review_status: string;
    created_at?: string;
}

export interface InsertReviewResponse {
    success: boolean;
    data?: ReviewCategory;
    error?: unknown;
}