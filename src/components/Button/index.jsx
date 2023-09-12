/* eslint-disable react/display-name */
import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const Button = memo(({ primary, children, inputClasses, link, disabled, ...props }) => {
  return (
    <Link
      to={disabled ? null : link}
      className={`p-2 md:py-3 text-base md:text-lg rounded md:w-64 flex justify-center items-center ${inputClasses}
      ${null} ${
        primary
          ? disabled
            ? 'bg-light-red border-light-red pointer-events-none text-white'
            : 'bg-primary-red border border-primary-red text-white disabled:bg-light-red disabled:border-light-red'
          : 'bg-neutral-white border border-primary-red text-primary-red disabled:text-light-red'
      } transition-colors ease-out duration-300 `}
      {...props}
    >
      {children}
    </Link>
  );
});

export default Button;

Button.propTypes = {
  primary: PropTypes.bool,
  children: PropTypes.elementType,
  inputClasses: PropTypes.string,
};
