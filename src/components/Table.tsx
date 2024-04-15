import { calculateMin, calculateMax, calculateAvg, calculateMedian, separateNumbers } from '../utilities/utils';
import { Badge } from 'react-bootstrap';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import LineChart from './LineChart';
import { useState } from 'react';
import investigatePic from '/img/investigate.svg';
import diagrams from '/img/diagrams.svg';

export default function Table(props: any) {
  const dataLength = props.data.year.length;
  const reorderRegions = (regions: string[], newOrder: number[]) => {
    const tempArray = new Array(regions.length);

    newOrder.forEach((newIndex, oldIndex) => {
      tempArray[newIndex] = regions[oldIndex];
    });

    return tempArray;
  };

  const [hideEmpty, sethideEmpty] = useState(false);

  const sortedRegions = reorderRegions(props.data.region, props.data.indexes);
  const calculatedValues: Record<string, number[]> = {
    median: [],
    avg: [],
    min: [],
    max: [],
  };

  function addCalculatedValues(regionValues: number[]): void {
    calculatedValues.median.push(Math.trunc(calculateMedian(regionValues)));
    calculatedValues.avg.push(Math.trunc(calculateAvg(regionValues)));
    calculatedValues.min.push(calculateMin(regionValues));
    calculatedValues.max.push(calculateMax(regionValues));
  }

  const sortedWithSortedData = sortedRegions.map((region: string, index: number) => {
    const startIndex = index === 0 ? 0 : index * dataLength;
    const regionValues = props.data.values.slice(startIndex, startIndex + dataLength);
    return { region, regionValues };
  });

  sortedWithSortedData.sort((a, b) => {
    if (a.region < b.region) {
      return -1;
    }
    if (a.region > b.region) {
      return 1;
    }
    return 0;
  });

  const tableData = sortedWithSortedData.map(({ region, regionValues }, index) => {
    const hasEmptyCell = Object.values(regionValues).every((value) => value === 0);
    addCalculatedValues(regionValues);
    return (
      (hideEmpty ? !hasEmptyCell : true) && (
        <tr key={`tr-${region}-${index}`}>
          <th scope='row' className='inner-th table-light'>
            {region}
          </th>
          {regionValues.map((value: number, index: number) => (
            <td key={`td-${region}-${index}`}>{separateNumbers(value)}</td>
          ))}
          <td key={`median-${region}-${index}`} className='border-control'>
            {separateNumbers(Math.trunc(calculateMedian(regionValues)))}
          </td>
          <td key={`avg-${region}-${index}`}>{separateNumbers(Math.trunc(calculateAvg(regionValues)))}</td>
          <td key={`min-${region}-${index}`}>{separateNumbers(calculateMin(regionValues))}</td>
          <td key={`max-${region}-${index}`}>{separateNumbers(calculateMax(regionValues))}</td>
        </tr>
      )
    );
  });

  const table = (
    <table className='table'>
      <thead>
        <tr>
          <th key='region' colSpan={1} rowSpan={2} className='table-info'>
            Region
          </th>
          <th key='variable' scope='col' colSpan={dataLength + 4} className='table-info'>
            {props.data.variable}
          </th>
        </tr>
        <tr className='table-light'>
          {props.data.year.map((year: any) => (
            <th key={year} scope='col' className='inner-th'>
              {year}
            </th>
          ))}
          <th scope='col' className='border-control inner-th'>
            Median
          </th>
          <th scope='col' className='inner-th'>
            Gj.snitt
          </th>
          <th scope='col' className='inner-th'>
            Min
          </th>
          <th scope='col' className='inner-th'>
            Max
          </th>
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
    </table>
  );

  const hideEmptyValuesBadge = (
    <Badge
      className='toggle-empty-values-btn p-2 mb-2 empty-values-badge'
      id='empty-values-badge'
      pill
      onClick={() => sethideEmpty(!hideEmpty)}
      title={hideEmpty ? 'Vis tomme verdier' : 'Skjul tomme verdier'}>
      {hideEmpty ? <IoEyeOutline /> : <IoEyeOffOutline />}
      &nbsp; {hideEmpty ? 'Vis' : 'Skjul'} tomme verdier
    </Badge>
  );

  return (
    <>
      {!props.grafVisning && (
        <>
          <div className='row mt-5 py-3'>
            <div className='tabell-col col-6 offset-3'>
              <img src={investigatePic} alt='' className='w-25' />
              <h2 className='fs-2 pt-2'>Tabell</h2>
              <h3 className='fs-6 text-white fw-light pb-2'>11342: Areal og befolkning, etter region, statistikkvariabel og år</h3>{' '}
              {hideEmptyValuesBadge}
            </div>
          </div>
          <div className='px-3'>{table}</div>
        </>
      )}
      {props.grafVisning && sortedRegions.length <= 50 && (
        <>
          <div className='row mt-5 pt-5'>
            <div className='tabell-col col-6 offset-3'>
              <img src={diagrams} alt='' className='w-25' />
              <h2 className='fs-2 pt-2'>Grafer</h2>
              <h3 className='fs-6 text-white fw-light pb-2'>Median, gjennomsnitt, minimum og maksimum pr. region</h3>{' '}
              <span className='pt-2'>{hideEmptyValuesBadge}</span>
            </div>
          </div>
          <div className='wave-top'>
            <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
              <path
                fill='#7DBFEB'
                fill-opacity='1'
                d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z'></path>
            </svg>
          </div>
          <LineChart
            regions={sortedWithSortedData.map((data) => data.region)}
            variable={props.data.variable}
            calculations={calculatedValues}
            years={props.data.year}
            refs={props.refs}
            hideEmpty={hideEmpty}
          />
          <div className='wave-bottom'>
            <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
              <path
                fill='#7DBFEB'
                fill-opacity='1'
                d='M0,160L120,170.7C240,181,480,203,720,181.3C960,160,1200,96,1320,64L1440,32L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z'></path>
            </svg>
          </div>
        </>
      )}
    </>
  );
}
