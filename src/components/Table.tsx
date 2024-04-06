import { calculateMin, calculateMax, calculateAvg, calculateMedian, separateNumbers } from '../utilities/utils';
import LineChart from './LineChart';

export default function Table(props: any) {
  const dataLength = props.data.year.length;
  const reorderRegions = (regions: string[], newOrder: number[]) => {
    const tempArray = new Array(regions.length);

    newOrder.forEach((newIndex, oldIndex) => {
      tempArray[newIndex] = regions[oldIndex];
    });

    return tempArray;
  };

  const sortedRegions = reorderRegions(props.data.region, props.data.indexes);
  const calculatedValues: Record<string, number[]> = {
    median: [],
    avg: [],
    min: [],
    max: [],
  };

  const tableData = sortedRegions.map((region: string, index: number) => {
    const startIndex = index === 0 ? 0 : index * dataLength;
    const regionValues = props.data.values.slice(startIndex, startIndex + dataLength);
    calculatedValues.median.push(Math.trunc(calculateMedian(regionValues)));
    calculatedValues.avg.push(Math.trunc(calculateAvg(regionValues)));
    calculatedValues.min.push(calculateMin(regionValues));
    calculatedValues.max.push(calculateMax(regionValues));
    console.log(sortedRegions);
    return (
      <>
        <tr key={`${region}-${startIndex}`}>
          <th scope='row' className='table-light inner-th'>
            {region}
          </th>
          {regionValues.map((value: number, index: number) => (
            <td key={index}>{separateNumbers(value)}</td>
          ))}
          <td key='median' className='border-control'>
            {separateNumbers(Math.trunc(calculateMedian(regionValues)))}
          </td>
          <td key='avg'>{separateNumbers(Math.trunc(calculateAvg(regionValues)))}</td>
          <td key='min'>{separateNumbers(calculateMin(regionValues))}</td>
          <td key='max'>{separateNumbers(calculateMax(regionValues))}</td>
        </tr>
      </>
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

  return (
    <>
      {!props.grafVisning && (
        <>
          <h1>Tabell</h1>
          <h2>Tabell 11342: Areal og befolkning, etter region, statistikkvariabel og år</h2> <div>{table}</div>
        </>
      )}
      {props.grafVisning && sortedRegions.length < 50 && (
        <>
          <h1>Grafer</h1>
          <h2>Tabell 11342: Areal og befolkning, etter region, statistikkvariabel og år</h2>
          <LineChart regions={sortedRegions} calculations={calculatedValues} years={props.data.year} />
        </>
      )}
    </>
  );
}
