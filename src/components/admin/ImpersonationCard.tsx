import { Card, Form, Row, Col, Button } from "react-bootstrap";

export default function ImpersonationCard() {
    
    return (
        <Card className="shadow-sm border-0 rounded-4 mb-4">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center mb-4">
                    <i className="bi bi-person me-2"></i>
                    <h5 className="mb-0 fw-semibold">
                        View As (Admin Impersonation)
                    </h5>
                </div>

                <Row className="g-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="fw-semibold">
                                User Type
                            </Form.Label>
                            <Form.Select>
                                <option>Select user type...</option>
                                <option>Frontline Employee</option>
                                <option>Supervisor</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="fw-semibold">
                                Select User
                            </Form.Label>
                            <Form.Select disabled>
                                <option>Select type first</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4} className="d-flex align-items-end">
                        <Button 
                            className="w-100 border"
                            variant="light"
                        >
                            Clear Selection
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}