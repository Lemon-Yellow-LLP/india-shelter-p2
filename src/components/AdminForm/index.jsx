import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { IconAdminFormClose } from '../../assets/icons';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 12,
};

export default function AdminForm({ isFormOpen, setIsFormOpen }) {
  const handleClose = () => setIsFormOpen(false);
  return (
    <Modal
      open={true}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableBackdropClick
    >
      <Box sx={style}>
        <div className='py-4 px-6 flex justify-between'>
          <div>
            <p className='text-lg font-medium'>Add user</p>
            <p>{true ? 'Created on' : 'Modified on'}: Today</p>
          </div>
          <IconAdminFormClose />
        </div>
      </Box>
    </Modal>
  );
}

AdminForm.propTypes = {
  isFormOpen: PropTypes.bool,
  setIsFormOpen: PropTypes.bool,
};
