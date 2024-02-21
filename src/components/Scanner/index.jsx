import PropTypes from 'prop-types';
import React from 'react';

const Scanner = ({ children, message }) => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
      {children}
      <p className='text-primary-black font-normal text-center'>{message}</p>
    </div>
  );
};

Scanner.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string.isRequired,
};

export default Scanner;
