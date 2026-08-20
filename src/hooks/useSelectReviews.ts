// import { useEffect, useState } from "react";
// import { getReviews } from "../services/reviewService";
// import type { Review } from "../types/Review";

// export function useSelectReviews(user_id: string) {
//     const [reviewsData, setReviewsData] = useState<Review[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<Error | null>(null);

//     useEffect(() => {
//         async function loadPrompts() {
//             try {
//                 const data = await getReviews(user_id);
//                 setReviewsData(data);
//             } catch(err) {
//                 setError(err as Error)
//             } finally {
//                 setLoading(false);
//             }
//         }

//         loadPrompts();
//     }, []);

//     return {reviewsData, loading, error};
// }