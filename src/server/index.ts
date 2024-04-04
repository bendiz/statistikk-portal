import express from 'express';
import { tableUrl, createTableQuery } from './tableData';
import { Region } from '../types';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/submit', async (req, res) => {
  const selectedOptions = req.body;
  const selectionQuery = createTableQuery(selectedOptions);

  try {
    const externalResponse = await fetch(tableUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectionQuery),
    });

    const externalData = await externalResponse.json();
    console.log(externalData);
    res.json(externalData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

app.get('/api/:region', async (req, res) => {
  const { region } = req.params;
  const response = await fetch(tableUrl);
  const jsonResponse = await response.json();

  const regionNamesArr = jsonResponse.variables[0].valueTexts;
  const regionCodesArr = jsonResponse.variables[0].values;

  let regionFilter = 0;

  if (region === 'fylker') {
    regionFilter = regionNamesArr
      .map((value: string, index: number) => ({ navn: value, kode: regionCodesArr[index] }))
      .filter((f: Region) => f.kode.length < 3 && f.kode !== '0');
  } else if (region === 'kommuner') {
    regionFilter = regionNamesArr
      .map((value: string, index: number) => ({ navn: value, kode: regionCodesArr[index] }))
      .filter((k: Region) => k.kode.length > 2 && k.kode !== '0');
  } else if (region === 'alle') {
    regionFilter = regionNamesArr.map((value: string, index: number) => ({ navn: value, kode: regionCodesArr[index] }));
  }

  res.json(regionFilter);
});

app.listen(port, () => {
  console.log('Server started');
});
