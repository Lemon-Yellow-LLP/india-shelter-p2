import PropTypes from 'prop-types';
import { forwardRef, useState } from 'react';

const Checkbox = forwardRef(function Checkbox({ name, ...props }, ref) {
  const [checked, setChecked] = useState(props.checked);

  return (
    <label htmlFor={name} className='relative block'>
      <svg
        width='16'
        height='16'
        viewBox='0 0 16 16'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='pointer-events-none'
      >
        <g clipPath='url(#clip0_335_724)'>
          <path
            d='M4 0.75H12C13.7949 0.75 15.25 2.20507 15.25 4V12C15.25 13.7949 13.7949 15.25 12 15.25H4C2.20507 15.25 0.75 13.7949 0.75 12V4C0.75 2.20507 2.20507 0.75 4 0.75Z'
            className={`${
              checked ? 'stroke-primary-red fill-primary-red' : 'stroke-black fill-transparent'
            } transition-colors ease-out duration-300`}
            strokeWidth='1.5'
          />
          <path
            d='M12 5L6.5 10.5L4 8'
            className={`stroke-neutral-white ${
              checked ? 'opacity-100' : 'opacity-0'
            } transition-opacity ease-out duration-300`}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </g>
        <defs>
          <clipPath id='clip0_335_724'>
            <rect width='16' height='16' fill='white' />
          </clipPath>
        </defs>
      </svg>

      <input
        {...props}
        name={name}
        type='checkbox'
        onChange={(e) => {
          setChecked(e.currentTarget.checked);
          props.onChange(e);
        }}
        ref={ref}
        className='absolute top-0 left-0 w-full h-full opacity-0'
      />
    </label>
  );
});

export default Checkbox;

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
