import { useEffect, useState, type ChangeEvent } from "react";
import { Card, Form, Row, Col, Button, Alert } from "react-bootstrap";

export interface ImpersonationForm {
    userType: string,
    user: string
}

interface ImpersonationCardProps {
    onUserSelection: (impersonationFormData: ImpersonationForm) => void
}

export default function ImpersonationCard({onUserSelection}: ImpersonationCardProps) {
    const [impersonationForm, setImpersonationForm] = useState<ImpersonationForm>({
            userType: 'supervisor',
            user: 'Dalton McKinney'
        });

    useEffect(() => {
        onUserSelection(impersonationForm)
    }, [impersonationForm?.user, onUserSelection]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        setImpersonationForm(prev => ({
            ...prev,
            user: (name === 'userType') ? "" : value,
            [name]: value
        }));

        if(name === 'user') {
            onUserSelection(impersonationForm)
        }
    };

    const handleClear = () => {
        setImpersonationForm({
            userType: "",
            user: ""
        });
    };
    
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
                            <Form.Select 
                                name="userType"
                                value={impersonationForm.userType}
                                onChange={(e) => handleChange(e)}
                            >
                                <option value='' hidden>Select user type...</option>
                                <option value='frontline'>Frontline Employee</option>
                                <option value='supervisor'>Supervisor</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label className="fw-semibold">
                                Select User
                            </Form.Label>
                            <Form.Select 
                                name="user"
                                value={impersonationForm.user}
                                onChange={(e) => handleChange(e)}
                                disabled={impersonationForm.userType === ''}
                            >
                                <option value='' hidden>Select user</option>
                                <option value='Dalton McKinney'>Dalton McKinney</option>
                                <option value='Jhonny Test'>Jhonny Test</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={4} className="d-flex align-items-end">
                        <Button 
                            className="w-100 border"
                            variant="light"
                            onClick={handleClear}
                        >
                            Clear Selection
                        </Button>
                    </Col>
                </Row>
                {
                    (impersonationForm.userType && impersonationForm.user) && 
                    <Alert 
                        variant="primary"
                        className="mb-0 mt-2 p-2"
                    >
                        <strong>Viewing as:</strong> {`${impersonationForm.user} (${impersonationForm.userType})`}
                    </Alert>
                }
            </Card.Body>
        </Card>
    );
}