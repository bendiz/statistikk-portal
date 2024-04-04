export const tableUrl = 'https://data.ssb.no/api/v0/no/table/11342/';
export const createTableQuery = (selectedOptions: any) => {
  const selectionQuery = {
    query: [
      {
        code: 'Region',
        selection: {
          filter: '',
          values: selectedOptions.region.map((region: any) => {
            return region.value;
          }),
        },
      },
      {
        code: 'ContentsCode',
        selection: {
          filter: 'item',
          values: selectedOptions.variabel.map((variabel: any) => {
            return variabel.value;
          }),
        },
      },
      {
        code: 'Tid',
        selection: {
          filter: 'item',
          values: selectedOptions.year.map((year: any) => {
            return year.value;
          }),
        },
      },
    ],
    response: {
      format: 'json-stat2',
    },
  };
  return selectionQuery;
};
