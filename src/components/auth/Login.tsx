import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Form } from "react-bootstrap";
import ditechLogo from "./../../assets/images/ditech-logo.png";

import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState('');
    const navigate = useNavigate();
    const {signIn, resetPassword, loading, error} = useAuth();
    const {showToast} = useToast();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        if(email === '' || password === '') {
            showToast('Missing Login Credentials', ['Please enter email and password'], 'warning');
        } else {
            try {
                const authenticatedUser = await signIn(
                    email,
                    password
                );
                    
                showToast('Login Successful', [`Welcome, ${authenticatedUser.first_name} ${authenticatedUser.last_name}`], 'success');
                console.log(authenticatedUser.user_role);
                switch (authenticatedUser.user_role) {
                    case "admin":
                        navigate("/admin", { replace: true });
                        break;

                    case "supervisor":
                        navigate("/supervisor", { replace: true });
                        break;

                    // case "frontline":
                    //     navigate("/dashboard", { replace: true });
                    //     break;

                    default:
                        navigate("/unauthorized", { replace: true });
                    
                }
            } catch (err) {
                // AuthContext has already populated `error`
                console.error("Login failed:", err);
                const message = (err instanceof Error) ? err.message : 'Unable to sign in';
                showToast('Login Error', [message], 'danger');
            }
        }
    }

    const handleForgotPassword = async () => {
        if(email.trim() === '') {
            showToast('Email Required', ['Please enter your email first'], 'warning');
            return;
        }

        try {
            await resetPassword(email.trim());

            showToast('Password Reset Email Sent', ['If an account exists for this email address, you will receive instructions to reset your password'], 'success');
        } catch(err) {
            console.error('Password reset failed: ', err);

            const message = (err instanceof Error) ? err.message : 'Unable to send password reset email';

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
                            <h3 className="mb-2">Welcome Back</h3>
                            <p className="text-muted">Sign in</p>
                        </div>
                        
                    </div>

                    {/* {error && (
                        <div className="text-danger mb-3">
                            {error}
                        </div>
                    )} */}

                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                <small>Email</small>
                                {
                                    (email === '') &&
                                    <span className="required-input"> *</span>
                                }      
                            </Form.Label>

                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />
                        </Form.Group>

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
                            />
                        </Form.Group>

                        <div className="text-end mb-3">
                            <Button
                                variant="link"
                                className="p-0 text-decoration-none"
                                type="button"
                                onClick={handleForgotPassword}
                            >
                                Forgot Password?
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-100"
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
