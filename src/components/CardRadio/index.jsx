/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import PropTypes from 'prop-types';
import { memo } from 'react';

const CardRadio = memo(({ label, current, children, value, onChange, name }) => {
  return (
    <div className={`flex flex-col gap-2 w-full cursor-pointer mb-[10px]`}>
      <div
        className={`w-full border rounded-lg py-4 flex items-center justify-center cursor-pointer 
        ${
          current === value
            ? 'bg-light-green border-secondary-green stroke-secondary-green fill-[#147257]'
            : 'bg-white border-stroke stroke-light-grey hover:bg-grey-white fill-red'
        } transition-all duration-300 ease-out`}
        tabIndex={0}
        role='radio'
        aria-checked={current === value}
        onClick={() => onChange({ value, name })}
        onTouchStart={() => onChange({ value, name })}
      >
        {children}
      </div>

      {label && (
        <div
          className={`text-center text-xs  leading-normal
        ${
          current === value
            ? 'text-secondary-green font-semibold'
            : 'text-primary-black font-normal'
        } transition-colors ease-out duration-300
        `}
        >
          {label}
        </div>
      )}
    </div>
  );
});

CardRadio.propTypes = {
  label: PropTypes.string,
  current: PropTypes.string,
  children: PropTypes.element,
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  containerClasses: PropTypes.string,
};

export default CardRadio;
