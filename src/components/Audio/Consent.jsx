import { useState } from 'react';
import Checkbox from '../Checkbox';
import Audio from './index';
import DropDown from '../DropDown';
import LanguageDropDown from '../DropDown/LanguageDropDown';

const Consent = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [language, setLanguage] = useState('english');

  const languageOptions = [
    {
      label: 'English',
      value: 'english',
    },
    {
      label: 'Hindi',
      value: 'hindi',
    },
    {
      label: 'Marathi',
      value: 'marathi',
    },
  ];
  return (
    <div className='p-4'>
      <div className='mb-3 flex justify-between items-center'>
        <p className='font-medium'>Consent</p>
        <LanguageDropDown options={languageOptions} defaultSelected={language} />
      </div>
      <div className='border border-[##E8E8E8] p-3 rounded-lg'>
        <div className='flex mb-4'>
          <Checkbox
            isLarge
            name='consent'
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <span className='text-xs text-dark-grey ml-2'>
            I hereby consent to provide my Aadhaar Number and One Time Pin{' '}
            {seeMore &&
              `adhaar based
              authentication for the purpose of establishing my identity and providing demographic
              details for the loan application. I have no objection in authenticating myself and fully
              understand that information provided by me shall be used for authenticating my identity
              through Aadhaar Authentication System for the purpose stated above and no other purpose.${' '}`}
            <button
              className='text-primary-black font-semibold'
              onClick={() => setSeeMore(!seeMore)}
            >
              {seeMore ? 'show less' : 'see more...'}
            </button>
          </span>
        </div>
        <Audio
          label='Listen audio'
          hint='To proceed further, kindly listen to the entire audio'
          audioFile='src/assets/audio/consent.m4a'
        />
      </div>
    </div>
  );
};

export default Consent;
