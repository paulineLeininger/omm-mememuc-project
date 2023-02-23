import React, { useEffect, useState } from 'react';
import {
  TextField,
  useTheme,
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@mui/icons-material/';
import Dropzone from 'react-dropzone';
import FlexBetween from 'components/FlexBetween';
import useAPI from 'hooks/useAPI';
import { useDispatch } from 'react-redux';
import { setImgs } from 'state';
import _uniqueId from 'lodash/uniqueId';

const UploadDialog = ({ open, setOpen, setSelectedRefIndex }) => {
  const { palette } = useTheme();
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;

  const dispatch = useDispatch();
  const { postImg, getImgs } = useAPI();

  const [uploadedImgPath, setUploadedImgPath] = useState(''); // path to image after upload
  const [image, setImage] = useState(null); // image before upload
  const [link, setLink] = useState('');

  const handleClose = () => {
    setOpen(false);
    setImage(null);
    setLink('');
  };

  useEffect(() => {
    getImgs().then((res) => dispatch(setImgs({ imgs: res })));
  }, []);

  const handleImageDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
    // setUploadedImgPath(`imgs/${acceptedFiles[0].name}`);
    // console.log(acceptedFiles[0]);
    // console.log(`accepted files length:  ${acceptedFiles.length}`);

    // handleImgPost(acceptedFiles[0]);
  };

  const handleImgUploadPost = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('picture', image);
      formData.append('pictureName', `${image.name}`);
      postImg(formData)
        .then((response) => {
          getImgs().then((res) => {
            dispatch(setImgs({ imgs: res }));
            setImage(null);
            setSelectedRefIndex(res.length - 1);
          });
          return response.json();
        })
        .then((json) => setUploadedImgPath(`http://localhost:3001/assets/${json.picturePath}`))
        .then(() => setOpen(false)); // TODO
    }
  };

  const handleImageLinkPost = (imageUrl) => {
    if (imageUrl) {
      const formData = new FormData();

      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const mimeToExtMap = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/gif': 'gif'
          };

          const fileName = `${_uniqueId()}.${mimeToExtMap[blob.type]}`;
          formData.append('picture', blob, fileName);
          formData.append('pictureName', fileName);
          postImg(formData)
            .then((response) => {
              getImgs().then((res) => {
                dispatch(setImgs({ imgs: res }));
                setImage(null);
                setSelectedRefIndex(res.length - 1);
              });
              return response.json();
            })
            .then((json) => setUploadedImgPath(`http://localhost:3001/assets/${json.picturePath}`))

            .then(() => setOpen(false)); // TODO
        });
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Upload an image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can upload an image from your file system or through a link.
        </DialogContentText>
        <>
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            // display="flex"
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
            <Box mt="1rem">
              <Button variant="contained" onClick={() => handleImgUploadPost()}>
                Upload
              </Button>
            </Box>
          </Box>
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
            // display="flex"
            width="100%"
            sx={{
              gridColumn: 'span 6'
            }}>
            <div>Upload an image via a link:</div>
            <TextField
              id="standard-basic"
              label="Image Link"
              variant="standard"
              type="url"
              fullWidth
              onChange={(e) => setLink(e.target.value)}
            />
            <Box mt="1rem">
              <Button variant="contained" onClick={() => handleImageLinkPost(link)}>
                Upload
              </Button>
            </Box>
          </Box>

          {/* <Box
            sx={{
              gridColumn: 'span 6',
              minHeight: '400px'
            }}>
            {uploadedImgPath && <img src={uploadedImgPath} alt="uploaded reference" width="100%" />}
          </Box> */}
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
