import { useState } from 'react';
import DesktopPopUp from '../UploadDocsModal';

function ImageUpload({ files, setFile, label, hint, noBorder, ...props }) {
  const [message, setMessage] = useState();
  const [imageUpload, setImageUpload] = useState(false);
  const [show, setShow] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const handleFile = (e) => {
    setMessage('');
    let file = e.target.files;

    for (let i = 0; i < file.length; i++) {
      const fileType = file[i]['type'];

      const validImageTypes = ['image/jpeg'];

      if (validImageTypes.includes(fileType)) {
        setImageUpload(true);

        setFile([...files, file[i]]);
      } else {
        setMessage('File format not supported');
      }
    }
  };

  const removeImage = (i) => {
    setFile(files.filter((x) => x.name !== i));
  };

  const getImage = (value) => {
    setFile(files.filter((img) => img.name !== value.name));
  };

  //   console.log(files);
  //   console.log(imageUpload);

  return (
    <div className='w-full'>
      <label className='flex gap-0.5 items-center text-primary-black font-medium'>
        {label}
        {props.required && <span className='text-primary-red text-sm'>*</span>}
      </label>

      {hint && (
        <span
          className='mb-1.5 text-light-grey text-xs font-normal'
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        />
      )}

      {!files.length ? (
        <div>
          <div className='bg-white flex items-center justify-center w-full'>
            <label
              className={`flex cursor-pointer flex-col w-full h-[72px] ${
                noBorder ? 'border-0' : 'border-2'
              } ${
                message ? 'border-primary-red' : 'border-dashed border-stroke'
              } rounded-md relative`}
            >
              <div className='flex flex-col items-center absolute top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4'>
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12.8339 15.7965H14.4675C16.3617 15.7965 17.7432 13.6938 17.7432 11.9212C17.7315 11.3429 17.6013 10.7731 17.3607 10.247C17.1201 9.72094 16.7741 9.2498 16.3443 8.86269C15.667 8.27908 14.7856 7.98841 13.894 8.05461C13.8163 8.06302 13.7377 8.05595 13.6628 8.0338C13.5879 8.01165 13.5181 7.97486 13.4575 7.92557C13.3969 7.87628 13.3467 7.81546 13.3098 7.74663C13.2728 7.6778 13.2499 7.60233 13.2423 7.52458C12.886 1.85933 4.40556 1.93753 4.27522 7.75918C4.27313 7.87802 4.23675 7.99372 4.17047 8.09237C4.10419 8.19102 4.01082 8.26843 3.90159 8.31528C3.09846 8.71305 2.45114 9.36761 2.06234 10.1751C1.67354 10.9826 1.56551 11.8969 1.7554 12.7728C1.86404 13.3183 2.08659 13.8348 2.40851 14.2885C2.73042 14.7422 3.14446 15.1228 3.62354 15.4055C4.22409 15.7313 4.90615 15.8762 5.58726 15.8226H6.67339'
                    stroke='#373435'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M9.70312 15.8311V9.80957'
                    stroke='#373435'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M7.82031 11.5477L9.70583 9.6709L11.5914 11.5477'
                    stroke='#373435'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>

                <p className='text-xs tracking-wider text-secondary-green font-normal mt-1'>
                  Take a photo
                </p>

                <p className='text-[10px] tracking-wider text-light-grey font-normal'>
                  Supported format: JPG
                </p>
              </div>

              <input
                type='file'
                onChange={handleFile}
                className='opacity-0'
                multiple={true}
                name='files[]'
                capture='user'
                accept='image/*'
              />
            </label>
          </div>
          <span className='mt-1 text-[12px] text-red-500'>{message}</span>
        </div>
      ) : null}

      {imageUpload && files.length ? (
        <>
          <div className='flex justify-start overflow-auto'>
            <div className='flex gap-2 my-2'>
              <div
                style={{ boxShadow: '5px 0px 10px 0px #0000001F' }}
                className='h-[85px] w-[68px] rounded border-x border-y border-dashed border-stroke flex justify-center items-center'
              >
                <button className='w-full h-full relative'>
                  <svg
                    width='24'
                    height='25'
                    viewBox='0 0 24 25'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='absolute top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4'
                  >
                    <g clipPath='url(#clip0_3036_39087)'>
                      <rect y='0.5' width='24' height='24' rx='12' fill='#DDFFE7' />
                      <path
                        d='M12 7V19M18 13L6 13'
                        stroke='#147257'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </g>
                    <defs>
                      <clipPath id='clip0_3036_39087'>
                        <rect y='0.5' width='24' height='24' rx='12' fill='white' />
                      </clipPath>
                    </defs>
                  </svg>

                  <input
                    type='file'
                    onChange={handleFile}
                    className='opacity-0 w-full h-full'
                    multiple={true}
                    name='files[]'
                    capture='user'
                    accept='image/*'
                  />
                </button>
              </div>

              <div className='flex gap-2 h-[85px]'>
                {files.map((file, key) => {
                  return (
                    <div key={key} className='overflow-hidden relative w-[68px]'>
                      <button
                        onClick={() => {
                          removeImage(file.name);
                          if (files.length == 1) {
                            setImageUpload(false);
                          }
                        }}
                        className='absolute right-0 top-0 z-20'
                      >
                        <svg
                          width='16'
                          height='16'
                          viewBox='0 0 16 16'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <rect width='16' height='16' rx='8' fill='#FFE0E1' />
                          <path
                            d='M10.9193 5.0835L5.08594 10.9168'
                            stroke='#E33439'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                          <path
                            d='M5.08594 5.0835L10.9193 10.9168'
                            stroke='#E33439'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </button>

                      <div className='relative rounded-md h-full w-full'>
                        <div className='absolute h-full w-full bg-black opacity-40'></div>
                        <button
                          className='absolute top-2/4 -translate-y-2/4 left-2/4 -translate-x-2/4'
                          onClick={() => {
                            setPreviewFile(file);
                            setShow(true);
                          }}
                        >
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M14.0895 6.5689C14.8625 7.38228 14.8625 8.61805 14.0895 9.43143C12.7856 10.8033 10.5463 12.6668 8.0026 12.6668C5.45893 12.6668 3.2196 10.8033 1.91574 9.43143C1.14267 8.61805 1.14267 7.38228 1.91574 6.5689C3.2196 5.19705 5.45893 3.3335 8.0026 3.3335C10.5463 3.3335 12.7856 5.19705 14.0895 6.5689Z'
                              stroke='#FEFEFE'
                            />
                            <path
                              d='M10.0026 8.00016C10.0026 9.10473 9.10717 10.0002 8.0026 10.0002C6.89803 10.0002 6.0026 9.10473 6.0026 8.00016C6.0026 6.89559 6.89803 6.00016 8.0026 6.00016C9.10717 6.00016 10.0026 6.89559 10.0026 8.00016Z'
                              stroke='#FEFEFE'
                            />
                          </svg>
                        </button>
                        <img
                          src={URL.createObjectURL(file)}
                          alt='Gigs'
                          className='object-cover object-center h-full w-full'
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <DesktopPopUp
            showpopup={show}
            setShowPopUp={setShow}
            img={previewFile}
            callback={getImage}
          />

          <span className='flex justify-center items-center text-[12px] mb-1 text-red-500'>
            {message}
          </span>
        </>
      ) : null}
    </div>
  );
}

export default ImageUpload;
