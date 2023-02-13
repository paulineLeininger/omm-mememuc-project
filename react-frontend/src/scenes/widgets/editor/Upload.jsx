import React, { useEffect, useState } from 'react';
import { useTheme, Box, Typography, IconButton } from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material/';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import useAPI from 'hooks/useAPI';
import { useDispatch } from 'react-redux';
import { setImgs } from 'state';

const Upload = () => {
  const { palette } = useTheme();
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;

  const dispatch = useDispatch();
  const { postImg, getImgs } = useAPI();

  const [uploadedImgPath, setUploadedImgPath] = useState('');
  const [image, setImage] = useState(null);

  const handleImgPost = async (newImage) => {
    const formData = new FormData();

    if (newImage) {
      formData.append('picture', newImage);
      formData.append('pictureName', `${newImage.name}`);
      // console.log(`upload image ${newImage.name}`);
    }
    postImg(formData)
      .then((response) => {
        getImgs().then((res) => {
          dispatch(setImgs({ imgs: res }));
          setImage(null);
        });
        return response.json();
      })
      .then((json) => setUploadedImgPath(`http://localhost:3001/assets/${json.picturePath}`)); // TODO
  };

  useEffect(() => {
    getImgs().then((res) => dispatch(setImgs({ imgs: res })));
  }, []);

  const handleImageDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
    // setUploadedImgPath(`imgs/${acceptedFiles[0].name}`);
    // console.log(acceptedFiles[0]);
    // console.log(`accepted files length:  ${acceptedFiles.length}`);
    handleImgPost(acceptedFiles[0]);
  };

  return (
    <>
      <Box
        border={`1px solid ${medium}`}
        borderRadius="5px"
        mt="1rem"
        p="1rem"
        display="flex"
        width="100%"
        sx={{
          gridColumn: 'span 6'
        }}>
        <Dropzone
          acceptedFiles=".jpg,.jpeg,.png,"
          multiple={false}
          display="flex"
          sx={{
            gridColumn: 'span 6'
          }}
          onDrop={(acceptedFiles) => handleImageDrop(acceptedFiles)}>
          {({ getRootProps, getInputProps }) => (
            <FlexBetween>
              <Box
                {...getRootProps()}
                border={`2px dashed ${palette.primary.main}`}
                p="1rem"
                sx={{ '&:hover': { cursor: 'pointer' } }}>
                <input {...getInputProps()} />
                {!image ? (
                  <p>Add Image Here</p>
                ) : (
                  <FlexBetween>
                    <Typography>{image.name}</Typography>
                    <EditOutlined />
                  </FlexBetween>
                )}
              </Box>
              {image && (
                <IconButton onClick={() => setImage(null)} sx={{ width: '15%' }}>
                  <DeleteOutlined />
                </IconButton>
              )}
            </FlexBetween>
          )}
        </Dropzone>
      </Box>

      <Box
        sx={{
          gridColumn: 'span 6',
          minHeight: '400px'
        }}>
        {uploadedImgPath && <img src={uploadedImgPath} alt="uploaded reference" width="100%" />}
      </Box>
    </>
  );
};

export default Upload;
