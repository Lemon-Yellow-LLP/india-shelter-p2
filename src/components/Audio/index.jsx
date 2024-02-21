/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';

const Audio = ({ label, hint, audioFile }) => {
  return (
    <div>
      {label && (
        <h3 className='text-sm mb-1'>
          {label} <span className='text-primary-red'>*</span>
        </h3>
      )}
      {hint && <p className='text-xs text-light-grey mb-2'>{hint}</p>}
      <audio controls controlsList='nodownload noplaybackrate' className='w-full'>
        <source src={audioFile} type='audio/x-m4a' />
      </audio>
    </div>
  );
};

Audio.propTypes = {
  label: PropTypes.string,
  hint: PropTypes.string,
  audioFile: PropTypes.string,
};

export default Audio;
