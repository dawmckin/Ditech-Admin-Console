import { Accordion, Button } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import ReviewProgressCircle from "../common/ReviewProgressCircle";
import PreviousReview from "./PreviousReview";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { useState } from "react";
import type { ImpersonationForm } from "../admin/ImpersonationCard";
import type { User } from "../../types/User";
// import { useNavigate } from "react-router-dom";
import type { SupervisorTab } from "./SupervisorTabs";

interface ReviewDashboardProps {
    authUser: User;
    supervisor?: ImpersonationForm | null;
    onNewReview: (activeTab: SupervisorTab, selectedUser: User) => void;
}

export default function ReviewDashboard({authUser, supervisor = null, onNewReview}: ReviewDashboardProps) {
    const [activeUser, setActiveUser] = useState<AccordionEventKey | null>(null);

    const supervisorId = supervisor?.user_id ?? authUser?.user_id;
    
    const {usersData} = useSelectUsers('pendingReview');

    const renderPendingReviews = () => {
        return (
            <div className="review-dashboard-container d-flex flex-column gap-2">
                {
                    usersData.filter(user => user.supervisor_id === supervisorId).map(user => (
                        <Accordion className="review-details-accordion p-0" 
                            key={user.user_id}
                            activeKey={activeUser}
                            onSelect={(eventKey) => {
                                setActiveUser(eventKey);
                            }}
                        >
                            <Accordion.Item eventKey={user.user_id}>
                                <Accordion.Header className={`review-dashboard-accordion-header ${user.reviews.length === 0 && Date.now() < Date.parse(user.next_review_date) ? 'prev-reviews-disabled' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex align-items-center">
                                            <div className="mx-3 flex-shrink-0">
                                                <Badge
                                                    type="milestone"
                                                    text={`${user.current_milestone} Day`}
                                                />
                                            </div>

                                            <h5 className="mb-0 fw-semibold">
                                                {`${user.first_name} ${user.last_name}`}
                                            </h5>
                                        </div>

                                        <div className="px-2 flex-shrink-0">
                                            <ReviewProgressCircle
                                                lastReviewDate={
                                                    user.last_review_date ?? user.start_date
                                                }
                                                reviewIntervalDays={15}
                                            />
                                        </div>
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {
                                        (Date.now() >= Date.parse(user.next_review_date)) &&
                                        <div className="d-flex justify-content-between">
                                            <small className="fw-semibold">Milestone reached! Sumbit a new employee review.</small>
                                            <Button 
                                                className="border text-white"
                                                variant="primary"
                                                onClick={() => onNewReview('newReview', user)}
                                                // disabled={}
                                            >
                                                New Review
                                            </Button>
                                        </div>
                                    }

                                    {
                                        (user.reviews.length > 0) &&
                                        <PreviousReview user={user} reviewsData={user.reviews} onUserChange={() => activeUser}/>
                                    }
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    ))
                }
            </div>
        )
    }

    return (
        <div className="p-4">
            <h4>Employee Review Dashboard</h4>
            <small className="text-muted">View users with active and upcoming review milestones</small>
            <hr />

            {renderPendingReviews()}
        </div>
    )
}