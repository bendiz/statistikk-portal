import Selections from './Selections';

export default function Form(props: any) {
  return (
    <>
      <h1 className='pt-5 pb-3'>Statistikk Portal</h1>
      <div className='container text-center'>
        <form onSubmit={props.handleSubmit}>
          <div className='row row-cols-3'>
            <div className='col statistikk-col'>
              <h2 className={props.error.includes('variabel') ? 'red' : ''}>Statistikk (Påkrevd*)</h2>
              {props.error.includes('variabel') && (
                <div className='alert alert-danger p-1 my-2' role='alert'>
                  Kun 1 variabel tillatt
                </div>
              )}
              <div className='dropdown'>
                <Selections selected={props.selected.variabel} name='variabel' handleSelect={props.handleSelect} />
              </div>
            </div>
            <div className='col' id='year-col'>
              <h2 className={props.error.includes('year') ? 'red' : ''}>Årstall (Påkrevd*)</h2>
              {props.error.includes('year') && (
                <div className='alert alert-danger p-1 my-2' role='alert'>
                  Minst 3 årstall påkrevd!
                </div>
              )}
              <div className='dropdown'>
                <Selections selected={props.selected.year} name='year' handleSelect={props.handleSelect} />
              </div>
            </div>
            <div className='col region-col'>
              <h2 className={props.error.includes('region') ? 'red' : ''}>Region (Påkrevd*)</h2>
              {props.error.includes('region') && (
                <div className='alert alert-danger p-1 my-2' role='alert'>
                  Minst 2 regioner påkrevd!
                </div>
              )}
              <select id='region' className=' mb-2 form-select' aria-label='Velg Inndeling (Fylke eller Kommune)' onChange={props.getRegion}>
                <option className='text-center' value='0'>
                  -- Velg inndeling --
                </option>
                <option value='alle'>Hele Landet</option>
                <option value='fylker'>Fylker</option>
                <option value='kommuner'>Kommuner</option>
              </select>
              {props.region.length > 0 && (
                <div className='velg-region'>
                  <div>
                    <div className='dropdown'>
                      <Selections
                        selected={props.selected.region}
                        name='region'
                        handleSelect={props.handleSelect}
                        region={props.region}
                        regionQuery={props.regionQuery}
                      />
                    </div>
                    {props.regionQuery && <span>{props.region.length} resultater</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='row'>
            <div className='col-md-6 offset-3'>
              <button className='data-btn btn btn-primary p-3'>Hent data</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
