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
    <div>
      <div className='p-4 flex flex-col gap-9'>
        <PhotoUpload
          files={customerPhotos}
          setFile={setCustomerPhotos}
          label='Customer photo'
          required
        />

        <ImageUpload files={idProofPhotos} setFile={setIdProofPhotos} label='ID proof' required />

        <ImageUpload
          files={addressProofPhotos}
          setFile={setAddressProofPhotos}
          label='Address proof'
          required
        />

        <PdfAndImageUpload
          files={propertyPapers}
          setFile={setPropertyPapers}
          label='Property papers'
          required
        />

        <ImageUpload
          files={salarySlipPhotos}
          setFile={setSalarySlipPhotos}
          label='Salary slip'
          required
        />

        <ImageUpload files={form60photos} setFile={setForm60photos} label='Form 60' required />

        <ImageUpload
          files={propertyPhotos}
          setFile={setPropertyPhotos}
          label='Property image'
          required
        />

        <PhotoUpload files={selfie} setFile={setSelfie} label='Upload selfie' required />

        <ImageUpload files={docs} setFile={setDocs} label='Other documents' required />
      </div>
    </div>
  );
};

export default UploadDocuments;
