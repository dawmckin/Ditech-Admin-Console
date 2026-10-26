import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Form } from "react-bootstrap";
import ditechLogo from "./../../assets/images/ditech-logo.png";

import useAuth from "../../hooks/useAuth";
import { useToast } from "../../context/ToastContext";

import "./Login.css";

export default function Login() {
    document.title = "Ditech Review Console";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { signIn, resetPassword, loading } = useAuth();
    const { showToast } = useToast();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (email === "" || password === "") {
            showToast(
                "Missing Login Credentials",
                ["Please enter email and password"],
                "warning"
            );
            return;
        }

        try {
            const authenticatedUser = await signIn(email, password);

            showToast(
                "Login Successful",
                [`Welcome, ${authenticatedUser.first_name} ${authenticatedUser.last_name}`],
                "success"
            );

            switch (authenticatedUser.user_role) {
                case "admin":
                    navigate("/admin", { replace: true });
                    break;

                case "supervisor":
                    navigate("/supervisor", { replace: true });
                    break;

                case "frontline":
                    navigate("/frontline", { replace: true });
                    break;

                default:
                    navigate("/unauthorized", { replace: true });
            }
        } catch (err) {
            console.error("Login failed:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to sign in";

            showToast(
                "Login Error",
                [message],
                "danger"
            );
        }
    };

    const handleForgotPassword = async () => {
        if (email.trim() === "") {
            showToast(
                "Email Required",
                ["Please enter your email first"],
                "warning"
            );
            return;
        }

        try {
            await resetPassword(email.trim());

            showToast(
                "Password Reset Email Sent",
                ["If an account exists for this email address, you will receive instructions to reset your password"],
                "success"
            );
        } catch (err) {
            console.error(
                "Password reset failed:",
                err
            );

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to send password reset email";

            showToast(
                "Password Reset Error",
                [message],
                "danger"
            );
        }
    };

    return (
        <div className="login-page">
            <Card className="login-card border-0 shadow-sm rounded-4">
                <Card.Body className="login-card-body">

                    {/* Logo / Title */}
                    <div className="login-brand">
                        <img
                            src={ditechLogo}
                            alt="DITECH"
                            className="login-logo"
                        />

                        <h2 className="login-title mb-0">Ditech Review Console</h2>
                    </div>

                    <hr />

                    {/* Welcome */}
                    <div className="text-center login-welcome">
                        <h3 className="mb-2">Welcome Back</h3>

                        <p className="text-muted mb-0">Sign in</p>
                    </div>

                    {/* Login Form */}
                    <Form onSubmit={handleLogin}>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                <small>Email</small>

                                {email === "" && (
                                    <span className="text-danger">
                                        {" "}*
                                    </span>
                                )}
                            </Form.Label>

                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                className="login-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">
                                <small>Password</small>

                                {password === "" && (
                                    <span className="text-danger">
                                        {" "}*
                                    </span>
                                )}
                            </Form.Label>

                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                className="login-input"
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
                            className="w-100 login-button"
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