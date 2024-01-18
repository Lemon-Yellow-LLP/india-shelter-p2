import { useState } from 'react';
import { Button, TextInput } from '../components';

const data = [
  {
    itrust: '12345',
    cname: 'Chitra Gupta',
    cnumber: '9810482034',
    empId: '0991039',
    empName: 'Suresh Ramji',
    empBranch: '89183401844',
  },
  {
    itrust: '12346',
    cname: 'Chitra second',
    cnumber: '9810482034',
    empId: '0991039',
    empName: 'Suresh Ramji',
    empBranch: '89183401844',
  },
  {
    itrust: '12347',
    cname: 'Chitra third',
    cnumber: '9810482034',
    empId: '0991039',
    empName: 'Suresh Ramji',
    empBranch: '89183401844',
  },
  {
    itrust: '123489',
    cname: 'Chitra fourth',
    cnumber: '9810482034',
    empId: '0991039',
    empName: 'Suresh Ramji',
    empBranch: '89183401844',
  },
];

export default function CaseAssigning() {
  const [trustId, setTrustId] = useState(null);
  const [leadInfo, setLeadInfo] = useState(null);
  const [assignLoId, setAssignLoId] = useState(null);
  const [assignLoIdError, setAssignLoIdError] = useState('');
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [disableAssignLo, setDisableAssignLo] = useState(true);
  const [trustIdError, setTrustIdError] = useState('');

  const handleSearchTrustId = () => {
    const leadDetails = data.find((lead) => lead.itrust === trustId);
    setTimeout(() => {
      if (leadDetails) {
        setLeadInfo(leadDetails);
        setDisableAssignLo(false);
        setTrustIdError('');
      } else {
        setLeadInfo(null);
        setTrustIdError('Enter a valid iTrust ID');
        setDisableAssignLo(true);
      }
    }, 2000);
  };

  const handleAssignLo = () => {
    setTimeout(() => {
      if (assignLoId === '12345') {
        alert('open modal');
        setAssignLoIdError('');
      } else {
        setAssignLoIdError('Enter a valid LO ID');
      }
    }, 2000);
  };

  return (
    <div className=' grow flex justify-center pt-6 bg-[#F7F7F8]'>
      <div>
        <div className='py-3 px-4 bg-neutral-white rounded-lg mb-4'>
          <div className='gap-2 flex items-center mb-2'>
            <TextInput
              label='iTrust ID'
              required
              inputClasses='w-[393px]'
              error={trustIdError}
              touched
              value={trustId}
              onChange={(e) => {
                setTrustId(e.target.value);
                if (e.target.value.length) {
                  setConfirmDisabled(false);
                } else {
                  setConfirmDisabled(true);
                }
              }}
            />
            <Button
              primary
              disabled={confirmDisabled}
              inputClasses='md:!text-base md:w-auto md:px-3.5 rounded-lg mt-1.5'
              onClick={handleSearchTrustId}
            >
              Confirm
            </Button>
          </div>
          {leadInfo && (
            <>
              <div className='text-primary-black'>
                <h4 className='mb-3'>CUSTOMER DETAILS</h4>
                <div className='flex text-sm mb-2'>
                  <p className='flex-1 text-dark-grey'>Name</p>
                  <p className='flex-1'>{leadInfo.cname}</p>
                </div>
                <div className='flex text-sm'>
                  <p className='flex-1 text-dark-grey'>Mobile Number</p>
                  <p className='flex-1'>{leadInfo.cnumber}</p>
                </div>
              </div>
              <hr className='my-3' />
              <div>
                <h4 className='mb-3'>LOAN OFFICER DETAILS</h4>
                <div className='flex text-sm mb-2'>
                  <p className='flex-1 text-dark-grey'>Emp ID</p>
                  <p className='flex-1'>{leadInfo.empId}</p>
                </div>
                <div className='flex text-sm mb-2'>
                  <p className='flex-1 text-dark-grey'>Name</p>
                  <p className='flex-1'>{leadInfo.empName}</p>
                </div>
                <div className='flex text-sm'>
                  <p className='flex-1 text-dark-grey'>Branch</p>
                  <p className='flex-1'>{leadInfo.empBranch}</p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='py-3 px-4 bg-neutral-white rounded-lg'>
          <TextInput
            label='Assinging LO ID'
            required
            labelDisabled={disableAssignLo}
            disabled={disableAssignLo}
            touched
            value={assignLoId}
            error={assignLoIdError}
            onChange={(e) => {
              setAssignLoId(e.target.value);
            }}
          />
        </div>
        <div className='flex mt-8 gap-6'>
          <Button>Cancel</Button>
          <Button primary disabled={disableAssignLo} onClick={handleAssignLo}>
            Assign LO
          </Button>
        </div>
      </div>
    </div>
  );
}
