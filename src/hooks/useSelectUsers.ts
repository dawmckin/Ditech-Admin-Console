import { useEffect, useState } from "react";
import { getUsers, getPendingReviewUsers } from "../services/userService";

import type { User } from "../types/User";

type GetUsersType = 
    | 'all'
    | 'pendingReview'

export function useSelectUsers(type: GetUsersType) {
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
            case 'pendingReview':
                loadPendingReviewUsers();
                break;
            default:
                loadUsers();
        }
    }, []);

    return {usersData, loading, error};
}