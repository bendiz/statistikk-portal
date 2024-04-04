export default function Table(props: any) {
  console.log(props.data);

  const dataLength = props.data.year.length;

  const tableData = props.data.region.map((region: string, index: number) => {
    const startIndex = index * dataLength;
    const regionValues = props.data.values.slice(startIndex, startIndex + dataLength);
    return (
      <tr>
        <th scope='row' className='table-light'>
          {region}
        </th>
        {regionValues.map((value: number) => (
          <td>{value}</td>
        ))}
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
          <th scope='col' colSpan={dataLength} className='table-info'>
            {props.data.variable}
          </th>
        </tr>
        <tr className='table-light'>
          {props.data.year.map((year: any) => (
            <th scope='col'>{year}</th>
          ))}
        </tr>
      </thead>
      <tbody>{tableData}</tbody>
    </table>
  );

  return (
    <>
      <h1>Tabell</h1>
      <h2>11342: Areal og befolkning, etter region, statistikkvariabel og år</h2>
      {table}
    </>
  );
}
