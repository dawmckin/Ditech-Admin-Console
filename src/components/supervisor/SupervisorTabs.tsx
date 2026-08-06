import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import ReviewDashboard from "./ReviewDashboard";
import NewReview from "./NewReview";

import type { Tab } from "../../types/tab";

type SupervisorTab = "reviewDashboard" | "newReview";

export default function SupervisorTabs() {
    const [activeTab, setActiveTab] = useState<SupervisorTab>('reviewDashboard');

    const tabs: Tab[] = [
        {id: 'reviewDashboard', label: 'Review Dashboard'},
        {id: 'newReview', label: 'Submit New Review'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'reviewDashboard':
                return <ReviewDashboard />;
            case 'newReview':
                return <NewReview />;
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