import { Accordion, Card, Col, ProgressBar, Row } from "react-bootstrap";
import Badge from "../common/Badge";
import type { Review } from "../../types/Review";

type ReviewStatusType =
    | 'complies'
    | 'needs_improving'
    | 'does_not_comply'

interface ReviewStatusProps {
    title: string;
    variant: string;
}

interface PreviousUserReviewProps {
    reviews: Review[];
}

export default function PreviousUserReview({reviews}: PreviousUserReviewProps) {
    console.log(reviews);
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

    // const {reviewsData} = useSelectReviews(user_id);
    // console.log(reviewsData);

    return (
        <div className="mt-3">
            {
                (reviews.map(review => (
                    <Card className="shadow-sm border-0 rounded-4">
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
                                            <Accordion className="review-details-accordion p-0">
                                                <Accordion.Item eventKey="0" className="mx-0 my-3">
                                                    <Accordion.Header>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div className="d-flex mx-2">
                                                                <i className="bi bi-clipboard2-data"></i>
                                                                
                                                                <div className="my-auto mx-2">
                                                                    <h6 className="mb-0">Review Details</h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>

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