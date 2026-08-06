import DashboardLayout from "../components/layout/DashboardLayout";
import ImpersonationCard from "../components/admin/ImpersonationCard";
import AdminTabs from "../components/admin/AdminTabs";

export default function AdminDashboard() {
    return (
        <DashboardLayout>
            <ImpersonationCard />

            <AdminTabs />

        </DashboardLayout>
    );
}