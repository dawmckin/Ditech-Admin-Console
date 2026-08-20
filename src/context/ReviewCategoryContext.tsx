import { createContext, useContext, type ReactNode } from "react";

import { useSelectReviewCategories } from "../hooks/useSelectReviewCategories";

import type { ReviewCategory } from "../types/Review";

export interface ReviewCategoryContextType {
    categories: ReviewCategory[];
    loading: boolean;
    error: Error | null;
}

interface ReviewCategoryProviderProps {
    children: ReactNode;
}

export const ReviewCategoryContext = createContext<ReviewCategoryContextType | undefined>(undefined);

export function ReviewCategoryProvider({children}: ReviewCategoryProviderProps) {
    const {categoriesData: categories, loading, error} = useSelectReviewCategories();

    return (
        <ReviewCategoryContext.Provider
            value={{categories, loading, error}}
        >
            {children}
        </ReviewCategoryContext.Provider>
    );
}


