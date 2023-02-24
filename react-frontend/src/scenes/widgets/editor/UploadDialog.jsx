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
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';
import dataURLtoBlob from 'helpers/dataURLtoBlob';
import Webcam from 'react-webcam';

const WebcamComponent = () => <Webcam />;

const videoConstraints = {
  width: 500,
  height: 400,
  facingMode: 'user'
};

const UploadDialog = ({ open, setOpen, setSelectedRefIndex }) => {
  const { palette } = useTheme();
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;

  const dispatch = useDispatch();
  const { postImg, getImgs, getProxyImage } = useAPI();

  const [uploadedImgPath, setUploadedImgPath] = useState(''); // path to image after upload
  const [image, setImage] = useState(null); // image before upload
  const [link, setLink] = useState('');
  const [picture, setPicture] = useState('');
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(() => {
    const pictureSrc = webcamRef.current.getScreenshot();
    setPicture(pictureSrc);
  });
  const [webcamOpen, setWebcamOpen] = useState(false);

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

      fetch(`http://localhost:3001/imgs/imageProxy?url=${imageUrl}`, {
        method: 'GET'
      })
        .then((response) => response.blob())
        .then((blob) => {
          const mimeToExtMap = {
            'image/png': 'png',
            'image/jpeg': 'jpg',
            'image/gif': 'gif'
          };

          const fileName = `${uuid()}.${mimeToExtMap[blob.type]}`;
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

  const handleCamPicPost = async () => {
    if (picture) {
      const formData = new FormData();
      const pictureName = `${uuid()}.jpg`;
      formData.append('picture', dataURLtoBlob(picture), pictureName);
      formData.append('pictureName', pictureName);
      postImg(formData)
        .then((response) => {
          getImgs().then((res) => {
            dispatch(setImgs({ imgs: res }));
            setPicture('');
            setWebcamOpen(false);
            setSelectedRefIndex(res.length - 1);
          });
          return response.json();
        })
        .then((json) => setUploadedImgPath(`http://localhost:3001/assets/${json.picturePath}`))
        .then(() => setOpen(false)); // TODO
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Upload an image</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can upload an image from your file system or through a link or take a picture with
          your webcam.
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
            <div>Take a picture from your webcam:</div>
            {!webcamOpen && (
              <Box mt="1rem">
                <Button variant="contained" onClick={() => setWebcamOpen(true)}>
                  Open Webcam
                </Button>
              </Box>
            )}
            {webcamOpen && (
              <>
                <div>
                  {picture === '' ? (
                    <Webcam
                      audio={false}
                      height={400}
                      ref={webcamRef}
                      width={500}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                  ) : (
                    <img src={picture} alt="webcam" />
                  )}
                </div>
                <div>
                  {picture !== '' ? (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setPicture('');
                      }}
                      variant="contained">
                      Retake
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        capture();
                      }}
                      variant="contained">
                      Capture
                    </Button>
                  )}
                  {picture !== '' && (
                    <Button
                      variant="contained"
                      sx={{ ml: '10px' }}
                      onClick={() => handleCamPicPost()}>
                      Upload
                    </Button>
                  )}
                </div>
              </>
            )}
          </Box>
        </>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDialog;
