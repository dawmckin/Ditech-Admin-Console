import { useCallback, useState } from "react";

import { 
    createEmployee,
    updateEmployee,
    type CreateEmployeeData,
    type UpdateEmployeeData
} from "../services/userService";

import type { User } from "../types/User";

export function useManageEmployees() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const create = useCallback(async (employee: CreateEmployeeData): Promise<User> => {
        setLoading(true);
        setError(null);

        try {
            return await createEmployee(employee);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unable to create employee');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const update = useCallback(async (employee: UpdateEmployeeData): Promise<User> => {
        setLoading(true);
        setError(null);

        try {
            return await updateEmployee(employee);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Unable to create employee');
            setError(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return {create, update, loading, error};
}