import { Accordion, Col, ProgressBar, Row } from "react-bootstrap";
import ReviewScoreProgressCircle from "../common/ReviewScoreProgressCircle";
import Badge, { type BadgeType } from "../common/Badge";
import type { User } from "../../types/User";
import formatDateTime from "../../utils/format-date-time";
import { useEffect, useState } from "react";
import type { Review } from "../../types/Review";
import PreviousReviewDetails from "../supervisor/PreviousReviewDetails";
import type { ImpersonationForm } from "../admin/ImpersonationCard";
import { useSelectUsers } from "../../hooks/useSelectUsers";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import useReviewCategory from "../../hooks/useReviewCategory";
import daysSinceDate from "../../utils/days-since-date";

import './FrontlineReviewDashboard.css';

type ReviewStatusType =
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'

interface ReviewStatusProps {
    title: string;
    variant: string;
}

interface FrontlineReviewDashboardProps {
    authUser: User;
    frontline?:  ImpersonationForm | null;
}

export default function FrontlineReviewDashboard({authUser, frontline = null}: FrontlineReviewDashboardProps) {
    const reviewStatusConfig: Record<ReviewStatusType, ReviewStatusProps> = {
        complies: {
            title: 'Complies',
            variant: 'success'
        },
        needs_improving: {
            title: 'Needs Improving',
            variant: 'warning'
        },
        does_not_comply: {
            title: 'Does Not Comply',
            variant: 'danger'
        }
    }

    const milestoneConfig = ['15', '30', '45', '60'];

    const frontlineId = frontline?.user_id ?? authUser?.user_id;

    const {categories} = useReviewCategory();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeReviewDetails, setActiveReviewDetails] = useState<AccordionEventKey | null>(null);

    const {usersData, loading} = useSelectUsers('single', null, frontlineId);

    const reviewStatusMapping: Record<ReviewStatusType, ReviewStatusProps> = {
        complies: {
            title: 'Complies',
            variant: 'success'
        },
        needs_improving: {
            title: 'Needs Improving',
            variant: 'warning'
        },
        does_not_comply: {
            title: 'Does Not Comply',
            variant: 'danger'
        }
    }

    useEffect(() => {
        setActiveReviewDetails(null);
        setReviews(usersData[0]?.reviews as Review[]);
    }, [usersData]);

    return (
        <div className="p-3 p-md-4">
            <div className="d-flex flex-column gap-2">
                <div className="frontline-dashboard-header">
                    <Row className="align-items-center">

                        <Col xs={12} md={3}>
                            <div className="frontline-milestones p-0">
                                {loading
                                    ? milestoneConfig.map((milestone) => (
                                        <div
                                            key={milestone}
                                            className="frontline-milestone"
                                        >
                                            <ReviewScoreProgressCircle
                                                totalScore={0}
                                                reviewStatus="incomplete"
                                            />

                                            <small className="text-muted">
                                                {milestone} Days
                                            </small>
                                        </div>
                                    ))
                                    : milestoneConfig.map((milestone) => (
                                        <div
                                            key={milestone}
                                            className="frontline-milestone"
                                        >
                                            <ReviewScoreProgressCircle
                                                totalScore={
                                                    reviews?.find(
                                                        review =>
                                                            review.milestone === milestone
                                                    )?.total_score ?? 0
                                                }
                                                reviewStatus={
                                                    reviews?.find(
                                                        review =>
                                                            review.milestone === milestone
                                                    )?.review_status as ReviewStatusType ??
                                                    "incomplete"
                                                }
                                            />

                                            <small className="text-muted">
                                                {milestone} Days
                                            </small>
                                        </div>
                                    ))
                                }
                            </div>
                        </Col>

                        {!loading && (
                            <Col xs={12} md={{ span: 4, offset: 5 }}>
                                <p
                                    className={`text-${
                                        daysSinceDate(usersData[0]?.start_date) < 0
                                            ? "secondary"
                                            : "primary"
                                    } fw-semibold frontline-current-day`}
                                >
                                    {daysSinceDate(usersData[0]?.start_date) < 0
                                        ? "Not Started"
                                        : `Day ${daysSinceDate(usersData[0]?.start_date)}`}
                                </p>
                            </Col>
                        )}

                    </Row>
                </div>
                <hr className="mt-0" />
                
                <div className="d-flex justify-content-between">
                    <h3>Performance Reviews</h3>

                    {!loading && (
                            <p
                                className={`text-${
                                    daysSinceDate(usersData[0]?.start_date) < 0
                                        ? "secondary"
                                        : "primary"
                                } fw-semibold mx-1 my-auto frontline-current-day-mobile`}
                            >
                                {daysSinceDate(usersData[0]?.start_date) < 0
                                    ? "Not Started"
                                    : `Day ${daysSinceDate(usersData[0]?.start_date)}`}
                            </p>
                    )}
                </div>

                {
                    !loading ? 
                    (
                        <div className="review-dashboard-container d-flex flex-column gap-2">
                            <Accordion className="details-accordion p-0"
                                defaultActiveKey="0"
                            >
                            {(
                                reviews?.toReversed().map((review, index) => (
                                    <Accordion.Item eventKey={`${index}`}>
                                        <Accordion.Header className="frontline-review-dashboard-accordion-header">
                                            <div className="frontline-review-header">

                                                <div className="frontline-review-milestone">
                                                    <Badge
                                                        type="milestone"
                                                        text={`${review.milestone} Day`}
                                                        size="lg"
                                                    />
                                                </div>

                                                <div className="frontline-review-score">
                                                    <p className="total-score mb-0">Total Score: {review.total_score} / 75</p>

                                                    <Badge
                                                        type={review.review_status as BadgeType}
                                                        text={
                                                            reviewStatusConfig[
                                                                review.review_status as ReviewStatusType
                                                            ].title
                                                        }
                                                    />
                                                </div>

                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row className="review-body">
                                                <Col
                                                    xs={12}
                                                    md={1}
                                                    className="review-score-column"
                                                >
                                                    <div className="review-progress-circle">
                                                        <ReviewScoreProgressCircle
                                                            totalScore={review.total_score}
                                                            reviewStatus={
                                                                review.review_status as ReviewStatusType
                                                            }
                                                            
                                                        />
                                                    </div>
                                                    <div className="review-progress-bar w-100">
                                                        <ProgressBar 
                                                            variant={reviewStatusMapping[review.review_status as ReviewStatusType].variant} 
                                                            max={75} 
                                                            now={review.total_score} 
                                                            className="mt-1 w-100"
                                                        />
                                                    </div>

                                                </Col>                                   
                                                <Col md={11}>
                                                    <Accordion 
                                                        className="details-accordion w-100" 
                                                        activeKey={activeReviewDetails}
                                                        onSelect={(eventKey) => {
                                                            setActiveReviewDetails(eventKey);
                                                        }}
                                                    >
                                                        <Accordion.Item eventKey='0' className="mx-0">
                                                            <Accordion.Header>
                                                                <div className="d-flex align-items-center w-100">
                                                                    <i className="bi bi-clipboard2-data me-2"></i>

                                                                    <h6 className="mb-0">
                                                                        Review Details
                                                                    </h6>
                                                                </div>
                                                            </Accordion.Header>
                                                            <Accordion.Body>
                                                                <PreviousReviewDetails 
                                                                    user={usersData[0]} 
                                                                    prompts={review.prompts ?? []}
                                                                    categories={categories ?? []}
                                                                    milestone={review.milestone}
                                                                    reviewer={`${review.supervisor_data.first_name} ${review.supervisor_data.last_name}`}
                                                                />
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                    <div className="mt-2 bg-light shadow-sm border-0 rounded-1 p-2">
                                                        <small className="d-block text-break">
                                                            <span className="fw-semibold">
                                                                Overall Feedback:
                                                            </span>{" "}
                                                            {review.final_feedback}
                                                        </small>
                                                    </div>
                                                    <div className="mt-2 text-end" style={{fontSize: '.8em'}}>
                                                        <small className="mt-auto text-muted">
                                                            <span className="fw-semibold">Submitted On: </span> 
                                                            {formatDateTime(review.created_at)}
                                                        </small>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))
                            )}
                            </Accordion>

                            {
                                (reviews?.length === 0) &&
                                <div className="text-muted text-center my-auto">
                                    <p className="">No performance reviews to show</p>
                                </div>
                            }
                        </div>
                    ) : 
                    (
                        <div className="text-muted text-center my-auto">
                            <p className="">Loading reviews...</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}