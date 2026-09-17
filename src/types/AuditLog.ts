export type AuditAction =
    | "user_created"
    | "user_updated"
    | "user_disabled"
    | "user_enabled"
    | "review_submitted"
    | "review_updated"
    | "initial_login";

export type AuditEntity =
    | "user"
    | "review";

export interface AuditLog {
    audit_id: string;

    actor_user_id: string | null;

    action_type: AuditAction;
    entity_type: AuditEntity;
    entity_id: string | null;

    description: string | null;

    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    metadata: Record<string, unknown> | null;

    ip_address: string | null;
    user_agent: string | null;

    created_at: string;

    actor?: {
        first_name: string | null;
        last_name: string | null;
    } | null;
}