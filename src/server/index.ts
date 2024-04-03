import express from 'express';
import { Region } from '../types';

const app = express();
const port = 3000;

const tableUrl = 'https://data.ssb.no/api/v0/no/table/11342/';
let tableData: null | {} = null;

app.use(express.json());

app.post('/api/submit', (req, res) => {
  console.log(req.body);
  res.json(req.body);
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
  }

  res.json(regionFilter);
});

app.listen(port, () => {
  console.log('Server started');
});
