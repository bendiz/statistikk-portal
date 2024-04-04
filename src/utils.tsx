const errorCheck = (selectedOptions: any): [boolean, string[]] => {
  let errors = [''];
  let errorFound = false;

  if (selectedOptions.variabel.length > 1) {
    errors.push('variabel');
    errorFound = true;
  }

  if (selectedOptions.region.length < 2) {
    errors.push('region');
    errorFound = true;
  }

  if (selectedOptions.year.length < 3) {
    errors.push('year');
    errorFound = true;
  }
  return [errorFound, errors];
};

export default errorCheck;
