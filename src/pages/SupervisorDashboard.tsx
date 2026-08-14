import DashboardLayout from "../components/layout/DashboardLayout";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";

export default function SupervisorDashboard() {
    return (
        <DashboardLayout>
            <SupervisorTabs></SupervisorTabs>
        </DashboardLayout>
    );
}