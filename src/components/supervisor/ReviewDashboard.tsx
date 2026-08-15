import { Accordion, Button, Card, Col, ProgressBar, Row  } from "react-bootstrap";
import Badge from "../common/Badge";

import { useSelectUsers } from "../../hooks/useSelectUsers";

export default function ReviewDashboard() {
    const {usersData} = useSelectUsers('pendingReview');
    console.log(usersData);

    const renderPendingReviews = () => {
        return (
            <div className="review-dashboard-container d-flex flex-column gap-2">
                {
                    usersData.map(user => (
                        <Accordion className="review-details-accordion p-0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <div className="d-flex justify-content-between align-items-center w-100">
                                        <div className="d-flex align-items-center mx-2">
                                            <div className="icon-circle me-2" >
                                                {/* <i className="bi bi-person fs-3"></i> */}
                                            </div>
                                            
                                            <div className="d-flex align-items-center mx-2">
                                                <h5 className="mb-0 fw-semibold w-100">{`${user.first_name} ${user.last_name}`}</h5>
                                                <div className="mx-3">
                                                    <Badge type="milestone" text={`${user.current_milestone} Day`} />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <Button 
                                            className="border text-white mx-2"
                                            variant="primary"
                                            // onClick={}
                                            // disabled={}
                                        >
                                            New Review
                                        </Button> */}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Card className="shadow-sm border-0 rounded-4 mb-4">
                                        <Card.Body className="p-2">
                                            <Row className="g-3">
                                                <Col md={2}>
                                                    <Badge type="milestone_light" text="45 Day" />
                                                </Col>

                                                <Col md={10}>
                                                    <Row>
                                                        <Col md={12}>
                                                            <ProgressBar variant="success" max={75} now={70} className="w-100"/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={9}>
                                                            <Accordion className="review-details-accordion p-0">
                                                                <Accordion.Item eventKey="0" className="mx-0 my-3">
                                                                    <Accordion.Header>
                                                                        <div className="d-flex justify-content-between align-items-center">
                                                                            <div className="d-flex mx-2">
                                                                                <i className="bi bi-clipboard2-data fs-2"></i>
                                                                                
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
                                                                <p className="total-score mb-0">Total Score: 70 / 75</p>
                                                                <p className={`review-status mb-0`}>
                                                                    {/* Status:  */}
                                                                    <span className='complies'> Complies</span>
                                                                </p>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    {/* <div className="d-flex flex-column align-items-end mt-2">
                                                        <p className="total-score mb-0">Total Score: 70 / 75</p>
                                                        <p className={`review-status mb-0`}>
                                                            Status: 
                                                            <span className='complies'> Complies</span>
                                                        </p>
                                                    </div> */}

                                                </Col>

                                                {/* <Col md={3} className="d-flex flex-column align-items-end">

                                                </Col> */}
                                            </Row>
                                        </Card.Body>
                                    </Card>
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