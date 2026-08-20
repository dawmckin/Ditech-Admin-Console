import FrontlineEmployeeTabs from "../components/frontline-employee/FrontlineEmployeeTabs";
import DashboardLayout from "../components/layout/DashboardLayout";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/User";

export default function FrontlineEmployeeView() {
    const {user: authUser} = useAuth();
    
    return (
        <DashboardLayout>
            <FrontlineEmployeeTabs authUser={authUser as User}></FrontlineEmployeeTabs>
        </DashboardLayout>
    );
}