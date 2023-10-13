import Lottie from 'react-lottie-player';
import LoaderAnimation from '../../assets/anim/Loader.json';
import PropTypes from 'prop-types';

const LoaderDynamicText = ({ extraClasses, text, textColor }) => {
  return (
    <div className={`w-full h-screen ${extraClasses}`}>
      <div className='flex flex-col justify-center items-center gap-4 w-full h-full'>
        <Lottie animationData={LoaderAnimation} loop play className='w-[84px] h-[60px]' />
        <p className={`font-semibold text-[${textColor}] text-base`}>{text}</p>
      </div>
    </div>
  );
};

export default LoaderDynamicText;

LoaderDynamicText.propTypes = {
  extraClasses: PropTypes.string,
};
