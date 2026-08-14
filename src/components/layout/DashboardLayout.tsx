import type { ReactNode } from "react";
import Header from "./Header";
import PageContainer from "./PageContainer";

import useAuth from "../../hooks/useAuth";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {

    const {user} = useAuth();

    return (
        <div className="min-vh-100 bg-light">
            <Header userRole={user?.user_role ?? 'frontline'} />

            <PageContainer>
                {children}
            </PageContainer>
        </div>
    )
}