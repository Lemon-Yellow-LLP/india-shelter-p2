/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, useRef } from 'react';
import DesktopPopUp from '../UploadDocsModal';
import loading from '../../assets/icons/loading.svg';
import { editDoc, editFieldsById, getApplicantById } from '../../global';
import { LeadContext } from '../../context/LeadContextProvider';
import { AuthContext } from '../../context/AuthContextProvider';
import imageCompression from 'browser-image-compression';
import generateImageWithTextWatermark from '../../utils/GenerateImageWithTextWatermark';

const AdminFormImageUpload = ({
  // eslint-disable-next-line react/prop-types
  files,
  setFile,
  setSingleFile,
  upload,
  setUploads,
  setEdit,
  label,
  hint,
  errorMessage,
  message,
  setMessage,
  loader,
  setLoader,
  ...props
}) => {
  const { token, loAllDetails } = useContext(AuthContext);
  const { values, activeIndex } = useContext(LeadContext);

  const [show, setShow] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const replacePhotoInputRef = useRef();
  const handleFile = async (e) => {
    setMessage('');
    setLoader(true);
    console.log(e.target.files[0]);
    const success = async () => {
      let file = e.target.files;
      if (file.length !== 0) {
        const fileType = file[0]['type'];

        const validImageTypes = ['image/jpg', 'image/png', 'image/jpeg'];

        const filename = file[0].name;

        if (validImageTypes.includes(fileType)) {
          const options = {
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(file[0], options);
          const compressedImageFile = new File([compressedFile], filename, {
            type: compressedFile.type,
          });
          setFile([compressedImageFile]);
        } else {
          setLoader(false);
          setMessage('File format not supported');
        }
      } else {
        setLoader(false);
      }
    };
    success();
  };

  const editImage = async (e, id) => {
    setMessage('');
    setLoader(true);

    async function success(data) {
      setLatLong({
        lat: data.coords.latitude,
        long: data.coords.longitude,
      });

      let file = e.target.files;

      if (file.length !== 0) {
        for (let i = 0; i < file.length; i++) {
          const fileType = file[i]['type'];

          const validImageTypes = ['image/jpeg'];

          const filename = file[i].name;

          if (validImageTypes.includes(fileType)) {
            await generateImageWithTextWatermark(
              values?.lead?.id,
              loAllDetails?.employee_code,
              loAllDetails?.first_name,
              loAllDetails?.middle_name,
              loAllDetails?.last_name,
              data.coords.latitude,
              data.coords.longitude,
              file[i],
            )
              .then(async (image) => {
                if (image?.fileSize > 5000000) {
                  const options = {
                    maxSizeMB: 4,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                  };
                  const compressedFile = await imageCompression(image, options);
                  const compressedImageFile = new File([compressedFile], filename, {
                    type: compressedFile.type,
                  });
                  setEdit({
                    file: compressedImageFile,
                    id: id,
                  });
                  setFile([...files, compressedImageFile]);
                } else {
                  setEdit({
                    file: image,
                    id: id,
                  });
                  setFile([...files, image]);
                }

                // const compressedFile = await imageCompression(file[i], options);
                // const compressedImageFile = new File([compressedFile], filename, {
                //   type: compressedFile.type,
                // });
                // if (compressedImageFile.size <= 5000000) {
                //   setEdit({
                //     file: compressedImageFile,
                //     id: id,
                //   });
                //   setFile([...files, compressedImageFile]);
                // } else {
                //   setLoader(false);
                //   setMessage('File size should be less than 5MB');
                // }
              })
              .catch((err) => {
                setLoader(false);
                setMessage('Error loading image');
              });
          } else {
            setLoader(false);
            setMessage('File format not supported');
          }
        }
      } else {
        setLoader(false);
      }
    }

    let userLocation = navigator.geolocation;
    if (userLocation) {
      userLocation.getCurrentPosition(success, (error) => {
        setLoader(false);
        setMessage('Location is not enabled');
        return;
      });
    } else {
      ('The geolocation API is not supported by your browser.');
    }
  };

  async function removeImage(id) {
    const type = upload.type;

    setFile(files.filter((x) => x.name !== id));

    await editDoc(
      id,
      { active: false },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const applicant = await getApplicantById(
      values?.applicants?.[activeIndex]?.applicant_details?.id,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const document_meta = applicant.document_meta;

    const photos = applicant.document_meta[type];

    const edited_photos = photos.filter((paper) => {
      return paper.id !== id;
    });

    const photo = photos.find((paper) => {
      return paper.id === id;
    });

    const edited_photo = { ...photo, active: false };

    const edited_applicant = [...edited_photos, edited_photo];

    const new_edited_applicant = await editFieldsById(
      values?.applicants?.[activeIndex]?.applicant_details?.id,
      'applicant',
      {
        document_meta: { ...document_meta, [type]: edited_applicant },
      },
      {
        headers: {
          Authorization: token,
        },
      },
    );

    const edited_type = new_edited_applicant.document_meta[type];

    const active_id_proofs = edited_type.filter((data) => {
      return (
        data.active === true &&
        data.document_type == values?.applicants?.[activeIndex]?.personal_details?.id_type
      );
    });

    const active_address_proofs = edited_type.filter((data) => {
      return (
        data.active === true &&
        data.document_type ==
          values?.applicants?.[activeIndex]?.personal_details?.selected_address_proof
      );
    });

    if (active_id_proofs.length !== 0) {
      if (active_id_proofs.length === 0) {
        setUploads(null);
        setFile([]);
      } else {
        setUploads({ type: [type], data: active_id_proofs });
      }
    } else if (active_address_proofs.length !== 0) {
      if (active_address_proofs.length === 0) {
        setUploads(null);
        setFile([]);
      } else {
        setUploads({ type: [type], data: active_address_proofs });
      }
    } else {
      const active_uploads = edited_type.filter((data) => {
        return data.active === true;
      });

      if (active_uploads.length === 0) {
        setUploads(null);
        setFile([]);
      } else {
        setUploads({ type: [type], data: active_uploads });
      }
    }
  }

  useEffect(() => {
    upload && setLoader(false);
  }, [upload]);
  console.log(upload, 'upload inside of adminImageUpload');
  return (
    <div className='w-full'>
      <label className='flex gap-0.5 items-center text-primary-black font-medium'>
        {label}
        {props.required && <span className='text-primary-red text-sm'>*</span>}
      </label>

      {hint && (
        <span
          className='mb-1 text-light-grey text-xs font-normal'
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        />
      )}

      {!files?.length && !loader ? (
        <div>
          <div className='bg-white flex items-center justify-center w-full'>
            <label
              className={`flex cursor-pointer flex-col w-full border ${
                message || errorMessage ? 'border-primary-red' : 'border-stroke'
              } rounded-md relative`}
            >
              <div className='flex flex-col items-center py-5'>
                <svg
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.4038 19.4556H17.3641C19.6371 19.4556 21.295 16.9323 21.295 14.8053C21.2809 14.1112 21.1247 13.4275 20.8359 12.7962C20.5472 12.1649 20.1321 11.5996 19.6163 11.135C18.8035 10.4347 17.7458 10.0859 16.6759 10.1653C16.5827 10.1754 16.4884 10.1669 16.3985 10.1404C16.3086 10.1138 16.2249 10.0696 16.1522 10.0105C16.0794 9.95134 16.0192 9.87836 15.9748 9.79576C15.9305 9.71317 15.903 9.6226 15.8939 9.5293C15.4664 2.731 5.28979 2.82484 5.13339 9.81082C5.13088 9.95342 5.08723 10.0923 5.00769 10.2106C4.92815 10.329 4.81611 10.4219 4.68504 10.4781C3.72127 10.9555 2.9445 11.7409 2.47793 12.71C2.01137 13.679 1.88174 14.776 2.10961 15.8271C2.23997 16.4818 2.50704 17.1016 2.89333 17.646C3.27963 18.1904 3.77647 18.6472 4.35138 18.9864C5.07203 19.3774 5.8905 19.5512 6.70784 19.4869H8.0112'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.65 19.4973V12.2715'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9.38733 14.3577L11.65 12.1055L13.9126 14.3577'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='text-xs tracking-wider text-secondary-green font-normal mt-2'>
                  Choose photo
                </p>
              </div>

              <input
                type='file'
                onChange={handleFile}
                className='opacity-0 absolute'
                name='file'
                capture='user'
                accept='image/png, image/jpeg'
              />
            </label>
          </div>
          <span className='mt-1 text-[12px] text-red-500'>{message || errorMessage}</span>
        </div>
      ) : null}

      {loader ? (
        <div className='flex justify-center items-center h-14'>
          <img src={loading} alt='loading' className='animate-spin duration-300 ease-out' />
        </div>
      ) : null}

      {upload && !loader ? (
        <>
          <div className='flex justify-between overflow-auto p-4 border border-[#D9D9D9] rounded-lg'>
            <div className='flex gap-5 items-center'>
              <img
                src={upload.document_fetch_url}
                alt='Gigs'
                className='object-cover object-center h-[64px] w-[64px] rounded-lg'
              />
              <p>{upload.document_name}</p>
            </div>
            <div className='flex items-center relative'>
              <button
                className='gap-1 flex items-center'
                onClick={() => replacePhotoInputRef.current.click()}
              >
                <svg
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M15.4038 19.4556H17.3641C19.6371 19.4556 21.295 16.9323 21.295 14.8053C21.2809 14.1112 21.1247 13.4275 20.8359 12.7962C20.5472 12.1649 20.1321 11.5996 19.6163 11.135C18.8035 10.4347 17.7458 10.0859 16.6759 10.1653C16.5827 10.1754 16.4884 10.1669 16.3985 10.1404C16.3086 10.1138 16.2249 10.0696 16.1522 10.0105C16.0794 9.95134 16.0192 9.87836 15.9748 9.79576C15.9305 9.71317 15.903 9.6226 15.8939 9.5293C15.4664 2.731 5.28979 2.82484 5.13339 9.81082C5.13088 9.95342 5.08723 10.0923 5.00769 10.2106C4.92815 10.329 4.81611 10.4219 4.68504 10.4781C3.72127 10.9555 2.9445 11.7409 2.47793 12.71C2.01137 13.679 1.88174 14.776 2.10961 15.8271C2.23997 16.4818 2.50704 17.1016 2.89333 17.646C3.27963 18.1904 3.77647 18.6472 4.35138 18.9864C5.07203 19.3774 5.8905 19.5512 6.70784 19.4869H8.0112'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M11.65 19.4973V12.2715'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9.38733 14.3577L11.65 12.1055L13.9126 14.3577'
                    stroke='#147257'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='text-xs tracking-wider text-secondary-green font-medium'>
                  Replace photo
                </p>
              </button>
              <input
                type='file'
                ref={replacePhotoInputRef}
                onChange={handleFile}
                className='opacity-0 absolute w-0'
                name='files'
                capture='user'
                accept='image/png, image/jpeg'
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default AdminFormImageUpload;
