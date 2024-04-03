import './App.css';
import Table from './Table';
import { useState, useEffect } from 'react';
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';

function App() {
  const [validQuery, setValidQuery] = useState(false);
  const [regionQuery, setRegionQuery] = useState('0');
  const [region, setRegion] = useState([
    { navn: 'Kristiansund', kode: '32' },
    { navn: 'Trondheim', kode: '50' },
    { navn: 'Møre Og Romsdal', kode: '5050' },
    { navn: 'Kaqwe', kode: '322' },
    { navn: 'sdfzxc', kode: '56' },
    { navn: 'eeee', kode: '28' },
    { navn: 'keeaa', kode: '37' },
    { navn: 'Oppdøl', kode: '52' },
    { navn: 'Møre', kode: '505023' },
    { navn: 'Kristiazxcnsund', kode: '3cv2' },
    { navn: 'Trondwheim', kode: '5a0' },
    { navn: 'Møre Ogxca Romsdal', kode: '505ew0' },
    { navn: 'Karsdqwe', kode: '3x22' },
    { navn: 'sdfazxc', kode: '5w6' },
    { navn: 'edfeee', kode: '28xc' },
    { navn: 'keeaasda', kode: '3we7' },
    { navn: 'Oppxcdøl', kode: '52df' },
    { navn: 'Mørsde', kode: '50502we3' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const [selected, setSelected] = useState({
    variabel: [{}],
    year: [{}],
    region: [{}],
  });

  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='20' height='15' viewBox='0 0 50 50'>
          <path d='M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z'></path>
        </svg>
      </components.DropdownIndicator>
    );
  };

  const handleSelect = (event: any, type: string) => {
    setSelected((prev) => ({ ...prev, [type]: event }));
  };

  const yearOptions = Array.from({ length: 18 }, (_, index) => {
    const year = 2007 + index;
    return { value: year.toString(), label: year.toString() };
  });

  const regionOptions = () => {
    const filteredOptions = region.filter((e) => e.navn.toLowerCase().trim().includes(searchTerm));
    const regionOptions = filteredOptions.map((e) => ({ value: e.kode, label: e.navn }));
    return regionOptions;
  };

  const variabelOptions = () => {
    return [
      { value: 'Folkemengde', label: 'Befolkning per 1.1. (personer)' },
      { value: 'ArealKm2', label: 'Areal (km²)' },
      { value: 'LandArealKm2', label: 'Landareal (km²)' },
      { value: 'FolkeLandArealKm2', label: 'Innbyggere per km² landareal' },
    ];
  };

  // useEffect(() => {
  //   region.forEach((e: any) => {
  //     console.log(e.kode);
  //   });
  // }, [region]);

  // const getRegion = async (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   if (event.target.value === '0') {
  //     return;
  //   } else {
  //     const query = event.target.value;
  //     const response = await fetch(`http://localhost:5173/api/${query}`);
  //     const data = await response.json();
  //     setRegion(data);
  //   }
  // };

  // dummyRegion
  const getRegion = async (event: any) => {
    if (event.target.value === '0') {
      return;
    } else {
      const index = event.nativeEvent.target.selectedIndex;
      setRegionQuery(event.nativeEvent.target[index].text.toLowerCase());
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const selectedOptions = selected;

    if (selectedOptions.year.length < 3) {
      console.log('error from year');
    }

    if (selectedOptions.region.length < 2) {
      event.stopPropagation();
    }

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedOptions),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      } else if (response.ok) {
        setValidQuery(true);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <h1>Statistikk Portal</h1>
      <div className='container text-center'>
        <form onSubmit={handleSubmit} needs-validation>
          <div className='row row-cols-3'>
            <div className='col statistikk-col'>
              <h2>Statistikk (Påkrevd*)</h2>
              <Select
                name='variabel'
                value={selected.variabel.filter((e) => Object.keys(e).length !== 0)}
                options={variabelOptions()}
                onChange={(e) => handleSelect(e, 'variabel')}
                isMulti
                menuIsOpen
                maxMenuHeight={250}
                placeholder='Søk etter variabel..'
                hideSelectedOptions={false}
                components={{ DropdownIndicator }}
                styles={{
                  valueContainer: (baseStyles) => ({
                    ...baseStyles,
                    maxHeight: '3rem',
                    overflow: 'auto',
                  }),
                }}
                required
              />
            </div>
            <div className='col' id='year-col'>
              <h2>Årstall (Påkrevd*)</h2>
              <div className='dropdown'>
                <Select
                  name='year'
                  value={selected.year.filter((e) => Object.keys(e).length !== 0)}
                  options={yearOptions}
                  onChange={(e) => handleSelect(e, 'year')}
                  isMulti
                  menuIsOpen
                  maxMenuHeight={250}
                  placeholder='Søk etter årstall..'
                  hideSelectedOptions={false}
                  components={{ DropdownIndicator }}
                  styles={{
                    valueContainer: (baseStyles) => ({
                      ...baseStyles,
                      maxHeight: '3rem',
                      overflow: 'auto',
                    }),
                  }}
                  required
                />
              </div>
            </div>
            <div className='col region-col'>
              <h2>Region (Påkrevd*)</h2>
              <select id='region' className=' mb-2 form-select' aria-label='Default select example' onChange={getRegion}>
                <option className='text-center' value='0'>
                  -- Velg inndeling --
                </option>
                <option value='alle'>Hele Landet</option>
                <option value='fylker'>Fylker</option>
                <option value='kommuner'>Kommuner</option>
              </select>
              {region.length > 0 && (
                <div className='velg-region'>
                  <div>
                    <div className='dropdown'>
                      <Select
                        name='region'
                        value={selected.region.filter((e) => Object.keys(e).length !== 0)}
                        placeholder={`Søk i ${regionQuery}..`}
                        options={regionOptions()}
                        onChange={(e) => handleSelect(e, 'region')}
                        isMulti
                        menuIsOpen
                        maxMenuHeight={250}
                        hideSelectedOptions={false}
                        components={{ DropdownIndicator }}
                        styles={{
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            maxHeight: '3rem',
                            overflow: 'auto',
                          }),
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 offset-3'>
              <button className='btn btn-primary p-3'>Hent data</button>
            </div>
          </div>
        </form>
      </div>
      {validQuery && <Table />}
    </>
  );
}
export default App;
