import { Accordion, Button } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import ReviewProgressCircle from "../common/ReviewProgressCircle";
import PreviousUserReview from "./PreviousUserReview";
// import { useNavigate } from "react-router-dom";

export default function ReviewDashboard() {
    const {usersData} = useSelectUsers('pendingReview');
    // console.log(usersData);

    // const navigate = useNavigate();

    const renderPendingReviews = () => {
        return (
            <div className="review-dashboard-container d-flex flex-column gap-2">
                {
                    usersData.map(user => (
                        <Accordion className="review-details-accordion p-0" >
                            <Accordion.Item eventKey="0">
                                <Accordion.Header className={`${user.reviews.length === 0 ? 'prev-reviews-disabled' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex align-items-center mx-2">

                                            <ReviewProgressCircle
                                                lastReviewDate={user.last_review_date ?? user.start_date}
                                                reviewIntervalDays={15}
                                            ></ReviewProgressCircle>

                                            <div className="d-flex align-items-center mx-4">
                                                <h5 className="mb-0 fw-semibold w-100">{`${user.first_name} ${user.last_name}`}</h5>
                                                <div className="mx-3">
                                                    <Badge type="milestone" text={`${user.current_milestone} Day`} />
                                                </div>
                                            </div>
                                        </div>
                                    
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className="d-flex justify-content-between">
                                        <small className="fw-semibold">Milestone reached! Sumbit a new employee review.</small>
                                        <Button 
                                            className="border text-white"
                                            variant="primary"
                                            // onClick={() => navigate()}
                                            // disabled={}
                                        >
                                            New Review
                                        </Button>
                                    </div>
                                    <PreviousUserReview reviews={user.reviews} />
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