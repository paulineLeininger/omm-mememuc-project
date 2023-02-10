import html2canvas from 'html2canvas';

const convertToImage = async (element, imageFileName, setImage) => {
  const html = document.getElementsByTagName('html')[0];
  const body = document.getElementsByTagName('body')[0];
  let htmlWidth = html.clientWidth;
  let bodyWidth = body.clientWidth;
  const newWidth = element.scrollWidth - element.clientWidth;
  if (newWidth > element.clientWidth) {
    htmlWidth += newWidth;
    bodyWidth += newWidth;
  }
  html.style.width = `${htmlWidth}px`;
  body.style.width = `${bodyWidth}px`;
  const canvas = await html2canvas(element, { allowTaint: true, useCORS: true });
  const imageUrl = canvas.toDataURL('image/png', 1.0);
  const image = new Image();
  image.src = imageUrl;
  const blob = new Blob(
    [
      new Uint8Array(
        atob(imageUrl.split(',')[1])
          .split('')
          .map((char) => char.charCodeAt(0))
      )
    ],
    { type: 'image/png' }
  );
  const file = new File([blob], `meme_${Date.now()}.png`, {
    type: 'image/png',
    lastModified: Date.now()
  });
  setImage(file);
  html.style.width = null;
  body.style.width = null;
};

export default convertToImage;
