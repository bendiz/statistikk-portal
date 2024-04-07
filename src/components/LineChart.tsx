import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Colors } from 'chart.js';
import { CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LabelKey } from '../utilities/types';
import { getRandomColor } from '../utilities/utils';
import { useState } from 'react';

Chart.register(CategoryScale);
Chart.register(Colors);
Chart.register(ChartDataLabels);

export default function LineChart(props: any) {
  const [hideEmptyValues, setHideEmptyValues] = useState(false);

  const yearToFrom = `${props.years[0]} - ${props.years[props.years.length - 1]}`;
  function dataset(label: string, statsData: any[]) {
    return {
      label: label,
      data: statsData.map((data) => data[label]),
      borderWidth: 2,
      tension: 0.4,
      maintainAspectRatio: false,
    };
  }

  const statsData = props.regions.map((region: string, index: number) => ({
    region: region,
    median: props.calculations.median[index],
    avg: props.calculations.avg[index],
    min: props.calculations.min[index],
    max: props.calculations.max[index],
  }));

  function generateChartData(type: string, statsData: any[]) {
    const pointBackgroundColors = statsData.map(() => getRandomColor());
    return {
      labels: statsData.map((data) => data.region),
      datasets: [{ ...dataset(type, statsData), pointBackgroundColor: pointBackgroundColors }],
    };
  }

  const chartDataMedian = generateChartData('median', statsData);
  const chartDataAvg = generateChartData('avg', statsData);
  const chartDataMin = generateChartData('min', statsData);
  const chartDataMax = generateChartData('max', statsData);

  const chartData = [chartDataMedian, chartDataAvg, chartDataMin, chartDataMax];

  function getLabelName(shortLabel: LabelKey): string {
    const labels = {
      median: 'Median',
      avg: 'Gjennomsnitt',
      min: 'Minimum',
      max: 'Maksimum',
    };
    return labels[shortLabel];
  }

  function getRefName(shortLabel: LabelKey): any {
    const refLabels = {
      median: props.refs.medianRef,
      avg: props.refs.avgRef,
      min: props.refs.minRef,
      max: props.refs.maxRef,
    };
    return refLabels[shortLabel];
  }

  if (hideEmptyValues) {
    chartData.forEach((chart) => {
      const filteredData: number[] = [];
      const filteredLabels: string[] = [];

      chart.datasets[0].data.forEach((value, index) => {
        if (value !== 0) {
          filteredData.push(value);
          filteredLabels.push(chart.labels[index]);
        }
      });

      chart.datasets[0].data = filteredData;
      chart.labels = filteredLabels;
    });
  }

  return (
    <div className='charts'>
      <button className='btn btn-primary' onClick={() => setHideEmptyValues(!hideEmptyValues)}>
        {hideEmptyValues ? 'Vis tomme verdier' : 'Skjul tomme verdier'}
      </button>
      {chartData.map((data, index) => (
        <div key={data.datasets[0].label}>
          <h3 className='mt-3 mb-1 text-center fs-6 fw-light text-muted'>{props.variable}</h3>
          <h3 className='mb-1 text-center fs-6 fw-light text-muted' id={data.datasets[0].label} ref={getRefName(data.datasets[0].label as LabelKey)}>
            <a className='text-decoration-none text-muted' onClick={() => props.scrollToRef(getRefName(data.datasets[0].label as LabelKey))}>
              {getLabelName(data.datasets[0].label as LabelKey)} pr. region ({yearToFrom})
            </a>
          </h3>
          <div className='chart-container mb-5'>
            <Line
              data={data}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                  datalabels: {
                    display: true,
                    color: 'black',
                    align: 'top',
                  },
                },
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
