import express from 'express';
import CatchAsync from '../utilities/CatchAsync.js';
import ExpressError from '../utilities/ExpressError.js';
import { Request, Response, NextFunction } from 'express';
import { tableUrl, createTableQuery } from './tableData';
import { Region } from '../utilities/types';

const app = express();
const port = 3000;

app.use(express.json());

app.post(
  '/api/submit',
  CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const selectedOptions = req.body;

    if (selectedOptions.region.length < 2 || selectedOptions.year.length < 3 || selectedOptions.variabel.length > 1) {
      throw new ExpressError('Invalid query', 500);
    } else {
      const selectionQuery = createTableQuery(selectedOptions);
      const externalResponse = await fetch(tableUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectionQuery),
      });
      const externalData = await externalResponse.json();
      res.json(externalData);
    }
  })
);

app.get(
  '/api/region/:region',
  CatchAsync(async (req: Request, res: Response, _next: NextFunction) => {
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

    if (region.length > 0) {
      res.json(regionFilter);
    } else {
      res.redirect('/');
    }
  })
);

app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err: ExpressError, _: Request, res: Response, _next: NextFunction): void => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh no, something went wrong!';
  res.status(statusCode).send(`Error ${err.statusCode}: ${err.message}. <a href="http://localhost:5173/">Click here to try again</a>`);
});

app.listen(port, () => {
  console.log('Server started');
});
