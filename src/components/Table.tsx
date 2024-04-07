import { calculateMin, calculateMax, calculateAvg, calculateMedian, separateNumbers } from '../utilities/utils';
import { Badge } from 'react-bootstrap';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import LineChart from './LineChart';
import { useState } from 'react';

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
          <th scope='row' className='table-light inner-th'>
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
      className='toggle-empty-values-btn p-2 mb-2'
      pill
      bg='primary'
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
          <h2 className='fs-2 mt-5 pt-5'>Tabell</h2>
          <h3 className='fs-6 fw-light text-muted pb-2'>11342: Areal og befolkning, etter region, statistikkvariabel og år</h3> {hideEmptyValuesBadge}
          <div className='px-3'>{table}</div>
        </>
      )}
      {props.grafVisning && sortedRegions.length <= 50 && (
        <>
          <h2 className='fs-2 mt-5 pt-5'>Grafer</h2>
          {hideEmptyValuesBadge}
          <LineChart
            regions={sortedWithSortedData.map((data) => data.region)}
            variable={props.data.variable}
            calculations={calculatedValues}
            years={props.data.year}
            refs={props.refs}
            hideEmpty={hideEmpty}
          />
        </>
      )}
    </>
  );
}
