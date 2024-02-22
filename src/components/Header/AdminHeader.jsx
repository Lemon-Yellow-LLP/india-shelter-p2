import Button from '../Button';
import Searchbox from '../Searchbox.jsx';
import PropTypes from 'prop-types';

export default function AdminHeader({
  title,
  query,
  setQuery,
  handleSearch,
  handleResetSearch,
  showSearch,
  showButton,
  buttonText,
  prompt,
  handleButtonClick,
}) {
  return (
    <div className='p-6 border-b border-lighter-grey flex justify-between items-center'>
      <h2>{title}</h2>
      <div className='flex gap-4 items-center'>
        {showSearch && (
          <Searchbox
            query={query}
            setQuery={setQuery}
            handleSubmit={handleSearch}
            handleReset={handleResetSearch}
            inputClasses='w-[340px]'
            prompt={prompt}
          />
        )}
        {showButton && (
          <Button
            inputClasses='h-12 md:!py-2.5 px-5 md:w-auto md:!text-base'
            primary
            onClick={handleButtonClick}
          >
            + &nbsp;{buttonText}
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
