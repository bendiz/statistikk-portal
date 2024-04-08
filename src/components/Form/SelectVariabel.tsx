import Selections from './Selections';
import Alert from 'react-bootstrap/Alert';

export default function FormSelection({ props, title, type, setShow }: any) {
  let errorMessage;
  if (props.error.length > 0) {
    errorMessage = Object.values(props.error[1]).filter((e: any) => [type, title].some((val) => e.includes(val)))[0];
  }

  const selectHeading = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className={`col ${type}-col`}>
      <h2 className={props.error.length > 0 && props.error[0].includes(title) ? 'red' : ''}>{selectHeading} (Påkrevd*)</h2>
      {props.error.length > 0 && props.error[0].includes(title) && (
        <Alert variant='danger' onClose={() => setShow(false)} dismissible>
          {errorMessage as React.ReactNode}
        </Alert>
      )}
      <div className='menu-dropdown'>
        <Selections selected={props.selected[title]} name={title} handleSelect={props.handleSelect} />
      </div>
    </div>
  );
}
