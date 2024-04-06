import { TableDataType } from './types';

export function processData(data: any): TableDataType {
  return {
    indexes: Object.values(data.dimension.Region.category.index),
    variable: Object.values(data.dimension.ContentsCode.category.label),
    region: Object.values(data.dimension.Region.category.label),
    year: Object.values(data.dimension.Tid.category.label),
    values: data.value,
  };
}
export function errorCheck(selectedOptions: any): [boolean, string[]] {
  let errors = [''];
  let errorFound = false;

  if (selectedOptions.region.length < 2) {
    if (selectedOptions.region[0].value !== '0') {
      errors.push('region');
      errorFound = true;
    }
  }

  if (selectedOptions.year.length < 3) {
    errors.push('year');
    errorFound = true;
  }
  return [errorFound, errors];
}

export function scrollToRef(ref: any, yOffset = -100) {
  if (ref && ref.current) {
    const y = ref.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

export function scrollToTop() {
  return window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function calculateMedian(values: number[]): number {
  return values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
}

export function calculateAvg(values: number[]): number {
  return values.reduce((acc, val) => acc + val, 0) / values.length;
}

export function calculateMin(values: number[]): number {
  return Math.min(...values);
}

export function calculateMax(values: number[]) {
  return Math.max(...values);
}

export function separateNumbers(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
