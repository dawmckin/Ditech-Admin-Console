import { useState, type ChangeEvent } from "react";

import { Row, Col, Form, Button } from "react-bootstrap";

import type { CreateEmployeeData } from "../../services/userService";
import formatPhoneNumber from "../../utils/format-phone";
import type { User } from "../../types/User";

interface CreateEmployeeFormProps {
    supervisors: User[];
    loading: boolean;
    onSubmit: (employee: CreateEmployeeData) => Promise<void>;
    onCancel: () => void;
}

export default function CreateEmployeeForm({supervisors, loading, onSubmit, onCancel}: CreateEmployeeFormProps) {
    const [employeeForm, setEmployeeForm] = useState<CreateEmployeeData>({
        email: "",
        phone: "",
        password: "",
        first_name: "",
        last_name: "",
        user_role: null,
        supervisor_id: null,
        start_date: null,
        is_active: true,
    });
    const [validated, setValidated] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setEmployeeForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        e.preventDefault();

        console.log(form.checkValidity());

        if(!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            console.log('Form Invalid!');
            return;
        }

        setValidated(true);
        onSubmit(employeeForm);
    }

    return (
        <Form 
            noValidate
            validated={validated}
            onSubmit={(e) => handleSubmit(e)}
        >
            <hr />
            <div className="d-flex justify-content-between mb-2">
                <h5>Create Employee</h5>

                <Button variant="outline-danger" type="button" size="sm" onClick={onCancel}>
                    <i className="bi bi-x-lg"></i>
                </Button>
            </div>
            {/* <Row>
                <Form.Group as={Col} 
                    className="d-flex justify-content-end" 
                    id="is_active" 
                    md={{span: 2, offset: 10}}
                >
                    <Form.Check 
                        type="checkbox" 
                        label="Active"
                        checked={employeeForm.is_active}
                        onChange={(e) => {
                            setEmployeeForm(prev => ({
                                ...prev,
                                is_active: e.target.checked,
                            }));
                        }}

                    />
                </Form.Group>
            </Row> */}

            <Row className="mb-3">
                <Form.Group as={Col} controlId="first_name">
                    <Form.Label>
                        <small>
                            First Name
                            {
                                (employeeForm.first_name === '') &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="first_name"
                        value={employeeForm.first_name}
                        placeholder="Enter First Name"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter first name.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="last_name">
                    <Form.Label>
                        <small>
                            Last Name
                            {
                                (employeeForm.last_name === '') &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="last_name"
                        value={employeeForm.last_name}
                        placeholder="Enter Last Name"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter last name.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="email">
                    <Form.Label>
                        <small>
                            Email
                            {
                                (employeeForm.email === '') &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="email"
                        value={employeeForm.email}
                        placeholder="Enter Email"
                        onChange={handleChange}
                    />    
                    <Form.Control.Feedback type="invalid">
                        Please enter email.
                    </Form.Control.Feedback>                
                </Form.Group>                    
                <Form.Group as={Col} controlId="phone">
                    <Form.Label>
                        <small>
                            Phone #
                            {
                                (employeeForm.phone === '') &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>
                    <Form.Control
                        required
                        pattern="\(\d{3}\) \d{3}-\d{4}"
                        type="tel"
                        name="phone"
                        value={formatPhoneNumber(employeeForm.phone)}
                        placeholder="(XXX) XXX-XXXX"
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);

                            setEmployeeForm(prev => ({
                                ...prev,
                                phone: digitsOnly
                            }))
                        }}
                    /> 
                    <Form.Control.Feedback type="invalid">
                        {employeeForm.phone.length > 0 ? 'Please enter valid phone number.' : 'Please enter phone number.'}
                    </Form.Control.Feedback>               
                </Form.Group>
                <Form.Group as={Col} controlId="password">
                    <Form.Label>
                        <small>
                            Password
                            {
                                (employeeForm.password === '') &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>
                    <Form.Control
                        required
                        type="text"
                        name="password"
                        value={employeeForm.password}
                        placeholder="Enter Password"
                        onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please enter password.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} className="mb-3" controlId="user_role">
                    <Form.Label>
                        <small>
                            User Role
                            {
                                (employeeForm.user_role === null) &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>                    
                    <Form.Select 
                        required
                        name="user_role"
                        value={employeeForm.user_role ?? ""}
                        onChange={handleChange}
                    >
                        <option value='' hidden>Select User Role</option>
                        <option value="admin">Admin</option>
                        <option value="frontline">Frontline</option>
                        <option value="supervisor">Supervisor</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select user role.
                    </Form.Control.Feedback>
                </Form.Group>
                {
                    (employeeForm.user_role === 'frontline') &&  
                    <Form.Group as={Col} className="mb-3" controlId="supervisor_id">
                        <Form.Label>
                            <small>
                                Supervisor
                                {
                                    (employeeForm.supervisor_id === null) &&
                                    <span className="required-input"> *</span>
                                }
                            </small>
                        </Form.Label>                        
                        <Form.Select 
                            required
                            isValid={validated && (employeeForm.user_role !== 'frontline' || employeeForm.supervisor_id !== null)}
                            name="supervisor_id"
                            value={employeeForm.supervisor_id ?? ""}
                            onChange={handleChange}
                        >
                            <option value="" hidden>Select Supervisor</option>
                            {
                                supervisors.map(user => (
                                    <option value={user.user_id}>{`${user.first_name} ${user.last_name}`}</option>
                                ))
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Please select supervisor.
                        </Form.Control.Feedback>
                    </Form.Group>
                }

                <Form.Group as={Col} className="mb-3" controlId="start_date">
                    <Form.Label>
                        <small>
                            Start Date
                            {
                                (employeeForm.start_date === null) &&
                                <span className="required-input"> *</span>
                            }  
                        </small>
                    </Form.Label>                    
                    <Form.Control 
                        required
                        type="date" 
                        name="start_date"
                        value={employeeForm.start_date ?? ""} 
                        onChange={handleChange} 
                    />
                    <Form.Control.Feedback type="invalid">
                        Please select start date.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            
            <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Employee"}
                </Button>
            </div>

        </Form>
    );
}