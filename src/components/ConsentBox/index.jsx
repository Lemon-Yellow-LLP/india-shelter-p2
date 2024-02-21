import { useEffect, useState } from 'react';
import Checkbox from '../Checkbox';
import Audio from '../Audio/index';
import LanguageDropDown from '../DropDown/LanguageDropDown';

const consentInMultipleLanguage = [
  {
    language: 'english',
    description:
      'I hereby consent to provide my Aadhaar Number and One Time Pin adhaar based authentication for the purpose of establishing my identity and providing demographic details for the loan application. I have no objection in authenticating myself and fully understand that information provided by me shall be used for authenticating my identity through Aadhaar Authentication System for the purpose stated above and no other purpose',
    audioFile: 'src/assets/audio/consent.m4a',
  },
  {
    language: 'hindi',
    description:
      'मैं अपनी पहचान स्थापित करने और ऋण आवेदन के लिए जनसांख्यिकीय विवरण प्रदान करने के उद्देश्य से अपना आधार नंबर और वन टाइम पिन आधार आधारित प्रमाणीकरण प्रदान करने के लिए सहमति देता हूं। मुझे खुद को प्रमाणित करने में कोई आपत्ति नहीं है और मैं पूरी तरह से समझता हूं कि मेरे द्वारा प्रदान की गई जानकारी का उपयोग आधार प्रमाणीकरण प्रणाली के माध्यम से मेरी पहचान को प्रमाणित करने के लिए ऊपर बताए गए उद्देश्य के लिए किया जाएगा और किसी अन्य उद्देश्य के लिए नहीं किया जाएगा।',
    audioFile: 'src/assets/audio/consent.m4a',
  },
  {
    language: 'marathi',
    description:
      'माझी ओळख प्रस्थापित करण्याच्या उद्देशाने आणि कर्जाच्या अर्जासाठी लोकसंख्याशास्त्रीय तपशील प्रदान करण्याच्या उद्देशाने माझा आधार क्रमांक आणि वन टाइम पिन आधार आधारीत प्रमाणीकरण प्रदान करण्यास मी याद्वारे संमती देतो. मला स्वत:चे प्रमाणीकरण करण्यास कोणताही आक्षेप नाही आणि मला पूर्णपणे समजले आहे की माझ्याद्वारे प्रदान केलेली माहिती वर नमूद केलेल्या उद्देशासाठी आधार प्रमाणीकरण प्रणालीद्वारे माझी ओळख प्रमाणित करण्यासाठी वापरली जाईल आणि इतर कोणत्याही हेतूसाठी नाही.',
    audioFile: 'src/assets/audio/consent.m4a',
  },
];

const ConsentBox = () => {
  const [seeMore, setSeeMore] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [language, setLanguage] = useState('english');
  const [consent, setConsent] = useState(
    consentInMultipleLanguage.find((info) => info.language === language),
  );

  useEffect(() => {
    const filteredConsent = consentInMultipleLanguage.find((info) => info.language === language);
    setConsent(filteredConsent);
  }, [language]);

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
            onChange={() => setIsChecked(!isChecked)}
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
