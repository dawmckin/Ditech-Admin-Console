import { useState } from "react";
import { insertReview } from "../services/reviewService";
import type { EmployeeReviewForm } from "../components/supervisor/NewReview";

export function useInsertReview() {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitReview = async (reviewData: EmployeeReviewForm) => {
        setLoading(true);
        setError(null);
        setStatus(false);

        try {
            const response = await insertReview(reviewData);
            setStatus(response.success);
            return response;
        } catch(err) {
            setError(err as Error)
        } finally {
            setLoading(false);
        }

    }

    return {submitReview, status, loading, error};
}