import { Accordion, Card, Col, ProgressBar, Row } from "react-bootstrap";
import Badge from "../common/Badge";
import type { Review } from "../../types/Review";
import { useEffect, useState } from "react";
import PreviousReviewDetails from "./PreviousReviewDetails";
import type { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";

type ReviewStatusType =
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'

interface ReviewStatusProps {
    title: string;
    variant: string;
}

interface PreviousReviewProps {
    userId: string;
    reviewsData: Review[];
    onUserChange: () => AccordionEventKey;
}

export default function PreviousReview({userId, reviewsData, onUserChange}: PreviousReviewProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeReview, setActiveReview] = useState<AccordionEventKey | null>(null);

    const activeUser = onUserChange()?.toString();

    useEffect(() => {
        if(activeUser !== userId) setActiveReview(null);
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
            title: 'Does not comply',
            variant: 'danger'
        }
    }

    return (
        <div className="mt-3">
            {
                (reviews.sort((a, b) => b.milestone.localeCompare(a.milestone)).map(review => (
                    <Card className="shadow-sm border-0 rounded-4 mb-1" key={review.review_id}>
                        <Card.Body className="p-2">
                            <Row className="g-3">
                                <Col md={2}>
                                    <Badge type="milestone_light" text={`${review.milestone} Day`} />
                                </Col>

                                <Col md={10}>
                                    <Row>
                                        <Col md={12}>
                                            <ProgressBar variant={reviewStatusMapping[review.review_status as ReviewStatusType].variant} max={75} now={review.total_score} className="w-100"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md={9}>

                                            <Accordion className="review-details-accordion p-0"
                                                activeKey={activeReview}
                                                onSelect={(eventKey) => {
                                                    setActiveReview(eventKey);
                                                }}
                                            >
                                                <Accordion.Item eventKey={review.review_id} className="mx-0 mt-3">
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
                                                        <PreviousReviewDetails prompts={review.prompts ?? []}/>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                            <div className="my-2">
                                                <small>
                                                    <span className="fw-semibold">Overall Feedback: </span>
                                                    {review.final_feedback}
                                                </small>
                                            </div>

                                        </Col>
                                        <Col md={3}>
                                            <div className="d-flex flex-column align-items-end mt-3">
                                                <p className="total-score mb-0">Total Score: {review.total_score} / 75</p>
                                                <p className={`review-status mb-0`}>
                                                    {/* Status:  */}
                                                    <span className={review.review_status}>{reviewStatusMapping[review.review_status as ReviewStatusType].title}</span>
                                                </p>
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