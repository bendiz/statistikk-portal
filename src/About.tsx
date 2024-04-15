import statisticsPic1 from '/img/statistics1.png';
import statisticsPic2 from '/img/statistics2.png';

export default function About() {
  return (
    <>
      <div className='row info-row'>
        <div className='px-5'>
          <div className='row justify-content-evenly'>
            <div className='card text-white col-5 info-card align-items-center pb-3'>
              <img src={statisticsPic1} alt='' className='w-25 pt-3' />
              <h5 className='card-header card-title mt-3'>Hvordan hentes dataene fra?</h5>
              <div className='card-body p-4'>
                <h6 className='card-title'>Statistisk sentralbyrå</h6>
                <p className='card-text opacity-75'>
                  Dataene blir hentet fra 'Tabell 11342: Areal og befolkning i kommuner, fylker og hele landet (K) 2007-2024' i statistikkbanken.
                  Dataene blir deretter prosessert og presentert i tabellformat og grafisk format.
                </p>
              </div>
            </div>
            <div className='card text-white col-5 info-card align-items-center'>
              <img src={statisticsPic2} alt='' className='w-25 pt-3' />
              <h5 className='card-header card-title mt-3'>Hvordan foretar jeg en spørring?</h5>
              <div className='card-body p-4'>
                <h6 className='card-title'>Bruk skjema nedenfor</h6>
                <p className='card-text'>
                  Ved hjelp av skjemaet nedenfor kan du velge en statistisk variabel, en sekvens av år (minimum 3). Deretter kan du velge
                  regioninndeling, og to eller flere regioner. Trykk på 'Hent data' for å se resultatet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='wave-bottom'>
        <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
          <path
            fill='#7DBFEB'
            fill-opacity='1'
            d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'></path>
        </svg>
      </div>
    </>
  );
}
