import { Accordion, Col, Form, Row } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";
import ReviewProgressCircle from "../common/ReviewProgressCircle";
import PreviousReview from "../supervisor/PreviousReview";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import type { ReviewCategory } from "../../types/Review";
import daysSinceDate from "../../utils/days-since-date";
import SearchBar from "../common/SearchBar";

type ReviewsFilterType = 
    | 'all'
    | 'pendingMilestone'
    | 'readyForReview' 
    | 'pastReviewPeriod'
    | 'milestonesCompleted'

interface EmployeeReviewsProps {
    categories: ReviewCategory[];
}

export default function EmployeeReviews({categories}: EmployeeReviewsProps) {
    const [activeUser, setActiveUser] = useState<AccordionEventKey | null>(null);
    const [filter, setFilter] = useState<ReviewsFilterType>('all');
    
    const {usersData, loading} = useSelectUsers('pastReview');

    // search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredUsers = usersData.filter((user) => {
        const search = searchTerm.toLowerCase().trim();

        // Search filter
        const matchesSearch =
            !search ||
            user.first_name?.toLowerCase().includes(search) ||
            user.last_name?.toLowerCase().includes(search);

        let matchesFilter = true;

        switch (filter) {
            case "pendingMilestone":
                // Employee is some days away from review period
                matchesFilter =
                    matchesFilter = user.current_milestone !== '75' &&
                    daysSinceDate(user.next_review_date) < 0;
                break;

            case "readyForReview":
                // Employee has reached review period
                matchesFilter =
                    matchesFilter = user.current_milestone !== '75' &&
                    daysSinceDate(user.next_review_date) >= 0 &&
                    daysSinceDate(user.next_review_date) <= 5;
                break;

            case "pastReviewPeriod":
                // Employee is beyond the review period
                matchesFilter =
                    matchesFilter = user.current_milestone !== '75' &&
                    daysSinceDate(user.next_review_date) > 5;
                break;
            case "milestonesCompleted":
                // Employee has completed all previous review periods
                matchesFilter = user.current_milestone === '75';
                break;
            case "all":
                matchesFilter = true;
                break;
            default:
                matchesFilter = true;
        }

        return matchesSearch && matchesFilter;
    });

    const renderPastReviews = () => {
        return (
            <>
                <Row className="mb-2">
                    <Col md={3}>
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search employees..."
                        />                    
                    </Col>
                    <Col md={{span: 3, offset: 6}} className="d-flex justify-content-end align-items-center">
                        <Form.Label className="mx-2 mb-0">
                            Filter: 
                        </Form.Label>
                        <Form.Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as ReviewsFilterType)}
                            className="w-75"
                        >
                            <option value="" hidden>Select filter</option>
                            <option value="all" >All Employees</option>
                            <option value="milestonesCompleted">Milestones Completed</option>
                            <option value="pastReviewPeriod">Past Review Period</option>
                            <option value="pendingMilestone">Pending Milestone</option>
                            <option value="readyForReview">Ready For Review</option>

                        </Form.Select>

                    </Col>
                </Row>

                <div className="review-dashboard-container d-flex flex-column gap-2">
                    {
                        (!loading) ? 
                        (
                            <>
                                {
                                    filteredUsers.map(user => (
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
                                                        user.reviews.length === 0
                                                            ? "prev-reviews-disabled"
                                                            : ""
                                                    }`}
                                                >
                                                    <Row className="align-items-center w-100">
                                                        <Col xs="auto" className="px-3" style={{ width: "100px" }}>
                                                            <Badge
                                                                type={
                                                                    daysSinceDate(user?.start_date) < 0
                                                                        ? "secondary"
                                                                        : "primary"
                                                                }
                                                                text={
                                                                    daysSinceDate(user?.start_date) < 0
                                                                        ? "Not Started"
                                                                        : `Day ${daysSinceDate(user?.start_date)}`
                                                                }
                                                                className="d-flex justify-content-center"
                                                            />
                                                        </Col>

                                                        <Col className="px-2">
                                                            <h5 className="mb-0 fw-semibold">
                                                                {`${user.first_name} ${user.last_name}`}
                                                            </h5>
                                                        </Col>

                                                        <Col xs="auto" className="">
                                                            {
                                                                (Number.parseInt(user.current_milestone) === 75) ? 
                                                                (
                                                                    <Badge
                                                                        type='secondary'
                                                                        text='All Milestones Reached'
                                                                        className="d-flex justify-content-center"
                                                                    />
                                                                ) : 
                                                                (
                                                                    <ReviewProgressCircle
                                                                        lastReviewDate={
                                                                            user.last_review_date ?? user.start_date
                                                                        }
                                                                        reviewIntervalDays={15}
                                                                    />
                                                                )
                                                            }

                                                        </Col>
                                                    </Row>
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
                                {(filteredUsers.length === 0 && !loading) && (
                                    <div className="text-muted text-center my-auto">
                                        <p>
                                            {usersData.length === 0
                                                ? "No frontline employees"
                                                : "No employees match your search or filter"}
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : 
                        (
                            <div className="text-muted text-center my-auto">
                                <p className="">Loading frontline employees...</p>
                            </div>
                        )
                    }
                </div>
            </>
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