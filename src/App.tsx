import './App.css';
import Table from './Table';
import { useState } from 'react';
import Selections from './Selections';
import errorCheck from './utils';

function App() {
  const [validQuery, setValidQuery] = useState(false);
  const [regionQuery, setRegionQuery] = useState('');
  const [region, setRegion] = useState([]);
  const [error, setError] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState({
    variabel: [{}],
    year: [{}],
    region: [{}],
  });

  const handleSelect = (event: any, type: string) => {
    setSelected((prev) => ({ ...prev, [type]: event }));
  };

  const getRegion = async (event: any) => {
    setRegion([]);
    setRegionQuery('');
    if (event.target.value === '0') {
      return;
    } else {
      const query = event.target.value;
      const response = await fetch(`http://localhost:5173/api/${query}`);
      const data = await response.json();
      setRegion(data);
      setRegionQuery(query);
    }
  };

  // dummyRegion
  // const getRegion = async (event: any) => {
  //   if (event.target.value === '0') {
  //     return;
  //   } else {
  //     const index = event.nativeEvent.target.selectedIndex;
  //     console.log(index);
  //     setRegionQuery(event.nativeEvent.target[index].text.toLowerCase());
  //   }
  // };
  // const errorCheck = (selectedOptions) => {
  //   let errorFound = false;

  //   if (selectedOptions.variabel.length > 1) {
  //     console.log('over 1');
  //     setError((prev) => [...prev, 'variabel']);
  //     errorFound = true;
  //   }

  //   if (selectedOptions.region.length < 2) {
  //     setError((prev) => [...prev, 'region']);
  //     errorFound = true;
  //   }

  //   if (selectedOptions.year.length < 3) {
  //     setError((prev) => [...prev, 'year']);
  //     errorFound = true;
  //   }
  //   return errorFound;
  // };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    setValidQuery(false);

    const selectedOptions = selected;

    const errors = errorCheck(selectedOptions);

    if (errors[0]) {
      setError(errors[1]);
      return;
    } else {
      setError([]);
    }

    try {
      console.log('trying to fetch data..');
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
        <form onSubmit={handleSubmit}>
          <div className='row row-cols-3'>
            <div className='col statistikk-col'>
              <h2 className={error.includes('variabel') ? 'red' : ''}>Statistikk (Påkrevd*)</h2>
              {error.includes('variabel') && (
                <div className='alert alert-danger p-1 my-2' role='alert'>
                  Kun 1 variabel tillatt
                </div>
              )}
              <div className='dropdown'>
                <Selections selected={selected.variabel} name='variabel' handleSelect={handleSelect} />
              </div>
            </div>
            <div className='col' id='year-col'>
              <h2 className={error.includes('year') ? 'red' : ''}>Årstall (Påkrevd*)</h2>
              {error.includes('year') && (
                <div className='alert alert-danger p-2 my-2' role='alert'>
                  Minst 3 årstall påkrevd!
                </div>
              )}
              <div className='dropdown'>
                <Selections selected={selected.year} name='year' handleSelect={handleSelect} />
              </div>
            </div>
            <div className='col region-col'>
              <h2 className={error.includes('region') ? 'red' : ''}>Region (Påkrevd*)</h2>
              {error.includes('region') && (
                <div className='alert alert-danger p-2 my-2' role='alert'>
                  Minst 2 regioner påkrevd!
                </div>
              )}
              <select id='region' className=' mb-2 form-select' aria-label='Velg Inndeling (Fylke eller Kommune)' onChange={getRegion}>
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
                      <Selections selected={selected.region} name='region' handleSelect={handleSelect} region={region} regionQuery={regionQuery} />
                    </div>
                    {regionQuery && <span>{region.length} resultater</span>}
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
