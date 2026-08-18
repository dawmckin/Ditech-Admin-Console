import { Accordion, Card, Col, ProgressBar, Row } from "react-bootstrap";
import Badge, { type BadgeType } from "../common/Badge";
import type { Review } from "../../types/Review";
import { useEffect, useState } from "react";
import PreviousReviewDetails from "./PreviousReviewDetails";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import formatDateTime from "../../utils/format-date-time";
import type { User } from "../../types/User";

type ReviewStatusType =
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'

interface ReviewStatusProps {
    title: string;
    variant: string;
}

interface PreviousReviewProps {
    user: User;
    reviewsData: Review[];
    onUserChange: () => AccordionEventKey;
}

export default function PreviousReview({user, reviewsData, onUserChange}: PreviousReviewProps) {
    // console.log(user);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeReview, setActiveReview] = useState<AccordionEventKey | null>(null);

    const activeUser = onUserChange()?.toString();

    useEffect(() => {
        if(activeUser !== user.user_id) setActiveReview(null);
    }, [onUserChange]);

    useEffect(() => {
        const formattedPrompts = reviewsData.map(review => ({
            ...review,
            prompts: review.prompts?.map(prompt => {
                const promptObj = {
                    ...prompt,
                    category_title: prompt.category_data?.category_title,
                    category_order: prompt.category_data?.category_order,
                    prompt_text: prompt.prompt_data?.prompt_text,
                    prompt_order: prompt.prompt_data?.prompt_order, 
                }
                delete promptObj.category_data;
                delete promptObj.prompt_data;
                return promptObj;
            })
        }));

        setReviews(formattedPrompts as Review[]);

    }, [reviewsData]);

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

    return (
        <div className="mt-3">
            {
                (reviews.sort((a, b) => b.milestone.localeCompare(a.milestone)).map(review => (
                    <Card className="shadow-sm border-0 rounded-4 mt-3" key={review.review_id}>
                        <Card.Body className="p-2">
                            <Row className="g-3">
                                <Col md={2}>
                                    <Badge type="milestone_light" text={`${review.milestone} Day`} />
                                </Col>

                                <Col md={10}>
                                    <Row>
                                        <Col md={12}>
                                            <ProgressBar 
                                                variant={reviewStatusMapping[review.review_status as ReviewStatusType].variant} 
                                                max={75} 
                                                now={review.total_score} 
                                                className="mt-1 w-100"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="">
                                        <Col md={9}>
                                            <div className="d-flex flex-column justify-content-between h-100">
                                                <Accordion className="review-details-accordion my-3"
                                                    activeKey={activeReview}
                                                    onSelect={(eventKey) => {
                                                        setActiveReview(eventKey);
                                                    }}
                                                >
                                                    <Accordion.Item eventKey={review.review_id} className="mx-0">
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
                                                                user={user} 
                                                                reviewer={`${review.supervisor_data?.first_name} ${review.supervisor_data?.last_name}`}
                                                                milestone={review.milestone} 
                                                                prompts={review.prompts ?? []}
                                                            />
                                                        </Accordion.Body>
                                                    </Accordion.Item>
                                                </Accordion>
                                                <div className="d-flex flex-column">
                                                    <small>
                                                        <span className="fw-semibold">Overall Feedback: </span>
                                                    </small>
                                                    <small>
                                                        {review.final_feedback}
                                                    </small>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex flex-column justify-content-between text-end h-100">
                                                <div className="mt-3">
                                                    <p className="total-score mb-0">Total Score: {review.total_score} / 75</p>
                                                    <Badge 
                                                        type={review.review_status as BadgeType}
                                                        text={reviewStatusMapping[review.review_status as ReviewStatusType].title}
                                                    />                                              
                                                </div>
                                                <div className="mt-2" style={{fontSize: '.8em'}}>
                                                    <small className="mt-auto text-muted">
                                                        <span className="fw-semibold">Submitted On: </span> 
                                                        {formatDateTime(review.created_at ?? '')}
                                                    </small>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                )))
            }
        </div>
    );
}