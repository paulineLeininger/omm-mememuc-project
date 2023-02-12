import useAPI from 'hooks/useAPI';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setImgs, setPosts } from 'state';
import { exportAsImage, convertToImage } from 'helpers/exportAsImage';
import UserImage from 'components/UserImage';
import _uniqueId from 'lodash/uniqueId';

import {
  IconButton,
  InputBase,
  useTheme,
  Box,
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
  TextIncrease as TextIncreaseIcon,
  Publish as PublishIcon,
  TextDecrease as TextDecreaseIcon,
  Download,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon
} from '@mui/icons-material/';
import Meme from 'components/Meme';
import MemeSelection from './MemeSelection';

const References = () => {
  const FONT_WHITE = 'white';
  const FONT_YELLOW = 'yellow';
  const FONT_BLACK = 'black';
  const FONT_ANTON = "'Anton', sans-serif";
  const FONT_BANGERS = "'Bangers', cursive";
  const FONT_RUBIK = "'Rubik', sans-serif";

  const token = useSelector((state) => state.token);

  const dispatch = useDispatch();
  const { getImgs, postPosts, getPosts } = useAPI(); // TODO should get Refs
  const imgs = useSelector((state) => state.imgs); // TODO should get references not images
  const user = useSelector((state) => state.user);

  const [selectedRefIndex, setSelectedRefIndex] = useState(0);
  const [selectedRefPath, setSelectedRefPath] = useState('');
  const [refPaths, setRefPaths] = useState([]);

  const exportRef = useRef(); // download

  const { palette } = useTheme();
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;

  const [desc, setDesc] = useState('');
  const [topCaption, setTopCaption] = useState('');
  const [bottomCaption, setBottomCaption] = useState('');
  const [topCaptionPosEd, setTopCaptionPosEd] = useState({ x: 0, y: 0 });
  const [bottomCaptionPosEd, setBottomCaptionPosEd] = useState({ x: 0, y: 0 });
  const [font, setFont] = useState(FONT_ANTON);
  const [fontSize, setFontSize] = useState(5);
  const [fontColor, setFontColor] = useState(FONT_WHITE);
  const [fontBackground, setFontBackground] = useState('transparent');

  const [uploadedImage, setUploadedImage] = useState();

  useEffect(() => {
    getImgs().then((res) => dispatch(setImgs({ imgs: res })));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const childCaptionPosToParent = (topCaptionPos, bottomCaptionPos) => {
    setTopCaptionPosEd(topCaptionPos);
    setBottomCaptionPosEd(bottomCaptionPos);
  };

  // imgs changed // TODO should be refs
  useEffect(() => {
    if (imgs.length > 0) {
      setRefPaths(imgs.map((element) => element.picturePath));
    }
  }, [imgs]);

  // selectedRefIndex changed
  useEffect(() => {
    setSelectedRefPath(refPaths[selectedRefIndex]);
    // console.log("selected ref index: " + selectedRefIndex);
  }, [selectedRefIndex]);

  // convert data URL to Blob object
  function dataURLtoBlob(dataurl) {
    const [type, base64] = dataurl.split(';base64,');
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
      array[i] = binary.charCodeAt(i);
    }
    return new Blob([array], { type });
  }

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('topCaption', topCaption);
    formData.append('bottomCaption', bottomCaption);
    // formData.append('font', font);
    // formData.append('fontSize', fontSize);
    // formData.append('fontColor', fontColor);
    // formData.append('topCaptionX', topCaptionPosEd.x);
    // formData.append('topCaptionY', topCaptionPosEd.y);
    // formData.append('bottomCaptionX', bottomCaptionPosEd.x);
    // formData.append('bottomCaptionY', bottomCaptionPosEd.y);

    if (desc !== '') {
      formData.append('description', desc);
    }

    const generatedImageName = `${_uniqueId(user._id)}.png`;
    if (selectedRefPath !== '') {
      formData.append('picturePath', `memes/${generatedImageName}`);
    }

    if (uploadedImage) {
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

  useEffect(() => {
    if (uploadedImage) {
      handlePost();
    }
  }, [uploadedImage]);

  return (
    <>
      <MemeSelection
        inputImgs={imgs}
        setSelectedRefIndex={setSelectedRefIndex}
        setSelectedRefPath={setSelectedRefPath}
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
              console.log(`sel ref i: ${selectedRefIndex}`);
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
          topCaption={topCaption}
          bottomCaption={bottomCaption}
          topX={40}
          bottomX={40}
          topY={10}
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
        {/* <IconButton onClick={() => setIsDraft(!isDraft)}>
          {isDraft && <BookmarkIcon />}
          {!isDraft && <BookmarkBorderIcon />}
        </IconButton> */}
        {/* TODO */}
        <IconButton onClick={() => exportAsImage(exportRef.current, selectedRefPath)}>
          <Download />
        </IconButton>
        {/* <IconButton onClick={() => convertToImage(exportRef.current, selectedRefPath)}>
          <Download />
        </IconButton> */}
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
        placeholder="Top Caption"
        fontFamily={font}
        onChange={(e) => setTopCaption(e.target.value)}
        sx={{
          width: '100%',
          height: '70%',
          backgroundColor: palette.neutral.light,
          borderRadius: '0.5rem',
          padding: '1rem',
          gridColumn: 'span 3'
        }}
      />
      <InputBase
        placeholder="Bottom Caption"
        onChange={(e) => setBottomCaption(e.target.value)}
        sx={{
          width: '100%',
          height: '70%',
          backgroundColor: palette.neutral.light,
          borderRadius: '0.5rem',
          padding: '1rem',
          gridColumn: 'span 3'
        }}
      />
      <Divider sx={{ margin: '0.25rem 0', gridColumn: 'span 6' }} />
      <UserImage gap="2rem" mr="1rem" image={user.picturePath} sx={{ gridColumn: 'span 1' }} />
      <InputBase
        placeholder="Leave a comment..."
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
      <IconButton
        disabled={bottomCaption === '' && topCaption === ''}
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
        <PublishIcon />
      </IconButton>

      {/* <img src={testImg} alt="test" /> */}
    </>
  );
};

export default References;
