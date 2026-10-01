import { Container, Navbar } from "react-bootstrap";
import ditechLogo from "./../../assets/images/ditech-logo.png";
import Badge from "../common/Badge";

import { useToast } from "../../context/ToastContext";

import useAuth from "../../hooks/useAuth";
import type { UserRole } from "../../types/User";
import capitalizeString from "../../utils/capilatize-string";

interface HeaderProps {
    userRole: UserRole;
}

export default function Header({userRole}: HeaderProps) {
    const titles = {
        admin: 'Admin',
        frontline: 'Frontline',
        supervisor: 'Supervisor'
    }

    const {signOut} = useAuth();
    const {showToast} = useToast();

    const handleLogout = async () => {
        await signOut();
        showToast('Logout Successful', ['Signed Out'], 'success');
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
                            <h5 className="mb-0 fw-bold">{titles[userRole]} Console</h5>
                            <small className="text-muted">Ditech, Inc.</small>
                        </div>
                        <div className="d-flex align-items-center mx-3">
                            <Badge type={userRole} text={capitalizeString(userRole)}></Badge>
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