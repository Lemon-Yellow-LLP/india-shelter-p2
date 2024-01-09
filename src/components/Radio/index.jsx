import PropTypes from 'prop-types';

const Radio = ({ label, value, current, onChange }) => {
  return (
    <div className='flex gap-3 justify-center items-center'>
      <div
        type='radio'
        className={`${
          current === value ? 'border-red-600' : 'border-black'
        }  border-x border-y w-6 h-6 rounded-full flex justify-center items-center`}
        onTouchStart={() => {
          onChange({ value, label });
        }}
      >
        <span className={`rounded-full w-4 h-4 ${current === value ? ' bg-red-600' : ''}`}></span>
      </div>
      <label className='text-base font-normal text-primary-black'>{label}</label>
    </div>
  );
};

Radio.PropTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  current: PropTypes.string,
  onChange: PropTypes.func,
  containerClasses: PropTypes.string,
};

export default Radio;
