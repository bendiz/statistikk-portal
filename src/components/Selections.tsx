import Select from 'react-select';
import DropdownIndicator from './DropdownIndicator';

export const variabelOptions = [
  { value: 'Folkemengde', label: 'Befolkning per 1.1. (personer)' },
  { value: 'ArealKm2', label: 'Areal (km²)' },
  { value: 'LandArealKm2', label: 'Landareal (km²)' },
  { value: 'FolkeLandArealKm2', label: 'Innbyggere per km² landareal' },
];

export const yearOptions = Array.from({ length: 18 }, (_, index) => {
  const year = 2007 + index;
  return { value: year.toString(), label: year.toString() };
});

const selectAllYears = { value: yearOptions.map((option) => option.value), label: `Velg alle år` };
const yearOptionsWithSelectAll = [selectAllYears, ...yearOptions];

function Selections(props: any) {
  const regionOptions = (region: any) => {
    if (props.regionQuery[0] === 'alle')
      return [{ value: 'alle', label: 'Velg alle kommuner/fylker' }, ...region.map((e: any) => ({ value: e.kode, label: e.navn }))];
    const selectAllOption = { value: region.map((option: any) => option.kode), label: `Velg alle ${props.regionQuery[0]}` };
    return [selectAllOption, ...region.map((e: any) => ({ value: e.kode, label: e.navn }))];
  };

  const options = props.name === 'variabel' ? variabelOptions : props.name === 'year' ? yearOptionsWithSelectAll : regionOptions(props.region);

  const placeholderText =
    props.name === 'variabel'
      ? 'Søk etter variabel'
      : props.name === 'year'
      ? 'Søk etter år'
      : props.name === 'alle'
      ? 'Søk i alle kommuner/fylker'
      : `Søk i ${props.regionQuery[0] || 'region'}`;

  return (
    <Select
      value={props.selected.filter((e: any) => Object.keys(e).length !== 0)}
      options={options}
      onChange={(e) => props.handleSelect(e, props.name)}
      isMulti
      menuIsOpen
      maxMenuHeight={250}
      placeholder={placeholderText}
      hideSelectedOptions={false}
      components={{ DropdownIndicator }}
      styles={{
        valueContainer: (baseStyles) => ({
          ...baseStyles,
          maxHeight: '3rem',
          overflow: 'auto',
        }),
      }}
      required
    />
  );
}

export default Selections;
