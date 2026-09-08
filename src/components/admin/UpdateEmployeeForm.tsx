import { useEffect, useState, type ChangeEvent } from "react";

import { Row, Col, Form, Button, OverlayTrigger } from "react-bootstrap";

import type { UpdateEmployeeData } from "../../services/userService";
import formatPhoneNumber from "../../utils/format-phone";
import type { User } from "../../types/User";
import Popover from "../common/Popover";
import { useToast } from "../../context/ToastContext";

interface UpdateEmployeeFormProps {
    user: User | null;
    supervisors: User[];
    loading: boolean;
    onSubmit: (employee: UpdateEmployeeData) => Promise<void>;
    onCancel: () => void;
}

export default function UpdateEmployeeForm({user, supervisors, loading, onSubmit, onCancel}: UpdateEmployeeFormProps) {
    const [employeeForm, setEmployeeForm] = useState<UpdateEmployeeData>({
        user_id: "",
        email: "",
        phone: "",
        first_name: "",
        last_name: "",
        user_role: null,
        supervisor_id: null,
        start_date: null,
        is_active: true,
    });
    const [validated, setValidated] = useState(false);
    const [helpIcon, setHelpIcon] = useState('bi-question-circle-fill');

    const {showToast} = useToast();

    const today = new Date;

    useEffect(() => {
        if(!user) {
            return;
        }
        setEmployeeForm({
            user_id: user?.user_id,
            email: user?.email ?? '',
            phone: user?.phone ?? '',
            first_name: user?.first_name ?? '',
            last_name: user?.last_name ?? '',
            user_role: user?.user_role ?? null,
            supervisor_id: user?.supervisor_id ?? null,
            start_date: user?.start_date ?? null,
            is_active: user?.is_active ?? true
        });
    }, [user]);

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

        if(!form.checkValidity()) {
            e.stopPropagation();
            setValidated(true);
            // console.log('Form Invalid!');
            return;
        }

        if(employeeForm.email === user?.email &&
            employeeForm.phone === user?.phone &&
            employeeForm.first_name === user?.first_name &&
            employeeForm.last_name === user?.last_name &&
            employeeForm.user_role === user?.user_role && 
            employeeForm.supervisor_id === user?.supervisor_id && 
            employeeForm.start_date === user.start_date
        ) {
            showToast('No changes', ['Make changes to update employee'], 'danger');
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
                <h5>Edit Employee</h5>

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
                                <span className="text-danger"> *</span>
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
                        className={(employeeForm.first_name && employeeForm.first_name !== user?.first_name) ? 'edited' : ''}
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
                                <span className="text-danger"> *</span>
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
                        className={(employeeForm.last_name && employeeForm.last_name !== user?.last_name) ? 'edited' : ''}

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
                                <span className="text-danger"> *</span>
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
                        className={(employeeForm.email && employeeForm.email !== user?.email) ? 'edited' : ''}

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
                                <span className="text-danger"> *</span>
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
                        className={(employeeForm.phone && employeeForm.phone !== user?.phone) ? 'edited' : ''}

                    /> 
                    <Form.Control.Feedback type="invalid">
                        {employeeForm.phone.length > 0 ? 'Please enter valid phone number.' : 'Please enter phone number.'}
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
                                <span className="text-danger"> *</span>
                            }  
                        </small>
                    </Form.Label>                    
                    <Form.Select 
                        required
                        name="user_role"
                        value={employeeForm.user_role ?? ""}
                        onChange={handleChange}
                        className={(employeeForm.user_role && employeeForm.user_role !== user?.user_role) ? 'edited' : ''}

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
                                    <span className="text-danger"> *</span>
                                }
                            </small>
                        </Form.Label>                        
                        <Form.Select 
                            required
                            isValid={validated && (employeeForm.user_role !== 'frontline' || employeeForm.supervisor_id !== null)}
                            name="supervisor_id"
                            value={employeeForm.supervisor_id ?? ""}
                            onChange={handleChange}
                            className={(employeeForm.supervisor_id && employeeForm.supervisor_id !== user?.supervisor_id) ? 'edited' : ''}
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
                                <span className="text-danger"> *</span>
                            } 
                            <OverlayTrigger
                                trigger={['hover', 'focus']}
                                placement="right"
                                onToggle={(nextShow) => {
                                    setHelpIcon(nextShow ? 
                                        'bi-question-circle' : 
                                        'bi-question-circle-fill'
                                    );
                                }}
                                overlay={
                                    <Popover
                                        body_text="Start Date cannnot be changed after employee's 15 day review"
                                    />
                                }
                            >
                                <i className={`bi ${helpIcon} mx-1`}></i>
                            </OverlayTrigger>
                        </small>
                    </Form.Label>                    
                    <Form.Control 
                        required
                        type="date" 
                        name="start_date"
                        value={employeeForm.start_date?.split('T')[0] ?? ""} 
                        onChange={handleChange}
                        disabled={employeeForm.start_date ? new Date(employeeForm.start_date) <= today : false}
                        className={(employeeForm.start_date && employeeForm.start_date !== user?.start_date) ? 'edited' : ''}
                    />
                    <Form.Control.Feedback type="invalid">
                        Please select start date.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            
            <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Employee"}
                </Button>
            </div>

        </Form>
    );
}