import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {
    Button,
    withAuthenticator,
} from "@aws-amplify/ui-react";


const NavBar = ({ signOut }) => {
    return (
        <>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">
                        <img
                            src="logo192.png"
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                            alt="Webpresence Logo"
                        />

                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav variant="underline" defaultActiveKey="/home" className="me-auto">
                            <Nav.Link href="dashboard" className="underline-on-active">Dashboard</Nav.Link>
                        </Nav><Nav>
                            <NavDropdown title={"User"} id="collapsible-nav-dropdown">
                                <NavDropdown.Item href="#" className="underline-on-active">Profile</NavDropdown.Item>
                            </NavDropdown>
                            <Button onClick={signOut}>Sign Out</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </>
    )
};
export default withAuthenticator(NavBar);