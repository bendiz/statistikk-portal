import './App.css';
import Navbar from './components/Navbar';
import Form from './components/Form';
import Table from './components/Table';
import { useState } from 'react';
import Selections from './components/Selections';
import { errorCheck } from './utils';

function App() {
  const [validQuery, setValidQuery] = useState(false);
  const [regionQuery, setRegionQuery] = useState('');
  const [region, setRegion] = useState([]);
  const [error, setError] = useState<string[]>([]);
  const [selected, setSelected] = useState({
    variabel: [{}],
    year: [{}],
    region: [{}],
  });
  const [tableData, setTableData] = useState({
    indexes: [],
    variable: [],
    region: [],
    year: [],
    values: [],
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
        const data = await response.json();
        setTableData({
          indexes: Object.values(data.dimension.Region.category.index),
          variable: Object.values(data.dimension.ContentsCode.category.label),
          region: Object.values(data.dimension.Region.category.label),
          year: Object.values(data.dimension.Tid.category.label),
          values: data.value,
        });
        setValidQuery(true);
      }
    } catch (error) {
      throw new Error('Something went wrong. Please try again later!');
    }
  };

  return (
    <>
      {!validQuery && (
        <Form
          selected={selected}
          error={error}
          getRegion={getRegion}
          regionQuery={regionQuery}
          region={region}
          handleSubmit={handleSubmit}
          handleSelect={handleSelect}
        />
      )}
      {validQuery && (
        <>
          <Navbar changeQuery={() => setValidQuery(false)} />
          <Table data={tableData} setSize={selected.year.length} />
        </>
      )}
    </>
  );
}

export default App;
