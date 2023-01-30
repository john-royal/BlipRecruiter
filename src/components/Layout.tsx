import { PropsWithChildren } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-3">
        <Container>
          <Navbar.Brand href="/">FlipRecruiter</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/applications">Applications</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {children}
    </>
  );
}
