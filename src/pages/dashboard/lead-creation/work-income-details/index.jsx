import { professionOptions } from '../utils';
import CardRadio from '../../../../components/CardRadio';
import { memo, useCallback, useContext } from 'react';
import { AuthContext } from '../../../../context/AuthContext';
import Salarid from './Salarid';
import SelfEmployed from './SelfEmployed';

const WorkIncomeDetails = () => {
  const { values, setValues } = useContext(AuthContext);

  const handleModeChange = useCallback((e) => {
    let newData = values;
    newData.profession = e;
    setValues(newData);
  }, []);

  return (
    <div className='flex flex-col gap-2 h-[95vh] overflow-auto max-[480px]:no-scrollbar p-[20px] h-[100vh] pb-[62px]'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='loan-purpose' className='flex gap-0.5 font-medium text-black'>
          Profession <span className='text-primary-red text-xs'>*</span>
        </label>
        <div className={`flex gap-4 w-full`}>
          {professionOptions.map((option) => {
            return (
              <CardRadio
                key={option.value}
                label={option.label}
                name='profession'
                value={option.value}
                current={values.profession}
                onChange={handleModeChange}
                containerClasses='flex-1'
              >
                {option.icon}
              </CardRadio>
            );
          })}
        </div>
      </div>
      {values.profession === 'Salarid' && <Salarid />}
      {values.profession === 'SelfEmployed' && <SelfEmployed />}
    </div>
  );
};

export default WorkIncomeDetails;
