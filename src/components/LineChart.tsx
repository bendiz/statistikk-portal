import Chart from 'chart.js/auto';
import { Colors } from 'chart.js';
import { CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LabelKey } from '../utilities/types';

Chart.register(CategoryScale);
Chart.register(Colors);

export default function LineChart(props: any) {
  const yearToFrom = `${props.years[0]} - ${props.years[props.years.length - 1]}`;
  function dataset(label: string, statsData: any[]) {
    return {
      label: label,
      data: statsData.map((data) => data[label]),
      borderWidth: 2,
      borderColor: '#CFF4FC',
      tension: 0.4,
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
    return {
      labels: statsData.map((data) => data.region),
      datasets: [dataset(type, statsData)],
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

  return (
    <div className='charts'>
      {chartData.map((data) => (
        <div className='chart-container mb-5'>
          <Line
            data={data}
            options={{
              plugins: {
                title: {
                  display: props.regions.length > 50 ? false : true,
                  text: `${getLabelName(data.datasets[0].label as LabelKey)} pr. region (${yearToFrom})`,
                },
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      ))}
    </div>
  );
}
