import { Badge as BootstrapBadge } from "react-bootstrap";

import './Badge.css';

export type BadgeType = 
    | 'review'
    | 'approval' 
    | 'comment'
    | 'login'
    | 'milestone'
    | 'milestone_light'
    | 'overdue'
    | 'category_score'
    | 'prompt_score_success'
    | 'prompt_score'
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'
    | 'ready_for_review';

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
    text?: string;
    size?: string;
}

export default function Badge({type, text, size = 'sm'}: BadgeProps) {
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
        ready_for_review: {
            icon: 'check-circle',
            variant: 'success'  
        },
        overdue: {
            icon: 'clock-history',
            variant: 'danger'
        },
        category_score: {
            icon: '',
            variant: 'dark'
        },
        prompt_score_success: {
            icon: '',
            variant: 'success'
        },
        prompt_score: {
            icon: '',
            variant: 'light'
        },
        complies: {
            icon: '',
            variant: 'success'  
        },
        needs_improving: {
            icon: '',
            variant: 'warning'  
        },
        does_not_comply: {
            icon: '',
            variant: 'danger'  
        }
    };

    const badgeStyles: Record<string, any> = {
        lg: {lineHeight: 2, fontSize: '1rem', borderRadius: '.375rem'},
        md: {lineHeight: 1.5, fontSize: '.8rem', borderRadius: '.375rem', paddingLeft: '3rem', paddingRight: '3rem'},
        sm: {}
    }

    const badge = badgeConfig[type];

    return (
        <BootstrapBadge
            bg={badge.variant}
            // pill={false}
            className={`app-badge ${badge.variant === 'light' ? 'text-dark' : ''}`} 
            style={badgeStyles[size]}
        >
            {badge.icon && <i className={`bi bi-${badge.icon}`}></i>}

            {text ?? type}
        </BootstrapBadge>
    );
}