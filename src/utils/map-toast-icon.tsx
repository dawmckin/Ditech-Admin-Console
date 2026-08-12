import type { ReactNode } from "react";
import type { ToastType } from "../types/toast";

const toastIconMappings: Record<ToastType, ReactNode> = {
    primary: <i className="bi bi-exclamation-square-fill" />,
    secondary: <i className="bi bi-info-square-fill" />,
    success: <i className="bi bi-check-circle-fill" />,
    danger: <i className="bi bi-x-circle-fill" />,
    warning: <i className="bi bi-exclamation-triangle-fill" />,
    info: <i className="bi bi-info-circle-fill" />,
    light: <i className="bi bi-info-square" />,
    dark: <i className="bi bi-question-circle-fill" />,
};

export default function mapToastIcon(type: ToastType): ReactNode {
    return toastIconMappings[type];
}