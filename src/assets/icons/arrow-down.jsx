import PropTypes from 'prop-types';

export default function IconArrowDown({ strokeColor }) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6 9L12 15L18 9'
        stroke={strokeColor || '#373435'}
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

IconArrowDown.propTypes = {
  strokeColor: PropTypes.string,
};
