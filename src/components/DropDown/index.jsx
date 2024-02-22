/* eslint-disable react/display-name */
import { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IconDownArrow, IconTick } from '../../assets/icons';

const DropDown = memo(
  ({
    defaultSelected,
    placeholder,
    label,
    required,
    options,
    onChange,
    optionsMaxHeight,
    disabled,
    showIcon = true,
    inputClasses,
    error,
    touched,
    onBlur,
    disableOption,
    disabledError,
    labelClassName,
    styles,
    resetDefaultSelected,
    ...props
  }) => {
    const [showDropDown, setShowDropDown] = useState(false);
    const [selectedOption, setSelectedOption] = useState(() =>
      options?.find((option) => defaultSelected === option?.value),
    );
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    useEffect(() => {
      function handleWindowResize() {
        setInnerWidth(window.innerWidth);
      }
      window.addEventListener('resize', handleWindowResize);
      return () => window.removeEventListener('resize', handleWindowResize);
    }, []);

    useEffect(() => {
      const option = options.find((option) => option?.value === defaultSelected);
      setSelectedOption(option);
    }, [defaultSelected, options, resetDefaultSelected]);

    const containerRef = useRef(null);

    const handleSelect = useCallback(
      (option) => {
        setSelectedOption(option);
        setShowDropDown(false);
        onChange && onChange(option?.value);
      },
      [onChange],
    );

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setShowDropDown(false);
        }
      };
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, []);

    const getThemes = () => {
      if (error && touched) {
        return 'border-primary-red shadow-primary-red shadow-primary';
      } else if (selectedOption) {
        return 'border-dark-grey text-primary-black';
      } else {
        return 'border-stroke text-light-grey';
      }
    };

    return (
      <div ref={containerRef} className={`dropdown relative ${inputClasses}`}>
        <h3 className={`flex gap-0.5 text-primary-black ${labelClassName}`}>
          {label}
          {required && <span className='text-primary-red text-sm'>*</span>}
        </h3>
        <button
          disabled={disabled}
          title='Show options'
          type='button'
          onClick={() => {
            setShowDropDown(!showDropDown);
          }}
          {...props}
          onBlur={onBlur}
          onMouseLeave={innerWidth < '1024' ? onBlur : null} // For Iphone (if opens on desktop don't run onMouseLeave)
          className={`${getThemes()} ${
            styles ? styles : 'py-3 px-4 rounded-lg'
          } w-full flex justify-between gap-1 border-x border-y mt-1 bg-white disabled:bg-disabled-grey`}
        >
          {selectedOption ? selectedOption.label : placeholder || props.value}{' '}
          <IconDownArrow width={styles ? 16 : 24} height={styles ? 16 : 24} cssClasses='ml-auto' />
        </button>
        {showDropDown && (
          <div
            style={{
              maxHeight: optionsMaxHeight ?? 170,
            }}
            className='rounded-lg bg-white shadow-secondary p-2 mt-2 absolute top-100 w-full overflow-y-auto z-20 border border-stroke'
          >
            {options.map((option, index) => {
              let optionClasses = `${
                styles ? 'text-sm py-2.5 px-3' : 'text-base py-3 px-4'
              }  flex justify-between w-full overflow-y-auto transition-colors duration-300 ease-out opacity-100
                  ${index ? 'border-t border-stroke' : 'border-none'}
                `;

              if (option?.value === selectedOption?.value)
                optionClasses = `${optionClasses} text-primary-red`;
              else if (option?.disabled) {
                optionClasses = `${optionClasses} pointer-events-none`;
              }

              return (
                disableOption !== option?.value && (
                  <button
                    key={option?.value}
                    onClick={() => handleSelect(option)}
                    className={optionClasses}
                  >
                    <div className={option?.disabled && 'opacity-20'}>{option?.label}</div>
                    {showIcon && selectedOption?.value === option.value ? (
                      <IconTick width={styles ? 16 : 24} height={styles ? 16 : 24} />
                    ) : (
                      <div></div>
                    )}
                  </button>
                )
              );
            })}
          </div>
        )}
        {!disabledError ? (
          <span className='text-xs text-primary-red mt-1'>
            {error && touched ? error : String.fromCharCode(160)}
          </span>
        ) : null}
      </div>
    );
  },
);

DropDown.propTypes = {
  defaultSelected: PropTypes.any,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.any, value: PropTypes.any })),
  onChange: PropTypes.func,
  optionsMaxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  inputClasses: PropTypes.any,
  error: PropTypes.any,
  touched: PropTypes.any,
  onBlur: PropTypes.any,
  disableOption: PropTypes.any,
  disabledError: PropTypes.any,
  labelClassName: PropTypes.any,
};

export default DropDown;
