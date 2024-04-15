import statistikkHeader from '/img/statistikk-header-1.png';

export default function Header() {
  return (
    <>
      <div className='header d-flex justify-content-center align-items-center'>
        <img src={statistikkHeader} alt='' className='w-100' />
      </div>
      <div className='header-bottom'>
        <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
          <path
            fill='#7DBFEB'
            fill-opacity='1'
            d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z'></path>
        </svg>
      </div>
    </>
  );
}
