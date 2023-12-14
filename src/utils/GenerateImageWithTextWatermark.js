const generateImageWithTextWatermark = (bankStatementLatLong, bankStatementFile) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();

  img.src = URL.createObjectURL(bankStatementFile);

  img.onload = () => {
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = '30px Poppins';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Position text in the bottom left corner
    const textX = 10; // Adjust as needed
    const textY = canvas.height - 10; // Adjust as needed
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';

    ctx.fillText(
      `Lat:${bankStatementLatLong.lat}; Long:${bankStatementLatLong.long}`,
      textX,
      textY,
    );

    // Convert canvas to data URL
    const processedImageUrl = canvas.toDataURL('image/png');

    return processedImageUrl;
  };
};

export default generateImageWithTextWatermark;
