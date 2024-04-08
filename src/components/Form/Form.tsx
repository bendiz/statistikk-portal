import Selections from './Selections';
import SelectVariabel from './SelectVariabel';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';

export default function Form(props: any) {
  const [show, setShow] = useState(true);

  return (
    <>
      <h1 className='pt-5 pb-3'>Statistikk Portal</h1>
      <div className='container text-center'>
        <form onSubmit={props.handleSubmit}>
          <div className='row row-cols-3'>
            <SelectVariabel props={props} title='variabel' type='statistikk' setShow={setShow} />
            <SelectVariabel props={props} title='year' type='år' setShow={setShow} />
            <div className='col region-col'>
              <h2 className={props.error.length > 0 && props.error[0].includes('region') ? 'red' : ''}>Region (Påkrevd*)</h2>
              {props.error.length > 0 && props.error[0].includes('region') && (
                <Alert variant='danger' onClose={() => setShow(false)} dismissible>
                  {props.error[1]['region']}
                </Alert>
              )}
              <select id='region' className=' mb-2 form-select' aria-label='Velg Inndeling (Fylke eller Kommune)' onChange={props.getRegion}>
                {!props.regionQuery[1] && (
                  <option className={'text-center text-muted'} value='0'>
                    -- Velg inndeling (Fylke eller Kommune) --
                  </option>
                )}
                <option value='alle'>Hele Landet</option>
                <option value='fylker'>Fylker</option>
                <option value='kommuner'>Kommuner</option>
              </select>
              {props.region.length > 0 && (
                <div className='velg-region'>
                  <div>
                    <div className='menu-dropdown'>
                      <Selections
                        selected={props.selected.region}
                        name='region'
                        handleSelect={props.handleSelect}
                        region={props.region}
                        regionQuery={props.regionQuery}
                      />
                    </div>
                    {props.regionQuery && <span className='badge bg-grey fw-bold'>{props.region.length} resultater</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 offset-3'>
              <button className='data-btn btn btn-success p-3'>Hent data</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
