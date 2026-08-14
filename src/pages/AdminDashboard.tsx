import { useState } from "react";

import DashboardLayout from "../components/layout/DashboardLayout";
import ImpersonationCard, {type ImpersonationForm} from "../components/admin/ImpersonationCard";
import AdminTabs from "../components/admin/AdminTabs";
import SupervisorTabs from "../components/supervisor/SupervisorTabs";

export default function AdminDashboard() {
    const [selectedUser, setSelectedUser] = useState<ImpersonationForm>();

    const renderView = () => {
        switch(selectedUser?.user_role) {
            case 'supervisor':
                return <SupervisorTabs />            
            case 'frontline':
                return <SupervisorTabs />
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