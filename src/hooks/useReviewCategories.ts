import { useEffect, useState } from "react";
import { getReviewPrompts } from "../services/reviewPromptService";
import type { ReviewCategory } from "../types/ReviewPrompt";

export function useReviewCategories() {
    const [categoriesData, setCategoriesData] = useState<ReviewCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadPrompts() {
            try {
                const categoriesData = await getReviewPrompts();
                setCategoriesData(categoriesData);
            } catch(err) {
                setError(err as Error)
            } finally {
                setLoading(false);
            }
        }

        loadPrompts();
    }, []);

    return {categoriesData, loading, error};
}