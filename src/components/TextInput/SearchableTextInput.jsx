import { forwardRef, memo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '../../assets/icons/searchIcon.svg';
import { Autocomplete, TextField } from '@mui/material';

/**
 * @param label - String
 * @param name - String
 * @param hint - String
 * @param error - String
 * @param Icon React JSX Element
 */
const SearchableTextInput = memo(
  forwardRef(function TextInput(
    {
      label,
      name,
      hint,
      error,
      touched,
      Icon,
      inputClasses,
      displayError = true,
      message,
      onChange,
      options,
      ...props
    },
    ref,
  ) {
    const inputRef = useRef();

    const removeLable = () => {
      const labelElement = document.getElementsByClassName('MuiFormLabel-root');
      if (labelElement.length > 0) {
        labelElement[0].remove();
      }
    };

    useEffect(() => {
      removeLable();
    }, [inputRef.current]);

    return (
      <div className='flex flex-col gap-1'>
        <label htmlFor={name} className='flex gap-0.5 items-center text-primary-black'>
          {label}
          {props.required && <span className='text-primary-red text-sm'>*</span>}
        </label>
        {hint && (
          <span
            className='mb-1.5 text-light-grey text-sm font-normal'
            dangerouslySetInnerHTML={{
              __html: hint,
            }}
          />
        )}
        <div
          role='button'
          tabIndex={-1}
          onClick={() => (ref ? ref.current.focus() : inputRef.current.focus())}
          onKeyDown={() => (ref ? ref.current?.focus() : inputRef.current.focus())}
          className={`input-container bg-white px-4 py-3 border rounded-lg 
        flex justify-between gap-1
        transition-all ease-out duration-150
        focus-within:border-secondary-blue focus-within:shadow-secondary-blue focus-within:shadow-primary
        ${
          error && touched
            ? 'border-primary-red shadow-primary shadow-primary-red'
            : 'border-light-grey'
        }
        ${!props.value && !error && !touched && 'border-stroke'}
        ${props.disabled ? 'bg-[#fafafa] pointer-events-none cursor-not-allowed' : ''}
        `}
        >
          {Icon && <Icon />}

          <Autocomplete
            ref={ref || inputRef}
            disablePortal
            id={name}
            name={name}
            onChange={(e, value) => onChange(name, value)}
            options={options}
            sx={{ width: 300, border: 'none' }}
            renderInput={(params) => <TextField {...params} label='Movie' placeholder='Eg: Idea' />}
          />
          <img src={SearchIcon} />
        </div>
        {displayError && !message ? (
          <span
            className='text-xs text-primary-red'
            dangerouslySetInnerHTML={{
              __html: error && touched ? error : String.fromCharCode(160),
            }}
          />
        ) : (
          ''
        )}
        {message ? (
          <span
            className='flex text-primary-black text-xs leading-[18px]'
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        ) : (
          ''
        )}
      </div>
    );
  }),
);

export default SearchableTextInput;

SearchableTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  hint: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  touched: PropTypes.bool,
  Icon: PropTypes.elementType,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputClasses: PropTypes.string,
  displayError: PropTypes.bool,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
