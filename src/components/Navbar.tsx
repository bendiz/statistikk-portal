import { BiMath } from 'react-icons/bi';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { scrollToTop } from '../utilities/utils';
import { useEffect, useState } from 'react';

export default function NavigationBar(props: any) {
  return (
    <Navbar className='fixed-top' expand='lg' bg='light' variant='light'>
      <Container>
        <Navbar.Brand>
          <BiMath />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link onClick={props.changeQuery}>Ny spørring</Nav.Link>
            <Nav.Link
              onClick={() => {
                props.grafVisning();
                scrollToTop();
              }}>
              {props.grafVisningOn ? 'Tabellvisning' : 'Grafvisning'}
            </Nav.Link>
            <NavDropdown title='Statistikkgrafer' id='basic-nav-dropdown' onClick={props.handleFirstClick}>
              <NavDropdown.Item onClick={() => props.refs.scrollToRef(props.refs.medianRef)}>Median</NavDropdown.Item>
              <NavDropdown.Item onClick={() => props.refs.scrollToRef(props.refs.avgRef)}>Gjennomsnitt</NavDropdown.Item>
              <NavDropdown.Item onClick={() => props.refs.scrollToRef(props.refs.minRef)}>Minimum</NavDropdown.Item>
              <NavDropdown.Item onClick={() => props.refs.scrollToRef(props.refs.maxRef)}>Maksimum</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
