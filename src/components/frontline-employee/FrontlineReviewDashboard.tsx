import { Accordion, Col, Row } from "react-bootstrap";
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
import daysSinceStartDate from "../../utils/days-since-start-date";

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

    const milestoneConfig = [15, 30, 45, 60];

    const frontlineId = frontline?.user_id ?? authUser?.user_id;

    const {categories} = useReviewCategory();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeReviewDetails, setActiveReviewDetails] = useState<AccordionEventKey | null>(null);

    const {usersData, loading} = useSelectUsers('single', frontlineId);

    useEffect(() => {
        setActiveReviewDetails(null);
        setReviews(usersData[0]?.reviews as Review[]);
    }, [usersData]);

    return (
        <div className="p-4">
            <div className="d-flex flex-column gap-2">
                <div className="frontline-dashboard-header">
                    <Row>
                        {/* {
                            loading && <p>asdfasdfasdfasdfasdfasd</p>
                        } */}
                        <Col md={4}>
                            <div className="d-flex text-center">

                            {
                                loading ? 
                                (
                                    milestoneConfig.slice(reviews?.length, 4)?.map(milestone => (
                                        <div>
                                            <ReviewScoreProgressCircle totalScore={0} reviewStatus='incomplete' />
                                            <small className="text-muted">{milestone} Days</small>
                                        </div>
                                    ))                                    
                                ) : 
                                (
                                    <>
                                    {
                                        reviews?.map(review => (
                                            <div>
                                                <ReviewScoreProgressCircle totalScore={review.total_score} reviewStatus={review.review_status as ReviewStatusType} />
                                                <small className="text-muted">{review.milestone} Days</small>
                                            </div>
                                        ))
                                    }
                                    {
                                        (reviews?.length < 4) && 
                                        (
                                            milestoneConfig.slice(reviews?.length, 4)?.map(milestone => (
                                                <div>
                                                    <ReviewScoreProgressCircle totalScore={0} reviewStatus='incomplete' />
                                                    <small className="text-muted">{milestone} Days</small>
                                                </div>
                                            ))
                                        )
                                    }
                                    </>
                                )
                            }

                            </div>
                        </Col>
                        {
                            !loading && 
                            <Col md={{span: 1, offset: 7}}>
                                <p className="text-primary fw-semibold text-end">Day {daysSinceStartDate(usersData[0]?.start_date)}</p>
                            </Col>
                        }
                    </Row>
                </div>
                <hr className="mt-0" />
                
                <h3>Performance Reviews</h3>

                {
                    !loading ? 
                    (
                        <div className="review-dashboard-container d-flex flex-column gap-2">
                            <Accordion className="review-details-accordion p-0"
                                defaultActiveKey="0"
                            >
                            {(
                                reviews?.map((review, index) => (
                                    <Accordion.Item eventKey={`${index}`}>
                                        <Accordion.Header className="frontline-review-dashboard-accordion-header">
                                            <div className="d-flex justify-content-between align-items-center w-100">
                                                <div className="d-flex align-items-center">
                                                    <div className="mx-2 flex-shrink-0">
                                                        <Badge
                                                            type="milestone"
                                                            text={`${review.milestone} Day Review`}
                                                            size="lg"
                                                        />
                                                    </div>

                                                </div>

                                                <div className="d-flex flex-column mx-3 flex-shrink-0">
                                                    <p className="total-score mb-0">Total Score: {review.total_score} / 75</p>
                                                    <div className="text-end mt-1">
                                                        <Badge
                                                            type={review.review_status as BadgeType}
                                                            text={reviewStatusConfig[review.review_status as ReviewStatusType].title}
                                                        />
                                                    </div>


                                                </div>
                                            </div>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <Row>
                                                <Col md={1}>
                                                    <div className="d-flex text-center">
                                                        <div>
                                                            <ReviewScoreProgressCircle totalScore={review.total_score} reviewStatus={review.review_status as ReviewStatusType} />
                                                        </div>
                                                    </div>  
                                                </Col>                                    
                                                <Col md={11}>
                                                    <Accordion 
                                                        className="review-details-accordion" 
                                                        activeKey={activeReviewDetails}
                                                        onSelect={(eventKey) => {
                                                            setActiveReviewDetails(eventKey);
                                                        }}
                                                    >
                                                        <Accordion.Item eventKey='0' className="mx-0">
                                                            <Accordion.Header>
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div className="d-flex">
                                                                        <i className="bi bi-clipboard2-data"></i>
                                                                        
                                                                        <div className="my-auto mx-2">
                                                                            <h6 className="mb-0">Review Details</h6>
                                                                        </div>
                                                                    </div>
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
                                                    <div className="d-flex mt-2 bg-light shadow-sm border-0 rounded-1 p-1" >
                                                        <small className="">
                                                            <span className="fw-semibold">Overall Feedback: </span>
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
                            <p className="">Loading...</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}