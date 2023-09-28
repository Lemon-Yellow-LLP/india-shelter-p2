import { useState } from 'react';
import ImageUpload from '../../../../components/ImageUpload';
import PdfAndImageUpload from '../../../../components/PdfAndImageUpload';
import PhotoUpload from '../../../../components/PhotoUpload';

const UploadDocuments = () => {
  const [customerPhotos, setCustomerPhotos] = useState([]);
  const [idProofPhotos, setIdProofPhotos] = useState([]);
  const [addressProofPhotos, setAddressProofPhotos] = useState([]);
  const [propertyPapers, setPropertyPapers] = useState([]);
  const [salarySlipPhotos, setSalarySlipPhotos] = useState([]);
  const [form60photos, setForm60photos] = useState([]);
  const [propertyPhotos, setPropertyPhotos] = useState([]);
  const [selfie, setSelfie] = useState([]);
  const [docs, setDocs] = useState([]);
  // const labelClassName = 'mb-2 text-lg font-medium text-gray-900';

  return (
    <div className='p-4 flex flex-col gap-9 bg-medium-grey'>
      <PhotoUpload
        files={customerPhotos}
        setFile={setCustomerPhotos}
        label='Customer photo'
        required
      />

      <ImageUpload
        files={idProofPhotos}
        setFile={setIdProofPhotos}
        label='ID proof'
        required
        hint='File size should be less than 5MB'
      />

      <ImageUpload
        files={addressProofPhotos}
        setFile={setAddressProofPhotos}
        label='Address proof'
        required
        hint='File size should be less than 5MB'
      />

      <PdfAndImageUpload
        files={propertyPapers}
        setFile={setPropertyPapers}
        label='Property papers'
        required
        hint='File size should be less than 5MB'
      />

      <ImageUpload
        files={salarySlipPhotos}
        setFile={setSalarySlipPhotos}
        label='Salary slip'
        required
        hint='File size should be less than 5MB'
      />

      <ImageUpload
        files={form60photos}
        setFile={setForm60photos}
        label='Form 60'
        required
        hint='File size should be less than 5MB'
      />

      <ImageUpload
        files={propertyPhotos}
        setFile={setPropertyPhotos}
        label='Property image'
        required
        hint='File size should be less than 5MB'
      />

      <PhotoUpload files={selfie} setFile={setSelfie} label='Upload selfie' required />

      <ImageUpload
        files={docs}
        setFile={setDocs}
        label='Other documents'
        required
        hint='File size should be less than 5MB'
      />
    </div>
  );
};

export default UploadDocuments;
