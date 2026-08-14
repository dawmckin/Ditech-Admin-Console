import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";

import type { User } from "../types/User";

export function useSelectUsers() {
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

        loadUsers();
    }, []);

    return {usersData, loading, error};
}