import { calculateMin, calculateMax, calculateAvg, calculateMedian } from '../utils';

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

  const tableData = sortedRegions.map((region: string, index: number) => {
    const startIndex = index === 0 ? 0 : index * dataLength;
    const regionValues = props.data.values.slice(startIndex, startIndex + dataLength);
    return (
      <tr>
        <th scope='row' className='table-light'>
          {region}
        </th>
        {regionValues.map((value: number) => (
          <td>{value}</td>
        ))}
        <td className='border-control'>{Math.trunc(calculateMedian(regionValues))}</td>
        <td>{Math.trunc(calculateAvg(regionValues))}</td>
        <td>{calculateMin(regionValues)}</td>
        <td>{calculateMax(regionValues)}</td>
      </tr>
    );
  });

  const table = (
    <table className='table'>
      <thead>
        <tr>
          <th colSpan={1} rowSpan={2} className='table-info'>
            Region
          </th>
          <th scope='col' colSpan={dataLength + 4} className='table-info'>
            {props.data.variable}
          </th>
        </tr>
        <tr className='table-light'>
          {props.data.year.map((year: any) => (
            <th scope='col'>{year}</th>
          ))}
          <th scope='col' className='border-control'>
            Median
          </th>
          <th scope='col'>Gj.snitt</th>
          <th scope='col'>Min</th>
          <th scope='col'>Max</th>
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
    </table>
  );

  return (
    <>
      <h1>Statistikk</h1>
      <h2>11342: Areal og befolkning, etter region, statistikkvariabel og år</h2>
      {table}
    </>
  );
}
