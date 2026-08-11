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