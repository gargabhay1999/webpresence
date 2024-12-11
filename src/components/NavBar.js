import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
    Button
} from "@aws-amplify/ui-react";


const NavBar = ({ isAuthenticated, onSignOut }) => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            src="logo-small.png"
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                            alt="Webpresence Logo"
                        />

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {isAuthenticated && <Nav variant="underline" defaultActiveKey="/dashboard" className="me-auto">
                            <Nav.Link href="dashboard" className="underline-on-active">Dashboard</Nav.Link>
                        </Nav>}
                        <Nav className='ms-auto'>
                            {isAuthenticated && <NavDropdown title={"User"} id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="profile" className="underline-on-active">Profile</NavDropdown.Item>
                            </NavDropdown>}
                            {!isAuthenticated && <Nav.Link href="signin" className="underline-on-active">Sign In</Nav.Link>}
                            {isAuthenticated && <Button onClick={onSignOut}>Sign Out</Button>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    )
};
export default NavBar;