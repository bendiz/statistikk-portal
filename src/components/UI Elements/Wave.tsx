export function BottomWave() {
  return (
    <div className='wave-bottom z-0'>
      <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
        <path
          fill='#7DBFEB'
          fillOpacity='1'
          d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'></path>
      </svg>
    </div>
  );
}

export function TopWave() {
  return (
    <div className='wave-top z-0'>
      <svg className='wave ' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 220'>
        <path
          fill='#7DBFEB'
          fillOpacity='1'
          d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z'></path>
      </svg>
    </div>
  );
}
