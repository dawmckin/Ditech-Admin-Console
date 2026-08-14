import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import useAuth from "../../hooks/useAuth";

import type { UserRole } from "../../types/User";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
}

export default function ProtectedRoute({children, allowedRoles}: ProtectedRouteProps) {
    const {user, loading} = useAuth();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Authenticated but account is inactive
    if (!user.is_active) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // Authenticated and active, but doesn't have
    // the required role for this route
    if (
        allowedRoles &&
        !allowedRoles.includes(user.user_role)
    ) {
        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    return <>{children}</>;
}