import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ImpersonationCard, {type ImpersonationForm} from "../components/admin/ImpersonationCard";
import AdminTabs from "../components/admin/AdminTabs";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";
import useAuth from "../hooks/useAuth";
import type { User } from "../types/User";

export default function AdminDashboard() {
    const [selectedUser, setSelectedUser] = useState<ImpersonationForm>();

    const {user} = useAuth();

    const renderView = () => {
        switch(selectedUser?.user_role) {
            case 'supervisor':
                return <SupervisorTabs user={user as User} supervisor={selectedUser}/>            
            case 'frontline':
                return <SupervisorTabs user={user as User}/>
            default:
                return <AdminTabs />
        }
    }

    return (
        <DashboardLayout>
            <ImpersonationCard onUserSelection={setSelectedUser}/>

            {renderView()}

        </DashboardLayout>
    );
}