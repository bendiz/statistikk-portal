import './App.css';
import { useState, useRef } from 'react';
import NavigationBar from './components/UI Elements/Navbar';
import Header from './components/UI Elements/Header';
import About from './components/UI Elements/About';
import Form from './components/Form/Form';
import Table from './components/Statistics/Table';
import { errorCheck, scrollToRef, processData } from './utilities/utils';
import { RegionType, TableDataType } from './utilities/types';
import { yearOptions } from './components/Form/Selections';
import Alert from 'react-bootstrap/Alert';

function App() {
  const [validQuery, setValidQuery] = useState(false);
  const [regionQuery, setRegionQuery] = useState(['', '']);
  const [region, setRegion] = useState<RegionType[]>([]);
  const [error, setError] = useState<Array<any>>([[], []]);
  const [showGraphAlert, setShowGraphAlert] = useState(false);
  const [selected, setSelected] = useState({
    variabel: [{}],
    year: [{}],
    region: [{}],
  });
  const [tableData, setTableData] = useState<TableDataType>({
    indexes: [],
    variable: [],
    region: [],
    year: [],
    values: [],
  });
  const [grafVisning, setGrafVisning] = useState(false);
  const [isFirstClick, setIsFirstClick] = useState(true);
  const refs = {
    medianRef: useRef(null),
    avgRef: useRef(null),
    minRef: useRef(null),
    maxRef: useRef(null),
    scrollToRef: scrollToRef,
  };

  function handleFirstClick() {
    if (isFirstClick && tableData.region.length <= 50) {
      setGrafVisning(true);
      setIsFirstClick(true);
    }
  }

  const checkAllSelected = (selected: any, type: any) => {
    const isSelectedAll = selected.find((option: any) => option.label.includes('alle'));
    if (isSelectedAll) {
      let allOptionsSelected: any[] = [];
      if (type === 'region') {
        allOptionsSelected = region.map((e) => ({ value: e.kode, label: e.navn }));
      } else if (type === 'year') {
        allOptionsSelected = yearOptions.map((e) => ({ value: e.value, label: e.label }));
      }
      handleSelect(allOptionsSelected, type);
    } else {
      handleSelect(selected, type);
    }
  };

  const handleSelect = (event: any, type: string) => {
    setSelected((prev) => ({ ...prev, [type]: event }));
  };

  const getRegion = async (event: any) => {
    setRegion([]);
    setRegionQuery([]);
    if (event.target.value === '0') {
      return;
    } else {
      const queryValue: string = event.target.value;
      const queryName: string = event.target.selectedOptions[0].text;
      const response = await fetch(`http://localhost:5173/api/${queryValue}`);
      const data = await response.json();
      setRegion(data);
      setRegionQuery([queryValue, queryName]);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setValidQuery(false);
    const selectedOptions = selected;
    const errors = errorCheck(selectedOptions);

    if (errors[0]) {
      setError([errors[1], errors[2]]);
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
        const processedData = processData(data);
        console.log(processedData);
        setTableData(processedData);
        setValidQuery(true);
      }
    } catch (error) {
      console.log(error);
      throw new Error('Something went wrong. Please try again later!');
    }
  };

  return (
    <>
      {showGraphAlert && (
        <Alert variant='danger' onClose={() => setShowGraphAlert(false)} dismissible className='mt-3 mb-0 z-3'>
          <Alert.Heading>Grafvisning ikke tillatt!</Alert.Heading>
          Maks 50 regioner
        </Alert>
      )}
      {!validQuery && (
        <div>
          <Header />
          <About />
          <Form
            selected={selected}
            error={error}
            getRegion={getRegion}
            regionQuery={regionQuery}
            region={region}
            handleSubmit={handleSubmit}
            handleSelect={checkAllSelected}
          />
        </div>
      )}
      {validQuery && (
        <div className='pb-3'>
          <NavigationBar
            grafVisning={
              tableData.region.length <= 50
                ? () => setGrafVisning(!grafVisning)
                : () => {
                    setGrafVisning(false);
                    setShowGraphAlert(true);
                  }
            }
            grafVisningOn={grafVisning}
            scrollToRef={scrollToRef}
            refs={refs}
            handleFirstClick={handleFirstClick}
          />
          <Table data={tableData} setSize={selected.year.length} grafVisning={grafVisning} refs={refs} />
        </div>
      )}
    </>
  );
}

export default App;
