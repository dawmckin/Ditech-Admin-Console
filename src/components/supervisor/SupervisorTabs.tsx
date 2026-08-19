import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import ReviewDashboard from "./ReviewDashboard";
import NewReview from "./NewReview";
import type { ImpersonationForm } from "../admin/ImpersonationCard";

import type { Tab } from "../../types/Tab";
import type { User } from "../../types/User";

export type SupervisorTab = "reviewDashboard" | "newReview";

interface SupervisorTabsProps {
    authUser: User;
    supervisor?: ImpersonationForm | null;
}

export default function SupervisorTabs({authUser, supervisor = null}: SupervisorTabsProps) {
    const [activeTab, setActiveTab] = useState<SupervisorTab>('reviewDashboard');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const tabs: Tab[] = [
        {id: 'reviewDashboard', label: 'Review Dashboard'},
        {id: 'newReview', label: 'Submit New Review'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'reviewDashboard':
                return <ReviewDashboard 
                    authUser={authUser} 
                    supervisor={supervisor} 
                    onNewReview={(activeTab: SupervisorTab, selectedUser: User) => {
                        setActiveTab(activeTab);
                        setSelectedUser(selectedUser);
                    }}
                />;
            case 'newReview':
                return <NewReview 
                    authUser={authUser} 
                    supervisor={supervisor} 
                    selectedUser={selectedUser}
                />;
        }
    }

    return (
        <>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(tab) => {
                    setActiveTab(tab as SupervisorTab);
                    setSelectedUser(null);
                }}
            />

            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    {renderTabContent()}
                </Card.Body>
            </Card>
        </>
    )
}