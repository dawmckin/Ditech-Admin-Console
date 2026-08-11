import { supabase } from "../lib/supabase";
import type { ReviewCategory } from "../types/ReviewPrompt";

export function groupPromptsByCategory(categories: ReviewCategory[]) {
    return categories.reduce((groups, category) =>  {
        if(!groups[category.category]) {
            groups[category.category] = {
                id: category.id,
                category: category.category,
                category_title: category.category_title,
                category_order: category.category_order,
                prompts: category.prompts
            };
        }

        return groups;
    }, {} as Record<string, ReviewCategory>);
}

export async function getReviewPrompts(): Promise<ReviewCategory[]> {
    const { data, error } = await supabase
        .from('review_categories')
        .select(`
                *,
                prompts:review_prompts(*)
            `);

    if(error) {
        throw Error;
    }

    return data;
}