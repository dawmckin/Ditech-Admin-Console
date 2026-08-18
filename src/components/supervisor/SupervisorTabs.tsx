import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import ReviewDashboard from "./ReviewDashboard";
import NewReview from "./NewReview";
import type { ImpersonationForm } from "../admin/ImpersonationCard";

import type { Tab } from "../../types/Tab";

type SupervisorTab = "reviewDashboard" | "newReview";

interface SupervisorTabsProps {
    supervisor?: ImpersonationForm | null
}

export default function SupervisorTabs({supervisor}: SupervisorTabsProps) {
    const [activeTab, setActiveTab] = useState<SupervisorTab>('reviewDashboard');

    const tabs: Tab[] = [
        {id: 'reviewDashboard', label: 'Review Dashboard'},
        {id: 'newReview', label: 'Submit New Review'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'reviewDashboard':
                return <ReviewDashboard supervisor={supervisor}/>;
            case 'newReview':
                return <NewReview supervisor={supervisor}/>;
        }
    }

    return (
        <>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab as SupervisorTab)}
            />

            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    {renderTabContent()}
                </Card.Body>
            </Card>
        </>
    )
}