import { Badge as BootstrapBadge } from "react-bootstrap";

import './Badge.css';

export type BadgeType = 
    | 'user_created'
    | 'user_updated' 
    | 'user_disabled'
    | 'user_enabled'
    | 'review_submitted'
    | 'details_value'
    | 'milestone'
    | 'milestone_light'
    | 'overdue'
    | 'category_score'
    | 'prompt_score_success'
    | 'prompt_score'
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'
    | 'ready_for_review'
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'admin'
    | 'supervisor'
    | 'frontline';

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
    className?: string;
}

export default function Badge({type, text, size = 'sm', className = ''}: BadgeProps) {
    const badgeConfig: Record<BadgeType, {icon: string, variant: BadgeVariant}> = {
        user_created: {
            icon: "person-fill-add",
            variant: "success",
        },
        user_updated: {
            icon: "person-fill-exclamation",
            variant: "warning",
        },
        user_disabled: {
            icon: "person-fill-slash",
            variant: "danger",
        },
        user_enabled: {
            icon: "person-fill-check",
            variant: "success",
        },
        review_submitted: {
            icon: "file-earmark-text-fill",
            variant: "primary",
        },        
        details_value: {
            icon: "",
            variant: "light",
        },
        milestone: {
            icon: 'award-fill',
            variant: 'primary'
        },
        milestone_light: {
            icon: 'award-fill',
            variant: 'secondary'
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
        },
        primary: {
            icon: '',
            variant: 'primary'
        },
        secondary: {
            icon: '',
            variant: 'secondary'
        },        
        dark: {
            icon: '',
            variant: 'dark'
        },
        admin: {
            icon: '',
            variant: 'info'
        },
        supervisor: {
            icon: '',
            variant: 'primary'
        },
        frontline: {
            icon: '',
            variant: 'success'
        }
    };

    const badgeStyles: Record<string, any> = {
        lg: {lineHeight: 2, fontSize: '1rem', borderRadius: '.375rem'},
        md: {lineHeight: 1.5, fontSize: '.8rem', borderRadius: '.375rem', paddingLeft: 'auto', paddingRight: 'auto', width: '100%'},
        sm: {}
    }

    const badge = badgeConfig[type];

    return (
        <BootstrapBadge
            bg={badge.variant}
            className={`app-badge ${badge.variant === 'light' ? 'text-dark' : ''} ${className}`} 
            style={badgeStyles[size]}
        >
            {badge.icon && <i className={`bi bi-${badge.icon}`}></i>}

            {text ?? type}
        </BootstrapBadge>
    );
}