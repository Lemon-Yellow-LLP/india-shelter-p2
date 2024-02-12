import { useState } from 'react';
import Button from '../Button';
import Searchbox from '../Searchbox.jsx';
import PropTypes from 'prop-types';

export default function AdminHeader({
  title,
  showSearch,
  showButton,
  buttonText,
  handleButtonClick,
}) {
  const [query, setQuery] = useState('');

  return (
    <div className='p-6 border-b border-lighter-grey flex justify-between items-center'>
      <h2>{title}</h2>
      <div className='flex gap-4 items-center'>
        {showSearch && <Searchbox query={query} setQuery={setQuery} />}
        {showButton && (
          <Button
            inputClasses='md:!py-2.5 px-5 md:w-auto md:text-base'
            primary
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}

AdminHeader.propTypes = {
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  handleButtonClick: PropTypes.func,
};
