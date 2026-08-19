import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ImpersonationCard, {type ImpersonationForm} from "../components/admin/ImpersonationCard";
import AdminTabs from "../components/admin/AdminTabs";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/User";
import FrontlineEmployeeTabs from "../components/frontline-employee/FrontlineEmployeeTabs";

export default function AdminDashboard() {
    const [selectedUser, setSelectedUser] = useState<ImpersonationForm>();

    const {user: authUser} = useAuth();

    const renderView = () => {
        if(selectedUser?.user_role === 'admin' || selectedUser?.user_id === '') {
            return <AdminTabs />
        } else if(selectedUser?.user_id !== '') {
            switch(selectedUser?.user_role) {
                case 'supervisor':
                    return <SupervisorTabs authUser={authUser as User} supervisor={selectedUser}/>            
                case 'frontline':
                    return <FrontlineEmployeeTabs authUser={authUser as User}/>
            }
        }
    }

    return (
        <DashboardLayout>
            <ImpersonationCard onUserSelection={setSelectedUser}/>

            {renderView()}

        </DashboardLayout>
    );
}