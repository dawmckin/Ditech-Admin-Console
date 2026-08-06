import { useState } from "react";
import { ButtonGroup, ToggleButton, Card } from "react-bootstrap";
// import ButtonGroup from "react-bootstrap/ButtonGroup";
// import ToggleButton from "react-bootstrap/ToggleButton";
// import Card from "react-bootstrap/Card";

import ChatInput from "./ChatInput";
import EmployeeReviews from "./EmployeeReviews";
import AuditLogs from "./AuditLogs";

type TabType = 'chat' | 'reviews' | 'audit';

export default function AdminTabs() {
    const [activeTab, setActiveTab] = useState<TabType>("chat");

    const renderTabs = () => {
        switch(activeTab) {
            case 'chat':
                return <ChatInput />;
            case 'reviews':
                return <EmployeeReviews />;
            case 'audit':
                return <AuditLogs />;
            
        }
    }

    return (
        <>
            <ButtonGroup className="w-100 mb-3 shadow-sm">
                <ToggleButton 
                    id="chat-tab"
                    type="radio"
                    variant={activeTab === 'chat' ? 'primary' : 'light'}
                    name="tabs"
                    value='chat'
                    checked={activeTab === 'chat'}
                    onChange={() => setActiveTab('chat')}
                >
                    Admin Chat
                </ToggleButton>

                <ToggleButton 
                    id="reviews-tab"
                    type="radio"
                    variant={activeTab === 'reviews' ? 'primary' : 'light'}
                    name="tabs"
                    value='reviews'
                    checked={activeTab === 'reviews'}
                    onChange={() => setActiveTab('reviews')}
                >
                    Employee Reviews
                </ToggleButton>

                <ToggleButton 
                    id="audit-tab"
                    type="radio"
                    variant={activeTab === 'audit' ? 'primary' : 'light'}
                    name="tabs"
                    value='audit'
                    checked={activeTab === 'audit'}
                    onChange={() => setActiveTab('audit')}
                >
                    Audit Logs
                </ToggleButton>
            </ButtonGroup>

            <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                    {renderTabs()}
                </Card.Body>
            </Card>
        </>
    )
}