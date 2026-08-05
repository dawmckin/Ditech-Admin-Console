import { Badge, Container, Navbar } from "react-bootstrap";
import ditechLogo from "./../../assets/images/ditech-logo.png";

export default function Header() {

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
                        width={42}
                        height={42}
                        className="me-3"
                    />

                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <h3 className="mb-0 fw-bold">Admin Console</h3>
                            <Badge bg="primary" pill>Admin</Badge>
                        </div>
                        <small className="text-muted">System Management</small>
                    </div>
                </div>

                <button 
                    className="btn btn-link text-dark text-decoration-none fw-semibold"
                >
                    Logout
                </button>
            </Container>
        </Navbar>
    )
}