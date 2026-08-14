import { useEffect, useState, type ChangeEvent } from "react";
import { Card, Form, Row, Col, Button, Alert, Accordion } from "react-bootstrap";
import type { UserRole } from "../../types/User";
import { useSelectUsers } from "../../hooks/useSelectUsers";

export interface ImpersonationForm {
    user_role: UserRole,
    user_id: string
    user_name: string
}

interface ImpersonationCardProps {
    onUserSelection: (impersonationFormData: ImpersonationForm) => void
}

export default function ImpersonationCard({onUserSelection}: ImpersonationCardProps) {
    const [impersonationForm, setImpersonationForm] = useState<ImpersonationForm>(
        {
            user_role: 'admin',
            user_id: '',
            user_name: ''
        }
    );
    const [isOpen, setIsOpen] = useState(false);
    
    const {usersData} = useSelectUsers();

    useEffect(() => {
        onUserSelection(impersonationForm)
    }, [impersonationForm?.user_id, onUserSelection]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        let userName = '';

        if(name === 'user_id') {
            const user = usersData.find(user => user.user_id === value);
            userName = `${user?.first_name} ${user?.last_name}`;
        }

        setImpersonationForm(prev => ({
            ...prev,
            user_id: (name === 'user_role') ? "" : value,
            user_name: (name === 'user_id') ? userName : "",
            [name]: value
        }));

        if(name === 'user') {
            onUserSelection(impersonationForm)
        }

        console.log(impersonationForm);
    };

    const handleClear = () => {
        setImpersonationForm({
            user_role: 'admin',
            user_id: "",
            user_name: ''
        });
    };
    
    return (
        <Accordion className="mb-4">
            <Accordion.Item eventKey="0">
                <Accordion.Header onClick={() => setIsOpen(prev => !prev)}>
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex align-items-center">
                            <div className="icon-circle me-2" style={{borderColor: isOpen ? '#ffffff' : '#cfe2ff'}}>
                                <i className="bi bi-person fs-3"></i>
                            </div>

                            <h5 className="mb-0 fw-semibold">
                                Admin Impersonation
                            </h5>
                        </div>
                        {
                            (!isOpen && (impersonationForm.user_role && impersonationForm.user_id)) && 
                            <Alert
                                variant="primary"
                                className="mb-0 p-2 me-3"
                            >
                                <strong>Viewing as:</strong>{" "}
                                {`${impersonationForm.user_name} (${impersonationForm.user_role})`}
                            </Alert>
                        }
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <Card className="shadow-sm border-0 rounded-4 mb-4">
                        <Card.Body className="p-4">
                            {/* <div className="d-flex align-items-center mb-4">
                                <i className="bi bi-person me-2"></i>
                                <h5 className="mb-0 fw-semibold">
                                    View As (Admin Impersonation)
                                </h5>
                            </div> */}

                            <Row className="g-3">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="fw-semibold">
                                            User Type
                                        </Form.Label>
                                        <Form.Select 
                                            name="user_role"
                                            value={impersonationForm.user_role}
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option value='admin' hidden>Select user type...</option>
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
                                            name="user_id"
                                            value={impersonationForm.user_id}
                                            onChange={(e) => handleChange(e)}
                                            disabled={impersonationForm.user_role === 'admin'}
                                        >
                                            <option value='' hidden>Select user</option>
                                            {
                                                usersData.filter(user => user.user_role === impersonationForm.user_role)
                                                    .map(user => (
                                                        <option value={user.user_id}>
                                                            {`${user.first_name} ${user.last_name}`}
                                                        </option>
                                                    )
                                                )
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={4} className="d-flex align-items-end">
                                    <Button 
                                        className="w-100 border"
                                        variant="light"
                                        onClick={handleClear}
                                        disabled={impersonationForm.user_role === 'admin'}
                                    >
                                        Clear Selection
                                    </Button>
                                </Col>
                            </Row>
                            {
                                (impersonationForm.user_role && impersonationForm.user_id) && 
                                <Alert 
                                    variant="primary"
                                    className="mb-0 mt-2 p-2"
                                >
                                    <strong>Viewing as:</strong> {`${impersonationForm.user_name} (${impersonationForm.user_role})`}
                                </Alert>
                            }
                        </Card.Body>
                    </Card>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}