import { useEffect, useState } from "react";
import type { AuditLog } from "../types/AuditLog";
import { getAuditLogs } from "../services/auditLogService";

export function useSelectAuditLogs() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function loadPrompts() {
            try {
                const data = await getAuditLogs();
                setAuditLogs(data);
            } catch(err) {
                setError(err as Error)
            } finally {
                setLoading(false);
            }
        }

        loadPrompts();
    }, []);

    return {auditLogs, loading, error};
}