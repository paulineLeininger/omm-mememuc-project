// convert data URL to Blob object
const dataURLtoBlob = (dataurl) => {
  const [type, base64] = dataurl.split(';base64,');
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type });
};

export default dataURLtoBlob;
