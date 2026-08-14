import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

import ditechLogo from "./../../assets/images/ditech-logo.png";


export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const {resetPassword, loading} = useAuth();
    const {showToast} = useToast();

    const handleReset = async (e: FormEvent) => {
        e.preventDefault();

        if(!password || !confirmPassword) {
            showToast('Missing Password', ['Please enter and confirm new password'], 'warning');
            return;
        }

        if(password !== confirmPassword) {
            showToast('Passwords Not Identical', ['Please make sure both passwords match'], 'warning');
            return;
        }

        try {
            await resetPassword(password);

            showToast('Password Reset', ['Password has been reset successfully'], 'success');
            navigate("/login", {replace: true});        
        } catch (err) {
            console.error("Password update failed:", err);
            const message = (err instanceof Error) ? err.message : 'Unable to reset password';
            showToast('Password Reset Error', [message], 'danger');
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card
                className="border-0 shadow-sm rounded-4"
                style={{ width: "100%", maxWidth: "480px" }}
            >
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center">
                        <img 
                            src={ditechLogo}
                            alt="DITECH"
                            width={40}
                            height={50}
                            className="me-3"
                        />
                        <h2 className="mb-0">Ditech Review Console</h2>
                    </div>
                    <hr/>

                    <div className="d-flex justify-content-center">
                        <div className="row text-center">
                            <h3 className="mb-2">Reset Password</h3>
                            <p className="text-muted">Sign in</p>
                        </div>
                        
                    </div>

                    <Form onSubmit={handleReset}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                <small>Password</small>
                                {
                                    (password === '') &&
                                    <span className="required-input"> *</span>
                                }      
                            </Form.Label>

                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                disabled={loading}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                <small>Confirm Password</small>
                                {
                                    (confirmPassword === '') &&
                                    <span className="required-input"> *</span>
                                }      
                            </Form.Label>

                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                disabled={loading}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-100"
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );

}