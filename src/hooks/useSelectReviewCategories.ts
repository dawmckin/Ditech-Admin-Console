import { useEffect, useState } from "react";
import { getReviewCategories } from "../services/reviewService";
import type { ReviewCategory } from "../types/Review";

export function useSelectReviewCategories() {
    const [categoriesData, setCategoriesData] = useState<ReviewCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadPrompts() {
            try {
                const data = await getReviewCategories();
                setCategoriesData(data);
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