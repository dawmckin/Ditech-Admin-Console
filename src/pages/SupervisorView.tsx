import DashboardLayout from "../components/layout/DashboardLayout";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/User";

export default function SupervisorView() {
    const {user: authUser} = useAuth();
    
    return (
        <DashboardLayout>
            <SupervisorTabs authUser={authUser as User}></SupervisorTabs>
        </DashboardLayout>
    );
}