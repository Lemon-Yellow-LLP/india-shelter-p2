import { useState } from 'react';
import ImageUpload from '../../../../components/ImageUpload';

const UploadDocuments = () => {
  const [files, setFile] = useState([]);
  const labelClassName = 'mb-2 text-lg font-medium text-gray-900';

  return (
    <div>
      <div>
        {/* <label htmlFor='image' className={labelClassName}>
          Gig Images
        </label> */}
        <div>
          <ImageUpload files={files} setFile={setFile} />
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
