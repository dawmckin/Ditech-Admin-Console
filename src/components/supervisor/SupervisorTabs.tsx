import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import ReviewDashboard from "./ReviewDashboard";
import NewReview from "./NewReview";
import type { ImpersonationForm } from "../admin/ImpersonationCard";

import type { Tab } from "../../types/Tab";
import type { User } from "../../types/User";
import useReviewCategory from "../../hooks/useReviewCategory";

export type SupervisorTab = "reviewDashboard" | "newReview";

interface SupervisorTabsProps {
    authUser: User;
    supervisor?: ImpersonationForm | null;
}

export default function SupervisorTabs({authUser, supervisor = null}: SupervisorTabsProps) {
    const [activeTab, setActiveTab] = useState<SupervisorTab>('reviewDashboard');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const {categories} = useReviewCategory();

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
                    categories={categories}
                    onNewReview={(activeTab: SupervisorTab, selectedUser: User) => {
                        setActiveTab(activeTab);
                        setSelectedUser(selectedUser);
                    }}
                />;
            case 'newReview':
                return <NewReview 
                    authUser={authUser} 
                    supervisor={supervisor} 
                    categories={categories}
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