import { forwardRef, useRef } from 'react';
import { IconCalendar } from '../../assets/icons';
import PropTypes from 'prop-types';

const DatePickerInput = forwardRef(function DatePickerInput(
  { name, error, touched, onBlur, reference, value, ...props },
  _ref,
) {
  const inputRef = useRef(null);

  return (
    <div className={`flex flex-col gap-1 ${error && touched ? 'pb-[0px]' : 'pb-[12px]'}`}>
      <label htmlFor={name} className='flex gap-0.5 items-center text-primary-black w-fit'>
        {props.label}
        {true && <span className='text-primary-red text-sm'>*</span>}
      </label>
      <div
        className={`input-container px-4 py-3 border justify-between  rounded-lg flex w-full items-center    
        ${
          error && touched
            ? 'border-[#E33439] shadow-primary shadow-[#E33439]'
            : value
            ? 'border-dark-grey'
            : 'border-[#D9D9D9]'
        }
        ${props.disabled ? 'bg-disabled-grey pointer-events-none cursor-not-allowed' : 'bg-white'}
        `}
      >
        <input
          {...props}
          value={value}
          disabled={props.disabled}
          placeholder='DD/MM/YYYY'
          className='w-full'
          name={name}
          ref={reference}
          onBlur={onBlur}
          onInput={(e) => {
            let value = e.currentTarget.value;
            if (value.length >= 2 && value.charAt(2) !== '/') {
              value = value.slice(0, 2) + '/' + value.slice(2);
            }

            if (value.length >= 5 && value.charAt(5) !== '/') {
              value = value.slice(0, 5) + '/' + value.slice(5);
            }

            if (value.length >= 10) {
              value = value.slice(0, 10);

              const year = value.slice(6);
              const month = value.slice(0, 2);
              const day = value.slice(3, 5);

              value = month + '/' + day + '/' + year;
            }
            e.currentTarget.value = value;
          }}
          onKeyDown={(e) => {
            const value = e.currentTarget.value;
            if (e.key === 'Backspace') {
              if (value[value.length - 1] === '/') {
                e.currentTarget.value = value.slice(0, value.length - 1);
              }
            }
            if (e.key === 'Enter') {
              props.datepickerref.current.setOpen(false);
            }
          }}
        />
        <button
          type='button'
          title='Open Calendar'
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            props.datepickerref.current.setOpen(!props.datepickerref.current.state.open);
          }}
        >
          <IconCalendar />
        </button>
      </div>
      {error && touched ? (
        <span
          className='text-xs text-primary-red'
          dangerouslySetInnerHTML={{
            __html: error && touched ? error : String.fromCharCode(160),
          }}
        />
      ) : (
        ''
      )}
    </div>
  );
});

DatePickerInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  datepickerref: PropTypes.object,
};

export default DatePickerInput;
