import indiaShelterLogo from '../../assets/logo.svg';

const Header = ({ children }) => {
  return (
    <div className='px-4 py-4 bg-neutral-white w-full border-b border-[#ECECEC] flex'>
      <img
        style={{ width: '100px', height: '24.64px' }}
        src={indiaShelterLogo}
        alt='India Shelter'
      />

      {children}
    </div>
  );
};

export default Header;
