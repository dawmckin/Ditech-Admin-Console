import { useState } from "react";
import { Card } from "react-bootstrap";

import Tabs from "../common/Tabs"
import ChatInput from "../admin/ChatInput";
import EmployeeReviews from "../admin/EmployeeReviews";
import AuditLogs from "../admin/AuditLogs";

import type { Tab } from "../../types/Tab";

type AdminTab = "chat" | "employeeReviews" | "auditLogs";

export default function AdminTabs() {
    const [activeTab, setActiveTab] = useState<AdminTab>('chat');

    const tabs: Tab[] = [
        {id: 'chat', label: 'Admin Console'},
        {id: 'employeeReviews', label: 'Employee Reviews'},
        {id: 'auditLogs', label: 'Audit Logs'}
    ]

    const renderTabContent = () => {
        switch(activeTab) {
            case 'chat':
                return <ChatInput />;
            case 'employeeReviews':
                return <EmployeeReviews />;
            case 'auditLogs':
                return <AuditLogs />;
        }
    }

    return (
        <>
            <Tabs 
                tabs={tabs} 
                activeTab={activeTab} 
                onTabChange={(tab) => setActiveTab(tab as AdminTab)}
            />

            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    {renderTabContent()}
                </Card.Body>
            </Card>
        </>
    )
}