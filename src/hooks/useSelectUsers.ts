import { useCallback, useEffect, useState } from "react";
import { getUsers, getPendingReviewUsers, getSingleUserReviews, getPastReviewUsers } from "../services/userService";

import type { User } from "../types/User";

type GetUsersType = 
    | 'all'
    | 'pastReview'
    | 'pendingReview'
    | 'single'

export function useSelectUsers(type: GetUsersType, userId: string = '') {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reload = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            switch (type) {
                case "single": {
                    if (!userId) {
                        setUsersData([]);
                        return;
                    }

                    const data = await getSingleUserReviews(userId);
                    setUsersData([data]);
                    break;
                }

                case "pendingReview": {
                    const data = await getPendingReviewUsers();
                    setUsersData(data);
                    break;
                }

                case "pastReview": {
                    const data = await getPastReviewUsers();
                    setUsersData(data);
                    break;
                }

                case "all":
                default: {
                    const data = await getUsers();
                    setUsersData(data);
                    break;
                }
            }
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [type, userId]);

    useEffect(() => {
        reload();
    }, [reload]);

    return {usersData, loading, error, reload};
}