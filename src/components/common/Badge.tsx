import { Badge as BootstrapBadge } from "react-bootstrap";

import './Badge.css';

export type BadgeType = 
    | 'review'
    | 'approval' 
    | 'comment'
    | 'login';

export type BadgeVariant = 
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark';

interface BadgeProps {
    type: BadgeType,
    text?: string
}

export default function Badge({type, text}: BadgeProps) {
    const badgeConfig: Record<BadgeType, {icon: string, variant: BadgeVariant}> = {
        review: {
            icon: "file-earmark-text",
            variant: "secondary",
        },
        approval: {
            icon: "check-circle",
            variant: "success",
        },
        comment: {
            icon: "chat-left-text",
            variant: "info",
        },
        login: {
            icon: "box-arrow-in-right",
            variant: "primary",
        },
    };

    const badge = badgeConfig[type];

    return (
        <BootstrapBadge
            bg={badge.variant}
            pill
            className="app-badge" 
        >
            {badge.icon && <i className={`bi bi-${badge.icon}`}></i>}

            {type ?? text}
        </BootstrapBadge>
    );
}