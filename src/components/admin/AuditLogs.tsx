import { Card, Col, Row } from "react-bootstrap";
import Badge from "../common/Badge";

export default function AuditLogs() {

    return (
        <div className="p-4">
            <h4>Application Audit Log</h4>
            <small className="text-muted">Track all updates and changes to the application</small>
            <div className="audit-log-container d-flex flex-column gap-3">
                <Card className="audit-log-card border-0 shadow-sm rounded-4 p-3">
                    <Card.Body className="p-0">
                        <Row className="g-3">
                            <Col xs="auto">
                                <Badge type="review" />
                            </Col>

                            <Col>
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="mb-0">Version system.1773092537</h5>
                                    <small className="text-muted">Mar 9, 2026</small>
                                </div>

                                <div className="mt-2">
                                    <p className="mb-1">Performance review submitted for Lon Roman</p>
                                    <p className="mb-1">Reviewer: Christopher Ross</p>
                                    <p className="mb-1">Milestone: 60_day</p>
                                    <p className="mb-1">Category: complies</p>
                                    <p className="mb-2">Total Score: 72</p>
                                    <small className="text-muted">Logged: Mar 9, 2026 at 5:42 PM</small>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="audit-log-card border-0 shadow-sm rounded-4 p-3">
                    <Card.Body className="p-0">
                        <Row className="g-3">
                            <Col xs="auto">
                                <Badge type="login" />
                            </Col>

                            <Col>
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="mb-0">Version system.1773092537</h5>
                                    <small className="text-muted">Mar 9, 2026</small>
                                </div>

                                <div className="mt-2">
                                    <p className="mb-1">Performance review submitted for Lon Roman</p>
                                    <p className="mb-1">Reviewer: Christopher Ross</p>
                                    <p className="mb-1">Milestone: 60_day</p>
                                    <p className="mb-1">Category: complies</p>
                                    <p className="mb-2">Total Score: 72</p>
                                    <small className="text-muted">Logged: Mar 9, 2026 at 5:42 PM</small>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                                <Card className="audit-log-card border-0 shadow-sm rounded-4 p-3">
                    <Card.Body className="p-0">
                        <Row className="g-3">
                            <Col xs="auto">
                                <Badge type="comment" />
                            </Col>

                            <Col>
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="mb-0">Version system.1773092537</h5>
                                    <small className="text-muted">Mar 9, 2026</small>
                                </div>

                                <div className="mt-2">
                                    <p className="mb-1">Performance review submitted for Lon Roman</p>
                                    <p className="mb-1">Reviewer: Christopher Ross</p>
                                    <p className="mb-1">Milestone: 60_day</p>
                                    <p className="mb-1">Category: complies</p>
                                    <p className="mb-2">Total Score: 72</p>
                                    <small className="text-muted">Logged: Mar 9, 2026 at 5:42 PM</small>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                                <Card className="audit-log-card border-0 shadow-sm rounded-4 p-3">
                    <Card.Body className="p-0">
                        <Row className="g-3">
                            <Col xs="auto">
                                <Badge type="login" />
                            </Col>

                            <Col>
                                <div className="d-flex justify-content-between align-items-start">
                                    <h5 className="mb-0">Version system.1773092537</h5>
                                    <small className="text-muted">Mar 9, 2026</small>
                                </div>

                                <div className="mt-2">
                                    <p className="mb-1">Performance review submitted for Lon Roman</p>
                                    <p className="mb-1">Reviewer: Christopher Ross</p>
                                    <p className="mb-1">Milestone: 60_day</p>
                                    <p className="mb-1">Category: complies</p>
                                    <p className="mb-2">Total Score: 72</p>
                                    <small className="text-muted">Logged: Mar 9, 2026 at 5:42 PM</small>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>

        </div>
    )
}