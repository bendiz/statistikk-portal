import statistikkHeader from '/img/statistikk-header-1.png';
import { TopWave } from './Wave';

export default function Header() {
  return (
    <>
      <div className='header d-flex justify-content-center align-items-center'>
        <img src={statistikkHeader} alt='' className='w-100' />
      </div>
      <TopWave />
    </>
  );
}
