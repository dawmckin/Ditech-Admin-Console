import { Badge as BootstrapBadge } from "react-bootstrap";

import './Badge.css';

export type BadgeType = 
    | 'review'
    | 'approval' 
    | 'comment'
    | 'login'
    | 'milestone'
    | 'milestone_light'
    | 'overdue';

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
        milestone: {
            icon: 'award-fill',
            variant: 'primary'
        },
        milestone_light: {
            icon: 'award-fill',
            variant: 'info'
        },
        overdue: {
            icon: 'clock-history',
            variant: 'danger'
        }
    };

    const badge = badgeConfig[type];

    return (
        <BootstrapBadge
            bg={badge.variant}
            pill
            className="app-badge" 
        >
            {badge.icon && <i className={`bi bi-${badge.icon}`}></i>}

            {text ?? type}
        </BootstrapBadge>
    );
}