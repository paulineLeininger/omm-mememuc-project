import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import {
  useTheme,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  IconButton,
  InputBase,
  Slider,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import {
  ImageSearch as ImageSearchIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  UploadFile,
  TextIncrease as TextIncreaseIcon,
  Publish as PublishIcon,
  TextDecrease as TextDecreaseIcon,
  Download,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import useAPI from 'hooks/useAPI';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setImgs, setPosts, setDrafts } from 'state';
import { exportAsImage, convertToImage } from 'helpers/exportAsImage';
import UserImage from 'components/UserImage';
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';
import dataURLtoBlob from 'helpers/dataURLtoBlob';

import Meme from 'components/Meme';
import MemeSelection from './MemeSelection';
import UploadDialog from './UploadDialog';

const MemeEditor = () => {
  const REFERENCE = 'reference';
  const DRAFT = 'draft';

  const [selectedTab, setRefMode] = useState(REFERENCE);

  const FONT_WHITE = 'white';
  const FONT_YELLOW = 'yellow';
  const FONT_BLACK = 'black';
  const FONT_ANTON = "'Anton', sans-serif";
  const FONT_BANGERS = "'Bangers', cursive";
  const FONT_RUBIK = "'Rubik', sans-serif";

  const dispatch = useDispatch();
  const { getImgs, postPosts, getPosts, getDrafts, postDraft } = useAPI(); // TODO should get Refs
  const imgs = useSelector((state) => state.imgs); // TODO should get references not images
  const user = useSelector((state) => state.user);
  const drafts = useSelector((state) => state.drafts);

  const [selectedRefIndex, setSelectedRefIndex] = useState(0);
  const [selectedRefPath, setSelectedRefPath] = useState('');
  const [refPaths, setRefPaths] = useState([]);
  const [draftThumbnailPaths, setDraftThumbnailPaths] = useState([]);

  useEffect(() => {
    setDraftThumbnailPaths(drafts.map((draft) => draft.picturePath));
  }, [drafts]);

  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const exportRef = useRef(); // download

  const { palette } = useTheme();
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;

  const [desc, setDesc] = useState('');
  const [captions, setCaptions] = useState([
    { text: '', position: { x: 0, y: 0 } },
    { text: '', position: { x: 0, y: 0 } },
    { text: '', position: { x: 0, y: 0 } }
  ]);

  const [font, setFont] = useState(FONT_ANTON);
  const [fontSize, setFontSize] = useState(5);
  const [fontColor, setFontColor] = useState(FONT_WHITE);

  const [uploadedImage, setUploadedImage] = useState();
  const [uploadedDraft, setUploadedDraft] = useState();

  useEffect(() => {
    getImgs().then((res) => dispatch(setImgs({ imgs: res })));
    getDrafts().then((res) => dispatch(setDrafts({ drafts: res })));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log(drafts);
  }, [drafts]);
  const childCaptionPosToParent = (topCaptionPos, middleCaptionPos, bottomCaptionPos) => {
    const newCaptions = [...captions];
    newCaptions[0].position = topCaptionPos;
    newCaptions[1].position = middleCaptionPos;
    newCaptions[2].position = bottomCaptionPos;
  };

  // imgs changed // TODO should be refs
  useEffect(() => {
    if (selectedTab === DRAFT) {
      if (drafts.length > 0) {
        setRefPaths(drafts.map((draft) => draft.referencePath));
      }
    } else if (selectedTab === REFERENCE) {
      if (imgs.length > 0) {
        setRefPaths(imgs.map((element) => element.picturePath));
      }
    }
  }, [imgs, drafts, selectedTab]);

  useEffect(() => {
    if (selectedTab === DRAFT && drafts !== []) {
      console.log(drafts);
      if (drafts[selectedRefIndex]?.fontColor) {
        setFontColor(drafts[selectedRefIndex]?.fontColor);
      }
      if (drafts[selectedRefIndex]?.fontSize) {
        setFontSize(drafts[selectedRefIndex]?.fontSize);
      }
      if (drafts[selectedRefIndex]?.captions) {
        console.log('test');
        setCaptions(JSON.parse(JSON.stringify(drafts[selectedRefIndex].captions)));
      }
    }
  }, [selectedTab, selectedRefIndex]);

  // selectedRefIndex changed
  useEffect(() => {
    setSelectedRefPath(refPaths[selectedRefIndex]);
  }, [refPaths, selectedRefIndex]);

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('captions', captions);
    formData.append('font', font);
    formData.append('fontSize', fontSize);
    formData.append('fontColor', fontColor);

    if (desc !== '') {
      formData.append('description', desc);
    }

    const generatedImageName = `${uuid()}.png`;
    if (selectedRefPath !== '') {
      formData.append('picturePath', `memes/${generatedImageName}`);
    }

    if (uploadedImage) {
      // console.log(dataURLtoBlob(uploadedImage));
      formData.append('picture', dataURLtoBlob(uploadedImage), generatedImageName);
    }

    postPosts(formData).then(() => {
      getPosts().then((res) => {
        dispatch(setPosts({ posts: res }));
        setDesc('');
        console.log(`send picture: ${formData.get('picturePath')}`);
        setUploadedImage(null);
      });
    });
  };

  const handleDraft = async () => {
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('captions', JSON.stringify(captions));
    formData.append('font', font);
    formData.append('fontSize', fontSize);
    formData.append('fontColor', fontColor);
    formData.append('referencePath', selectedRefPath);

    if (desc !== '') {
      formData.append('description', desc);
    }

    const generatedImageName = `${uuid()}.png`;
    // if (selectedRefPath !== '') {
    formData.append('picturePath', `drafts/${generatedImageName}`);
    // }

    if (uploadedDraft) {
      // console.log(dataURLtoBlob(uploadedImage));
      formData.append('picture', dataURLtoBlob(uploadedDraft), generatedImageName);
    }

    postDraft(formData).then(() => {
      getDrafts(user._id).then((res) => {
        dispatch(setDrafts({ drafts: res }));
        setDesc('');
        setUploadedImage(null);
      });
    });
  };

  const handleClear = () => {
    setCaptions([
      { text: '', position: { x: 0, y: 0 } },
      { text: '', position: { x: 0, y: 0 } },
      { text: '', position: { x: 0, y: 0 } }
    ]);
  };

  const updateCaption = (text, id) => {
    const newCaptions = [...captions];
    newCaptions[id].text = text;
    setCaptions(newCaptions);
  };

  useEffect(() => {
    if (uploadedImage) {
      handlePost();
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (uploadedDraft) {
      handleDraft();
    }
  }, [uploadedDraft]);

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <Box display="grid" gap="6px" width="100%" gridTemplateColumns="repeat(6, minmax(0, 1fr))">
          <Typography
            variant="h4"
            color={palette.neutral.dark}
            fontWeight="500"
            sx={{
              gridColumn: 'span 6'
            }}>
            Create your own Meme
          </Typography>
          <Tabs
            value={selectedTab}
            display="flex"
            sx={{
              width: '100%',
              gridColumn: 'span 6',
              borderRadius: '0.5rem',
              p: '0.25rem 0rem'
            }}>
            <Tab
              value={REFERENCE}
              icon={<ImageSearchIcon />}
              label="references"
              sx={{
                width: '50%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(REFERENCE);
                setSelectedRefIndex(0);
              }}
            />
            <Tab
              value={DRAFT}
              icon={<CollectionsBookmarkIcon />}
              label="drafts"
              disabled={drafts.length === 0}
              sx={{
                width: '50%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(DRAFT);
                setSelectedRefIndex(0);
              }}
            />
          </Tabs>
          <>
            <Box
              height="90px"
              sx={{
                gridColumn: 'span 6',
                display: 'flex',
                flexDirection: 'row'
              }}>
              {selectedTab === REFERENCE && (
                <Button
                  onClick={() => setOpenUploadDialog(true)}
                  sx={{
                    m: '1rem',
                    backgroundColor: palette.primary.main,
                    color: palette.primary.contrastText,
                    flexDirection: 'column',
                    '&:focus': {
                      border: 1,
                      borderColor: palette.primary.dark
                    }
                  }}>
                  <UploadFile />
                  Upload
                </Button>
              )}

              {selectedTab === REFERENCE && (
                <MemeSelection
                  inputImgs={refPaths}
                  selectedRefIndex={selectedRefIndex}
                  setSelectedRefIndex={setSelectedRefIndex}
                />
              )}
              {selectedTab === DRAFT && (
                <MemeSelection
                  inputImgs={draftThumbnailPaths}
                  selectedRefIndex={selectedRefIndex}
                  setSelectedRefIndex={setSelectedRefIndex}
                />
              )}
            </Box>

            <UploadDialog
              open={openUploadDialog}
              setOpen={setOpenUploadDialog}
              setSelectedRefIndex={setSelectedRefIndex}
            />

            <Box
              display="flex"
              gap="2rem"
              borderRadius="5px"
              position="relative"
              style={{
                objectFit: 'contain',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              sx={{
                gridColumn: 'span 6'
              }}>
              {selectedRefIndex < 1 && (
                <ArrowBackIosIcon disabled sx={{ color: light, gridColumn: 'span 1' }} />
              )}
              {selectedRefIndex >= 1 && (
                <ArrowBackIosIcon
                  onClick={() => {
                    setSelectedRefIndex(selectedRefIndex - 1);
                  }}
                  sx={{ color: medium, gridColumn: 'span 1' }}
                />
              )}
              <Meme
                childToParent={childCaptionPosToParent}
                isDraggable
                exportRef={exportRef}
                selectedRefPath={selectedRefPath}
                topCaption={captions[0]?.text}
                middleCaption={captions[1]?.text}
                bottomCaption={captions[2]?.text}
                topX={40}
                middleX={40}
                bottomX={40}
                topY={10}
                middleY={40}
                bottomY={70}
                font={font}
                fontSize={fontSize}
                fontColor={fontColor}
                fontBackground=""
                canvasHeight={0}
                canvasWidth={0}
              />
              {selectedRefIndex === imgs.length - 1 && (
                <ArrowForwardIosIcon disabled sx={{ color: light, gridColumn: 'span 1' }} />
              )}
              {selectedRefIndex >= 0 && selectedRefIndex < imgs.length - 1 && (
                <ArrowForwardIosIcon
                  onClick={() => {
                    console.log(`sel ref i: ${selectedRefIndex}`);
                    setSelectedRefIndex(selectedRefIndex + 1);
                  }}
                  sx={{ color: mediumMain, gridColumn: 'span 1' }}
                />
              )}
            </Box>
            <Box sx={{ margin: '0.25rem 0', gridColumn: 'span 5' }} />
            <Box sx={{ margin: '0.25rem 0', gridColumn: 'span 1' }}>
              <IconButton
                onClick={() => {
                  convertToImage(exportRef.current).then((res) => setUploadedDraft(res));
                }}>
                <BookmarkIcon />
              </IconButton>
              <IconButton onClick={() => exportAsImage(exportRef.current, selectedRefPath)}>
                <Download />
              </IconButton>
              <IconButton onClick={() => handleClear()}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <Divider sx={{ margin: '0.25rem 0', gridColumn: 'span 6' }} />
            <Box
              display="grid"
              gap="2rem"
              borderRadius="5px"
              position="relative"
              p="0.5rem 1.5rem"
              style={{ objectFit: 'contain', width: '100%' }}
              sx={{
                gridColumn: 'span 6',
                backgroundColor: palette.neutral.light
              }}>
              <FormControl
                sx={{
                  gridColumn: 'span 2'
                }}>
                <FormLabel id="demo-row-radio-buttons-group-label">Font Color</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group">
                  <FormControlLabel
                    value={FONT_WHITE}
                    control={
                      <Radio
                        checked={fontColor === FONT_WHITE}
                        onChange={(event) => setFontColor(event.target.value)}
                        sx={{
                          color: FONT_WHITE,
                          '&.Mui-checked': {
                            color: FONT_WHITE
                          }
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    value={FONT_YELLOW}
                    control={
                      <Radio
                        checked={fontColor === FONT_YELLOW}
                        onChange={(event) => setFontColor(event.target.value)}
                        sx={{
                          color: FONT_YELLOW,
                          '&.Mui-checked': {
                            color: FONT_YELLOW
                          }
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    value={FONT_BLACK}
                    onChange={(event) => setFontColor(event.target.value)}
                    control={
                      <Radio
                        checked={fontColor === FONT_BLACK}
                        sx={{
                          color: FONT_BLACK,
                          '&.Mui-checked': {
                            color: FONT_BLACK
                          }
                        }}
                      />
                    }
                  />
                </RadioGroup>
              </FormControl>
              <FormControl
                sx={{
                  gridColumn: 'span 2'
                }}>
                <InputLabel>Font</InputLabel>
                <Select
                  value={font}
                  label="Font"
                  sx={{ fontFamily: font }}
                  onChange={(event) => {
                    setFont(event.target.value);
                  }}>
                  <MenuItem value={FONT_RUBIK} sx={{ fontFamily: FONT_RUBIK }}>
                    Rubik
                  </MenuItem>
                  <MenuItem value={FONT_BANGERS} sx={{ fontFamily: FONT_BANGERS }}>
                    Bangers
                  </MenuItem>
                  <MenuItem value={FONT_ANTON} sx={{ fontFamily: FONT_ANTON }}>
                    Anton
                  </MenuItem>
                </Select>
              </FormControl>
              <Stack spacing={2} direction="row" sx={{ mb: 1, gridColumn: 'span 2' }}>
                <TextDecreaseIcon />
                <Slider
                  defaultValue={5}
                  step={1}
                  marks
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                  value={fontSize}
                  onChange={(event, newValue) => {
                    setFontSize(newValue);
                  }}
                />
                <TextIncreaseIcon />
              </Stack>
            </Box>
            <InputBase
              placeholder="Text 1"
              fontFamily={font}
              value={captions[0]?.text}
              onChange={(e) => updateCaption(e.target.value, 0)}
              sx={{
                width: '100%',
                height: '70%',
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                padding: '1rem',
                gridColumn: 'span 2'
              }}
            />
            <InputBase
              placeholder="Text 2"
              value={captions[1]?.text}
              onChange={(e) => updateCaption(e.target.value, 1)}
              sx={{
                width: '100%',
                height: '70%',
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                padding: '1rem',
                gridColumn: 'span 2'
              }}
            />
            <InputBase
              placeholder="Text 3"
              value={captions[2]?.text}
              onChange={(e) => updateCaption(e.target.value, 2)}
              sx={{
                width: '100%',
                height: '70%',
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                padding: '1rem',
                gridColumn: 'span 2'
              }}
            />
            <Divider sx={{ margin: '0.25rem 0', gridColumn: 'span 6' }} />
            <UserImage
              gap="2rem"
              mr="1rem"
              image={user.picturePath}
              sx={{ gridColumn: 'span 1' }}
            />
            <InputBase
              placeholder="Description"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              ml="3rem"
              sx={{
                width: '100%',
                height: '70%',
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                padding: '1rem',
                gridColumn: 'span 4'
              }}
            />
            <Button
              disabled={
                captions[0].text === '' && captions[1].text === '' && captions[2].text === ''
              }
              onClick={() => {
                convertToImage(exportRef.current).then((res) => setUploadedImage(res));
              }}
              sx={{
                width: '100%',
                height: '70%',
                color: palette.background.alt,
                backgroundColor: palette.primary.main,
                borderRadius: '0.5em',
                gridColumn: 'span 1'
              }}>
              <PublishIcon sx={{ mr: '5px' }} /> Post
            </Button>
          </>
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MemeEditor;
