import { Accordion, Button, Col, Row, OverlayTrigger, Placeholder } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import ReviewProgressCircle from "../common/ReviewProgressCircle";
import PreviousReview from "./PreviousReview";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { useEffect, useState } from "react";
import type { ImpersonationForm } from "../admin/ImpersonationCard";
import type { User } from "../../types/User";
// import { useNavigate } from "react-router-dom";
import type { SupervisorTab } from "./SupervisorTabs";
import type { ReviewCategory } from "../../types/Review";
import Popover from "../common/Popover";
import daysSinceDate from "../../utils/days-since-date";

interface ReviewStatusDataType {
    total_employees: number;
    overdue: number;
    ready: number;
    under_five_days: number;
}

interface ReviewDashboardProps {
    authUser: User;
    supervisor?: ImpersonationForm | null;
    categories: ReviewCategory[];
    onNewReview: (activeTab: SupervisorTab, selectedUser: User) => void;
}

export default function ReviewDashboard({authUser, supervisor = null, categories, onNewReview}: ReviewDashboardProps) {
    const [activeUser, setActiveUser] = useState<AccordionEventKey | null>(null);
    const [icon, setIcon] = useState<string>('bi-exclamation-circle-fill');
    const [reviewStatusData, setReviewStatusData] = useState<ReviewStatusDataType>({
        total_employees: 0, 
        overdue: 0, 
        ready: 0, 
        under_five_days: 0
    });

    const supervisorId = supervisor?.user_id ?? authUser?.user_id;
    
    const {usersData, loading} = useSelectUsers('pendingReview', supervisorId);

    // const users = usersData.filter(user => user.supervisor_id === supervisorId);

    const elapsedDays = (lastReviewDate: string, reviewIntervalDays = 15) => {
        const today = new Date();
        const lastReview = new Date(lastReviewDate);

        const elapsedMs = today.getTime() - lastReview.getTime();
        const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));

        const daysRemaining = Math.max(reviewIntervalDays - elapsedDays, 0);
        const daysOverdue = elapsedDays - reviewIntervalDays;

        return {daysRemaining, daysOverdue};
    };

    useEffect(() => {
        const total_employees = usersData.length;
        const overdue = usersData.filter(user => {
            return elapsedDays(user.last_review_date).daysOverdue > 0;
        }).length;
        const ready = usersData.filter(user => {
            const {daysOverdue, daysRemaining} = elapsedDays(user.last_review_date);
            return daysRemaining === 0 && daysOverdue <= 0;
        }).length;
        const under_five_days = usersData.filter(user => {
            const {daysRemaining} = elapsedDays(user.last_review_date);
            return daysRemaining < 5 && daysRemaining > 0;
        }).length;

        // console.log(total_employees, overdue, ready, under_five_days);

        setReviewStatusData({total_employees, overdue, ready, under_five_days});
    }, [usersData]);

    const renderPendingReviews = () => {
        return (
            <div className="review-dashboard-container d-flex flex-column gap-2 mt-2">
                {
                    (!loading) ? 
                    (
                        <>
                            {
                                usersData.map(user => (
                                    <Accordion className="details-accordion p-0" 
                                        key={user.user_id}
                                        activeKey={activeUser}
                                        onSelect={(eventKey) => {
                                            setActiveUser(eventKey);
                                        }}
                                    >
                                        <Accordion.Item eventKey={user.user_id}>
                                            <Accordion.Header
                                                className={`review-dashboard-accordion-header ${
                                                    user.reviews.length === 0 &&
                                                    Date.now() < Date.parse(user.next_review_date)
                                                        ? "prev-reviews-disabled"
                                                        : ""
                                                }`}
                                            >
                                                <Row className="align-items-center w-100">
                                                    <Col xs="auto" className="px-2 mx-2" style={{ width: "100px" }}>
                                                            <Badge
                                                                type="milestone"
                                                                text={`${user.current_milestone} Day`}
                                                                className="d-flex justify-content-center"
                                                            />
                                                    </Col>

                                                    <Col className="px-2">
                                                        <h5 className="mb-0 fw-semibold">
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </h5>
                                                    </Col>

                                                    <Col xs="auto" className="">
                                                        <ReviewProgressCircle
                                                            lastReviewDate={
                                                                user.last_review_date ?? user.start_date
                                                            }
                                                            reviewIntervalDays={15}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                {
                                                    (Date.now() >= Date.parse(user.next_review_date)) &&
                                                    <div className="d-flex justify-content-between">
                                                        <small className="fw-semibold">Milestone reached! Sumbit a new employee review.</small>
                                                        <div className="d-flex align-items-center">
                                                            {
                                                                (daysSinceDate(user.next_review_date) > 5) &&
                                                                <OverlayTrigger
                                                                    trigger={['hover', 'focus']}
                                                                    placement="left"
                                                                    onToggle={(nextShow) => {
                                                                        setIcon(nextShow ? 
                                                                            'bi-exclamation-circle' : 
                                                                            'bi-exclamation-circle-fill'
                                                                        );
                                                                    }}
                                                                    overlay={
                                                                        <Popover 
                                                                            title="Review Period Surpassed"
                                                                            body_text="Please contact your reporting manager. Performance reviews must be submitted within 5 days after review milestone achievement."
                                                                        />
                                                                    }
                                                                >
                                                                    <i className={`bi ${icon} mx-3 fs-5 text-danger`}></i>
                                                                </OverlayTrigger>
                                                            }
                                                            
                                                            <Button 
                                                                className="border text-white"
                                                                variant={(daysSinceDate(user.next_review_date) > 5) ? 'secondary' : 'primary'}
                                                                onClick={() => onNewReview('newReview', user)}
                                                                disabled={daysSinceDate(user.next_review_date) > 45}
                                                            >
                                                                New Review
                                                            </Button>
                                                        </div>
                                                    </div>
                                                }

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
                                (usersData?.length === 0) &&
                                <div className="text-muted text-center my-auto">
                                    <p className="">No frontline employees within their first 60 days</p>
                                </div>
                            }
                        </>
                    ) : 
                    (
                        <div className="text-muted text-center my-auto">
                            <p className="">Loading reviews...</p>
                        </div>
                    )

                }

            </div>
        )
    }

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between">
                <div>
                    <h4>Review Dashboard</h4>
                    <small className="text-muted">View frontline employees with active and upcoming review milestones</small>
                </div>
                <div className="">
                    {
                        loading ? (
                            <div className="d-flex justify-content-end">
                                <Placeholder as={Col} animation="wave" md={8}>
                                    <Placeholder xs={12} className="rounded-2 " size="lg" />
                                </Placeholder>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-end gap-2 flex-wrap">
                                {
                                    reviewStatusData?.total_employees > 0 && 
                                        <Col md={'auto'} className="px-1">
                                            <Badge 
                                                type="total_employees" 
                                                text={`Total Employees - ${reviewStatusData?.total_employees}`} 
                                                size="md"
                                                className="mx-1"
                                            />
                                        </Col> 
                                }
                                {
                                    reviewStatusData?.overdue > 0 && 
                                        <Col md={'auto'} className="px-1">
                                            <Badge 
                                                type="overdue" 
                                                text={`Overdue - ${reviewStatusData?.overdue}`} 
                                                size="md"
                                                className="mx-1"
                                            />
                                        </Col>   
                                }
                                {
                                    reviewStatusData.ready > 0 &&
                                        <Col md={'auto'} className="px-1">
                                            <Badge 
                                                type="ready_for_review" 
                                                text={`Ready - ${reviewStatusData?.ready}`} 
                                                size="md"
                                                className="mx-1"
                                            />
                                        </Col>
                                }
                                {
                                    reviewStatusData.under_five_days > 0 &&
                                        <Col md={'auto'} className="px-1">
                                            <Badge 
                                                type="under_five_days" 
                                                text={`Within 5 Days - ${reviewStatusData?.under_five_days}`} 
                                                size="md"
                                                className="mx-1 px-1"
                                            />
                                        </Col>
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            
            <hr />

            <div className="d-flex justify-content-between">
                <small className="text-danger">
                    Performance reviews must be submitted within 5 days after review milestone achievement
                </small>


            </div>


            {renderPendingReviews()}
        </div>
    )
}