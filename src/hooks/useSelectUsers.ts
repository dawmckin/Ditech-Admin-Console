import { useEffect, useState } from "react";
import { getUsers, getPendingReviewUsers, getSingleUserReviews } from "../services/userService";

import type { User } from "../types/User";

type GetUsersType = 
    | 'all'
    | 'pendingReview'
    | 'single'

export function useSelectUsers(type: GetUsersType, userId: string = '') {
    const [usersData, setUsersData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await getUsers();
                setUsersData(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        async function loadReviewsByUser() {
            try {
                if(!userId) {
                    setUsersData([]);
                    return;
                }
                const data = await getSingleUserReviews(userId);
                setUsersData([data]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        async function loadPendingReviewUsers() {
            try {
                const data = await getPendingReviewUsers();
                setUsersData(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        switch(type) {
            case 'single':
                loadReviewsByUser();
                break;
            case 'pendingReview':
                loadPendingReviewUsers();
                break;
            default:
                loadUsers();
        }
    }, [type, userId]);

    return {usersData, loading, error};
}