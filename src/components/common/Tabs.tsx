import { ButtonGroup, ToggleButton } from "react-bootstrap";

import type { Tab } from "../../types/Tab";

interface TabsProps {
    tabs: Tab[],
    activeTab: string,
    onTabChange: (tabId: string) => void
}

export default function Tabs({tabs, activeTab, onTabChange}: TabsProps) {

    return (
        <ButtonGroup className="w-100 mb-3 shadow-sm">
            {
                tabs.map(tab => (
                    <ToggleButton 
                        key={tab.id}
                        id={`${tab.id}-tab`}
                        type="radio"
                        variant={activeTab === tab.id ? 'primary' : 'light'}
                        name="tabs"
                        value={tab.id}
                        checked={activeTab === tab.id}
                        onChange={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </ToggleButton>
                ))
            }
        </ButtonGroup>
    )
}