import { useContext } from "react";

import { ReviewCategoryContext } from "../context/ReviewCategoryContext";
import type { ReviewCategoryContextType } from "../context/ReviewCategoryContext";

export default function useReviewCategory(): ReviewCategoryContextType {
    const context = useContext(ReviewCategoryContext);

    if(!context) {
        throw new Error("useReviewCategory must be inside and ReviewCategoryProvider")
    }

    return context;
}