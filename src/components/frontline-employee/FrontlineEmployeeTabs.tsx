import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import FrontlineReviewDashboard from "./FrontlineReviewDashboard";

import type { Tab } from "../../types/Tab";
import type { User } from "../../types/User";

export type FrontlineEmployeeTab = "frontlineReviewDashboard";

interface EmployeeTabsProps {
    authUser: User;
}

export default function FrontlineEmployeeTabs({authUser}: EmployeeTabsProps) {
    const [activeTab, setActiveTab] = useState<FrontlineEmployeeTab>('frontlineReviewDashboard');
    console.log(authUser);
    // const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const tabs: Tab[] = [
        {id: 'frontlineReviewDashboard', label: 'Review Dashboard'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'frontlineReviewDashboard':
                return <FrontlineReviewDashboard />
                // return <ReviewDashboard 
                //     authUser={user} 
                //     supervisor={supervisor} 
                //     onNewReview={(activeTab: SupervisorTab, selectedUser: User) => {
                //         setActiveTab(activeTab);
                //         setSelectedUser(selectedUser);
                //     }}
                // />;
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