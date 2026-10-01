import { supabase } from "../lib/supabase";
import type { AuditLog } from "../types/AuditLog";

export async function getAuditLogs(): Promise<AuditLog[]> {
    const { data, error } = await supabase
        .from("audit_logs")
        .select(`
            *,
            actor:users!audit_logs_actor_user_id_fkey (
                first_name,
                last_name,
                user_role
            )
        `)
        .order("created_at", { ascending: false });
    if(error) {
        throw Error;
    }

    return data;
}