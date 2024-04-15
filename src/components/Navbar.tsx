import { BiMath } from 'react-icons/bi';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { scrollToTop } from '../utilities/utils';

export default function NavigationBar(props: any) {
  return (
    <Navbar className='fixed-top z-1' expand='lg' variant='dark'>
      <Container>
        <Navbar.Brand>
          <a href={window.location.pathname} className='text-white d-flex' title='Gå Tilbake'>
            <BiMath />
          </a>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link href={window.location.pathname} title='Hent ny tabell'>
              Ny spørring
            </Nav.Link>
            <Nav.Link
              title={props.grafVisningOn ? 'Vis tabell' : 'Vis statistikkgrafer'}
              onClick={() => {
                props.grafVisning();
                scrollToTop();
              }}>
              {props.grafVisningOn ? 'Tabellvisning' : 'Grafvisning'}
            </Nav.Link>
            <NavDropdown title='Statistikkgrafer' id='basic-nav-dropdown' onClick={props.handleFirstClick}>
              <NavDropdown.Item title='Gå til mediangraf' onClick={() => scrollToTop()}>
                Median
              </NavDropdown.Item>
              <NavDropdown.Item title='Gå til gjennomsnittsgraf' onClick={() => props.refs.scrollToRef(props.refs.avgRef)}>
                Gjennomsnitt
              </NavDropdown.Item>
              <NavDropdown.Item title='Gå til minimumgraf' onClick={() => props.refs.scrollToRef(props.refs.minRef)}>
                Minimum
              </NavDropdown.Item>
              <NavDropdown.Item title='Gå til maksimumgraf' onClick={() => props.refs.scrollToRef(props.refs.maxRef)}>
                Maksimum
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
