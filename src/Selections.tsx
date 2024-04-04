import Select, { components } from 'react-select';
import DropdownIndicator from './DropdownIndicator';

const variabelOptions = () => {
  return [
    { value: 'Folkemengde', label: 'Befolkning per 1.1. (personer)' },
    { value: 'ArealKm2', label: 'Areal (km²)' },
    { value: 'LandArealKm2', label: 'Landareal (km²)' },
    { value: 'FolkeLandArealKm2', label: 'Innbyggere per km² landareal' },
  ];
};

const yearOptions = Array.from({ length: 18 }, (_, index) => {
  const year = 2007 + index;
  return { value: year.toString(), label: year.toString() };
});

const regionOptions = (region: any) => {
  return region.map((e) => ({ value: e.kode, label: e.navn }));
};

function Selections(props: any) {
  const options = props.name === 'variabel' ? variabelOptions() : props.name === 'year' ? yearOptions : regionOptions(props.region);

  const placeholderText =
    props.name === 'variabel'
      ? 'Søk etter variabel'
      : props.name === 'year'
      ? 'Søk etter år'
      : props.name === 'alle'
      ? 'Søk i alle kommuner/fylker'
      : `Søk etter ${props.regionQuery || 'region'}`;

  return (
    <Select
      value={props.selected.filter((e) => Object.keys(e).length !== 0)}
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
