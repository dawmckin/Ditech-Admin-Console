import type { ReactNode } from "react";
import Header from "./Header";
import PageContainer from "./PageContainer";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({children}: DashboardLayoutProps) {

    return (
        <div className="min-vh-100 bg-light">
            <Header />

            <PageContainer>
                {children}
            </PageContainer>
        </div>
    )
}