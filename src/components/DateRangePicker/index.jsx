import moment from 'moment';
import { useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { IconCalendar } from '../../assets/icons';

export default function DateRangePicker({ selectionRange, setSelectionRange }) {
  // const [selectionRange, setSelectionRange] = useState({
  //   startDate: moment().startOf('month'),
  //   endDate: moment().endOf('month'),
  //   key: 'selection',
  // });
  const [open, setOpen] = useState(false);

  return (
    <div
      className='relative'
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <button
        className='flex h-8 justify-center items-center px-2 py-1 border border-lighter-grey bg-[#FEFEFE] rounded-lg'
        onClick={() => setOpen(!open)}
      >
        <div className='mr-[2px]'>
          <IconCalendar className='w-4 h-4' />
        </div>
        <span className='overflow-hidden text-center text-xs not-italic font-normal text-dark-grey'>{`${moment(
          selectionRange.startDate,
        ).format('DD/MM/YYYY')}-${moment(selectionRange.endDate).format('DD/MM/YYYY')}`}</span>
      </button>

      {open ? (
        <DateRange
          onRangeFocusChange={() => console.log('range')}
          ranges={[selectionRange]}
          onChange={({ selection }) => setSelectionRange(selection)}
          rangeColors={['#E33439', '#147257']}
          maxDate={new Date()}
          className='absolute left-0 -translate-x-48 z-[99] bg-white border border-light-grey border-opacity-20 px-5 shadow-calendar rounded-lg'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setOpen(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}
