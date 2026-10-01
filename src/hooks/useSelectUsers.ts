import { useCallback, useEffect, useState } from "react";
import {
    getUsers,
    getPendingReviewUsers,
    getSingleUserReviews,
    getPastReviewUsers,
} from "../services/userService";

import type { User } from "../types/User";

type GetUsersType =
    | "all"
    | "pastReview"
    | "pendingReview"
    | "single";

export function useSelectUsers(
    type: GetUsersType,
    frontlineUser?: string
) {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const reload = useCallback(async (userId: string = ""): Promise<User[]> => {
        setLoading(true);
        setError(null);

        try {
            switch (type) {

                case "single": {
                    if (!userId && !frontlineUser) {
                        setUsersData([]);
                        return [];
                    }

                    const data = await getSingleUserReviews(frontlineUser ?? userId);

                    setUsersData([data]);

                    return [data];
                }

                case "pendingReview": {
                    const data = await getPendingReviewUsers();

                    setUsersData(data);

                    return data;
                }

                case "pastReview": {
                    const data = await getPastReviewUsers();

                    setUsersData(data);

                    return data;
                }

                case "all":
                default: {
                    const data = await getUsers();

                    setUsersData(data);

                    return data;
                }
            }
        } catch (err) {
            const error = err as Error;

            setError(error);

            throw error;
        } finally {
            setLoading(false);
        }
    }, [type, frontlineUser]);

    useEffect(() => {
        reload();
    }, [reload]);

    return {
        usersData,
        loading,
        error,
        reload,
    };
}