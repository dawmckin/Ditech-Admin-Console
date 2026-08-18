import DashboardLayout from "../components/layout/DashboardLayout";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/User";

export default function SupervisorDashboard() {
    const {user} = useAuth();
    
    return (
        <DashboardLayout>
            <SupervisorTabs user={user as User}></SupervisorTabs>
        </DashboardLayout>
    );
}