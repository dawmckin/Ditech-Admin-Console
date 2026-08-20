import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import FrontlineReviewDashboard from "./FrontlineReviewDashboard";

import type { Tab } from "../../types/Tab";
import type { User } from "../../types/User";
import type { ImpersonationForm } from "../admin/ImpersonationCard";

export type FrontlineEmployeeTab = "frontlineReviewDashboard";

interface EmployeeTabsProps {
    authUser: User;
    frontline?: ImpersonationForm | null;
}

export default function FrontlineEmployeeTabs({authUser, frontline = null}: EmployeeTabsProps) {
    const [activeTab, setActiveTab] = useState<FrontlineEmployeeTab>('frontlineReviewDashboard');

    const tabs: Tab[] = [
        {id: 'frontlineReviewDashboard', label: 'Review Dashboard'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'frontlineReviewDashboard':
                return <FrontlineReviewDashboard 
                    authUser={authUser} 
                    frontline={frontline}
                />
        }
    }

    return (
        <>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab as FrontlineEmployeeTab)}
            />

            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    {renderTabContent()}
                </Card.Body>
            </Card>
        </>
    )
}