import { Accordion } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import ReviewProgressCircle from "../common/ReviewProgressCircle";
import PreviousReview from "../supervisor/PreviousReview";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import type { ReviewCategory } from "../../types/Review";
import daysSinceStartDate from "../../utils/days-since-start-date";

interface EmployeeReviewsProps {
    categories: ReviewCategory[];
}

export default function EmployeeReviews({categories}: EmployeeReviewsProps) {
    const [activeUser, setActiveUser] = useState<AccordionEventKey | null>(null);
    
    const {usersData, loading} = useSelectUsers('pastReview');
    console.log(usersData);

    const users = usersData.filter(user => user.reviews.length > 0);

    const renderPastReviews = () => {
        return (
            <div className="review-dashboard-container d-flex flex-column gap-2">
                {
                    (!loading) ? 
                    (
                        <>
                            {
                                users.map(user => (
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
                                                                type="primary"
                                                                text={`Day ${daysSinceStartDate(user?.start_date)}`}
                                                            />
                                                        </div>

                                                        <h5 className="mb-0 fw-semibold">
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </h5>
                                                    </div>
                                                    <div className="flex-shrink-0">
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
                                                    (user.reviews.length > 0) &&
                                                    <PreviousReview user={user} reviewsData={user.reviews} categories={categories} onUserChange={() => activeUser}/>
                                                }
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    </Accordion>
                                ))
                            }
                            {
                                (users?.length === 0) &&
                                <div className="text-muted text-center my-auto">
                                    <p className="">No frontline employees</p>
                                </div>
                            }
                        </>
                    ) : 
                    (
                        <div className="text-muted text-center my-auto">
                            <p className="">Loading...</p>
                        </div>
                    )

                }

            </div>
        )
    }

    return (
        <div className="p-4">
            <h4>Employee Reviews</h4>
            <small className="text-muted">View frontline employees with past review milestones</small>
            <hr />

            {renderPastReviews()}
        </div>
    )
}