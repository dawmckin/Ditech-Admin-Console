import DashboardLayout from "../components/layout/DashboardLayout";
import ImpersonationCard from "../components/admin/ImpersonationCard";
import AdminTabs from "../components/admin/AdminTabs";
import ChatInput from "../components/admin/ChatInput";

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <ImpersonationCard />

            <AdminTabs />

            <ChatInput />
        </DashboardLayout>
    );
}