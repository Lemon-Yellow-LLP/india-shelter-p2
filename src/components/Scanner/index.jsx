import PropTypes from 'prop-types';
import React from 'react';
import Lottie from 'react-lottie-player';

const Scanner = ({ animationFile, message }) => {
  return (
    <div className='flex flex-col gap-4 justify-center items-center'>
      <Lottie animationData={animationFile} play />
      <p className='text-primary-black font-normal text-center'>{message}</p>
    </div>
  );
};

Scanner.propTypes = {
  animationFile: PropTypes.any.isRequired,
  message: PropTypes.string.isRequired,
};

export default Scanner;
