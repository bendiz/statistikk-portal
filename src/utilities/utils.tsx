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