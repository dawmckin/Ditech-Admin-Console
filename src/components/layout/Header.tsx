import { Badge, Container, Navbar } from "react-bootstrap";
import ditechLogo from "./../../assets/images/ditech-logo.png";

import { useToast } from "../../context/ToastContext";

import useAuth from "../../hooks/useAuth";
import type { UserRole } from "../../types/User";

interface HeaderProps {
    userRole: UserRole;
}

export default function Header({userRole}: HeaderProps) {
    const badgeText = {
        admin: {text: 'Admin', variant: 'info'},
        supervisor: {text: 'Supervisor', variant: 'primary'},
        frontline: {text: 'Frontline', variant: 'success'},
    }
    const {signOut} = useAuth();
    const {showToast} = useToast();

    const handleLogout = async () => {
        await signOut();
        showToast('Logout Successful', [''], 'success');
    }

    return (
        <Navbar 
            bg="white"
            className="border-bottom shadow-small py-3"
        >
            <Container
                fluid="xxl"
                className="mx-0"
            >
                <div className="d-flex align-items-center">
                    <img 
                        src={ditechLogo}
                        alt="DITECH"
                        width={40}
                        height={50}
                        className=""
                    />

                    <div className="d-flex">
                        <div className="d-flex flex-column px-2">
                            <h5 className="mb-0 fw-bold">Admin Console</h5>
                            <small className="text-muted">System Management</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <Badge bg={badgeText[userRole]?.variant} pill>{`${badgeText[userRole]?.text}`}</Badge>
                        </div>
                    </div>
                </div>

                <button 
                    className="btn btn-link text-dark text-decoration-none fw-semibold"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </Container>
        </Navbar>
    )
}