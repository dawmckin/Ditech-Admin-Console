import { useState } from "react";
import type { User } from "../types/User";
import { updateUser } from "../services/userService";

export function useUpdateUser() {
    const [status, setStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updateUserAfterReview = async (userData: User) => {
        console.log(userData);
        setLoading(true);
        setError(null);
        setStatus(false);

        try {
            const response = await updateUser(userData);
            setStatus(response.success);
            return response;
        } catch(err) {
            setError(err as Error)
        } finally {
            setLoading(false);
        }

    }

    return {updateUserAfterReview, status, loading, error};
}