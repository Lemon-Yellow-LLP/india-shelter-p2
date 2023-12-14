import moment from 'moment';

const base64ToBlob = async (base64String) => {
  // Extract content type and base64 data
  const [, contentType, base64Data] = base64String.match(/^data:(.*);base64,(.*)$/);

  // Convert base64 to Blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
};

const splitTextToMultiline = (CAF, Lat, Long, EMP, Timestamp, LO) => {
  let lines = [];
  lines.push(Timestamp);
  lines.push(LO);
  lines.push(EMP);
  lines.push(Long);
  lines.push(Lat);
  lines.push(CAF);

  return lines;
};

const generateImageWithTextWatermark = async (
  canvasRef,
  lead_id,
  employee_code,
  first_name,
  middle_name,
  last_name,
  lat,
  long,
  bankStatementFile,
) => {
  return new Promise((resolve, reject) => {
    let timeStamp = moment().format('DD/MM/YYYY, h:mm:ss a');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = 1080;
    canvas.width = 1920;

    const img = new Image();

    img.src = URL.createObjectURL(bankStatementFile);

    img.onload = async () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      ctx.font = '30px Poppins';
      ctx.fillStyle = 'white';
      //ctx.fillStyle = '#E33439';

      const multilineText = splitTextToMultiline(
        `CAF: ${lead_id}`,
        `Lat:${lat}`,
        `Long:${long}`,
        `EMP code: ${employee_code}`,
        `Timestamp: ${timeStamp}`,
        `LO Name: ${first_name} ${middle_name} ${last_name}`,
      );

      const padding = 10;
      const textX = padding;
      const textY = canvas.height - padding;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';

      multilineText.forEach((line, index) => {
        ctx.fillText(line, textX, textY - index * 40);
      });

      const processedImageUrl = await canvas.toDataURL('image/jpeg', 1);

      let base64Blob = await base64ToBlob(processedImageUrl);

      const image = new File([base64Blob], bankStatementFile.name, { type: 'image/jpeg' });

      resolve(image);
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
};

export default generateImageWithTextWatermark;
