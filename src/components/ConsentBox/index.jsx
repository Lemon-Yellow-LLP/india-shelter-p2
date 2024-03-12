import { useEffect, useState } from 'react';
import Checkbox from '../Checkbox';
import Audio from '../Audio/index';
import LanguageDropDown from '../DropDown/LanguageDropDown';
import PropTypes from 'prop-types';
import consentEnglishAudioFile from '../../assets/audio/consent.m4a';

const consentInMultipleLanguage = [
  {
    language: 'english',
    description:
      'I hereby consent to provide my Aadhaar Number and One Time Pin adhaar based authentication for the purpose of establishing my identity and providing demographic details for the loan application. I have no objection in authenticating myself and fully understand that information provided by me shall be used for authenticating my identity through Aadhaar Authentication System for the purpose stated above and no other purpose',
    audioFile: consentEnglishAudioFile,
  },
];

const ConsentBox = ({ isChecked, setIsChecked, updateConsent, disabled }) => {
  const [seeMore, setSeeMore] = useState(false);
  const [language, setLanguage] = useState('english');
  const [consent, setConsent] = useState(
    consentInMultipleLanguage.find((info) => info.language === language),
  );

  useEffect(() => {
    const filteredConsent = consentInMultipleLanguage.find((info) => info.language === language);
    updateConsent(filteredConsent.description);
    setConsent(filteredConsent);
  }, [language]);

  const languageOptions = [
    {
      label: 'English',
      value: 'english',
    },
  ];

  return (
    <div>
      <div className='mb-3 flex justify-between items-center'>
        <p className='font-medium'>Consent</p>
        <LanguageDropDown
          options={languageOptions}
          defaultSelected={language}
          onChange={(language) => setLanguage(language)}
        />
      </div>
      <div className='border border-[##E8E8E8] p-3 rounded-lg'>
        <div className='flex mb-4'>
          <Checkbox
            isLarge
            name='consent'
            checked={isChecked}
            onTouchEnd={() => !disabled && setIsChecked(!isChecked)}
          />
          <div className='ml-2'>
            <p className={`${!seeMore ? 'line-clamp-2' : ''}  text-dark-grey text-xs`}>
              {consent.description}{' '}
            </p>
            <button
              className='text-primary-black font-semibold text-xs'
              onClick={() => setSeeMore(!seeMore)}
            >
              {seeMore ? 'show less' : 'see more...'}
            </button>
          </div>
        </div>
        <Audio
          label='Listen audio'
          hint='To proceed further, kindly listen to the entire audio'
          audioFile={consent.audioFile}
        />
      </div>
    </div>
  );
};

export default ConsentBox;

ConsentBox.propTypes = {
  isChecked: PropTypes.bool,
  setIsChecked: PropTypes.func,
  updateConsent: PropTypes.func,
  disabled: PropTypes.bool,
};
