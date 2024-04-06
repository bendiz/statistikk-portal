import { BiMath } from 'react-icons/bi';

export default function Navbar(props: any) {
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary mb-3'>
      <div className='container-fluid'>
        <span className='navbar-brand d-flex'>
          <BiMath />
        </span>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <a className='nav-link active' aria-current='page' onClick={props.changeQuery}>
                Ny spørring
              </a>
            </li>
            <li className='nav-item'>
              <a className='nav-link active' aria-current='page' onClick={props.grafVisning}>
                {props.grafVisningOn ? 'Tabellvisning' : 'Grafvisning'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
