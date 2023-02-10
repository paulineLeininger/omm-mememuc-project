// mui icon imports
import {
  EditOutlined,
  DeleteOutlined,
  UploadFile,
  Download,
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Publish as PublishIcon,
  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon,
  ImageSearch as ImageSearchIcon,
  BrowseGallery as BrowseGalleryIcon,
  Collections as CollectionsIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  Link as LinkIcon,
  Public as PublicIcon,
  Lock as LockIcon
} from '@mui/icons-material';
// mui components imports
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
  Select,
  MenuItem,
  Tab,
  Tabs,
  Stack,
  Slider,
  InputLabel,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setRefs, setImgs } from 'state';
import Meme from 'components/Meme';
import exportAsImage from 'helpers/exportAsImage';
import useAPI from 'hooks/useAPI';
import MemeSelection from './MemeSelection';

// der gesamte meme editor
const MemeEditorWidget = ({ picturePath }) => {
  // for post
  const dispatch = useDispatch();
  const { postPosts, getPosts, getImgs, getRefs, getUserPosts } = useAPI();

  // state hooks
  const [isImage, setIsImage] = useState(false); // vllt besser: mediaType und dann für beides
  const [isGif, setIsGif] = useState(false);
  const [image, setImage] = useState(null);
  const [gif, setGif] = useState(null);
  const [desc, setDesc] = useState('');
  const { palette } = useTheme();

  // state
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const refs = useSelector((state) => state.refs);
  const imgs = useSelector((state) => state.imgs);
  const posts = useSelector((state) => state.posts);

  // test
  // const [isTest, setIsTest] = useState(false);

  // gui
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const { mediumMain, lightMain, darkMain, medium, light } = palette.neutral;
  const REFERENCE = 'reference';
  const TEMPLATE = 'template';
  const UPLOAD = 'upload';
  const HISTORY = 'history';
  const DRAFT = 'draft';
  const FONT_WHITE = 'white';
  const FONT_YELLOW = 'yellow';
  const FONT_BLACK = 'black';
  const FONT_ANTON = "'Anton', sans-serif";
  const FONT_BANGERS = "'Bangers', cursive";
  const FONT_RUBIK = "'Rubik', sans-serif";

  // for meme display
  const [selectedRefPath, setSelectedRefPath] = useState('');
  const [refPaths, setRefPaths] = useState([]);
  const [refMode, setRefMode] = useState(REFERENCE);
  const [selectedRefIndex, setSelectedRefIndex] = useState(0);
  const [maxRefIndex, setMaxRefIndex] = useState(0);
  const [topCaption, setTopCaption] = useState('');
  const [bottomCaption, setBottomCaption] = useState('');
  const [topCaptionPosEd, setTopCaptionPosEd] = useState({ x: 0, y: 0 });
  const [bottomCaptionPosEd, setBottomCaptionPosEd] = useState({ x: 0, y: 0 });
  const [isPrivate, setIsPrivate] = useState(false);
  const [isUnlisted, setIsUnlisted] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [font, setFont] = useState(FONT_ANTON);
  const [fontSize, setFontSize] = useState(5);
  const [fontColor, setFontColor] = useState(FONT_WHITE);
  const [fontBackground, setFontBackground] = useState('transparent');

  // download
  const exportRef = useRef();

  const handlePost = async () => {
    const formData = new FormData();
    formData.append('userId', _id);
    formData.append('topCaption', topCaption);
    formData.append('bottomCaption', bottomCaption);
    // formData.append('font', font);
    // formData.append('fontSize', fontSize);
    // formData.append('fontColor', fontColor);
    // formData.append('topCaptionX', topCaptionPosEd.x);
    // formData.append('topCaptionY', topCaptionPosEd.y);
    // formData.append('bottomCaptionX', bottomCaptionPosEd.x);
    // formData.append('bottomCaptionY', bottomCaptionPosEd.y);

    if (selectedRefPath !== '') {
      formData.append('picturePath', selectedRefPath);
    }
    if (desc !== '') {
      formData.append('description', desc);
    }
    if (image) {
      formData.append('picture', image);
    }

    postPosts(formData).then(() => {
      getPosts().then((res) => {
        dispatch(setPosts({ posts: res }));
        setImage(null);
        setDesc('');
      });
    });
  };

  const handleRefPost = async () => {
    const formData = new FormData();
    formData.append('userId', _id);
    formData.append('topCaption', topCaption);
    formData.append('bottomCaption', bottomCaption);
    formData.append('isDraft', isDraft);
    formData.append('font', font);
    formData.append('fontSize', fontSize);
    formData.append('fontColor', fontColor);
    formData.append('fontBackground', fontBackground);
    formData.append('topCaptionX', topCaptionPosEd.x);
    formData.append('topCaptionY', topCaptionPosEd.y);
    formData.append('bottomCaptionX', bottomCaptionPosEd.x);
    formData.append('bottomCaptionY', bottomCaptionPosEd.y);

    if (selectedRefPath !== '') {
      formData.append('picturePath', selectedRefPath);
    }
    const response = await fetch('http://localhost:3001/refs', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const refsResponse = await response.json();
    dispatch(setRefs({ refs: refsResponse }));
    setImage(null);
  };

  const handleFontChange = (event) => {
    setFont(event.target.value);
  };

  const handleFontSizeChange = (event, newValue) => {
    setFontSize(newValue);
  };

  const handleFontColorChange = (event) => {
    setFontColor(event.target.value);
  };

  const childCaptionPosToParent = (topCaptionPos, bottomCaptionPos) => {
    setTopCaptionPosEd(topCaptionPos);
    setBottomCaptionPosEd(bottomCaptionPos);
  };
  useEffect(() => {
    console.log(`-----editor: topCaption: x=${topCaptionPosEd.x} y=${topCaptionPosEd.y}`);
  }, [topCaptionPosEd]);

  useEffect(() => {
    console.log(`-----editor: topCaption: x=${topCaptionPosEd.x} y=${topCaptionPosEd.y}`);
  }, [bottomCaptionPosEd]);

  useEffect(() => {
    getRefs().then((res) => dispatch(setRefs({ refs: res })));
    getImgs().then((res) => dispatch(setImgs({ imgs: res })));
    console.log(`imgs: ${imgs.length}`);
    console.log(`refs: ${refs.length}`);
    getUserPosts(_id).then((res) => dispatch(setPosts({ posts: res })));
    setMaxRefIndex(refs.length - 1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // reference Mode changed
  useEffect(() => {
    switch (refMode) {
      case REFERENCE:
        setRefPaths(imgs.map((element) => element.picturePath));
        break;
      case HISTORY:
        setRefPaths(imgs.map((element) => element.picturePath));
        break;
      case DRAFT:
        setRefPaths(imgs.map((element) => element.picturePath));
        break;
      case TEMPLATE:
        setRefPaths(refs.map((element) => element.picturePath));
        break;
      default:
        setRefPaths(imgs.map((element) => element.picturePath));
        break;
    }
  }, [refMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // refs changed
  useEffect(() => {
    if (refs.length > 0 && refMode === TEMPLATE) {
      setRefPaths(refs.map((element) => element.picturePath));
    }
  }, [refs]);

  // imgs changed
  useEffect(() => {
    if (imgs.length > 0 && refMode === REFERENCE) {
      setRefPaths(imgs.map((element) => element.picturePath));
    }
  }, [imgs]);

  // selectedRefIndex changed
  useEffect(() => {
    setSelectedRefPath(refPaths[selectedRefIndex]);
    // console.log("selected ref index: " + selectedRefIndex);
  }, [selectedRefIndex]);

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
            value={refMode}
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
                width: '20%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(REFERENCE);
                setMaxRefIndex(refs.length - 1);
              }}
            />
            <Tab
              value={HISTORY}
              icon={<BrowseGalleryIcon />}
              label="history"
              sx={{
                width: '20%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(HISTORY);
                setMaxRefIndex(refs.length - 1);
              }}
            />
            <Tab
              value={DRAFT}
              icon={<CollectionsBookmarkIcon />}
              label="drafts"
              sx={{
                width: '20%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(DRAFT);
                setMaxRefIndex(refs.length - 1);
              }}
            />
            <Tab
              value={TEMPLATE}
              icon={<CollectionsIcon />}
              label="templates"
              sx={{
                width: '20%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(TEMPLATE);
                setMaxRefIndex(refs.length - 1);
              }}
            />
            <Tab
              value={UPLOAD}
              icon={<UploadFile />}
              label="upload"
              sx={{
                width: '20%',
                gridColumn: 'span 6'
              }}
              onClick={() => setRefMode(UPLOAD)}
            />
          </Tabs>

          {refMode === REFERENCE && (
            <MemeSelection
              inputImgs={imgs}
              setSelectedRefIndex={setSelectedRefIndex}
              setSelectedRefPath={setSelectedRefPath}
            />
          )}
          {refMode === TEMPLATE && <MemeSelection inputImgs={refs} />}
          {refMode === DRAFT && <MemeSelection inputImgs={posts} />}
          {refMode === UPLOAD && (
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
                onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}>
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
          )}
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
            {selectedRefIndex === maxRefIndex && (
              <ArrowForwardIosIcon disabled sx={{ color: light, gridColumn: 'span 1' }} />
            )}
            {selectedRefIndex >= 0 && selectedRefIndex < maxRefIndex && (
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
            <IconButton onClick={() => setIsDraft(!isDraft)}>
              {isDraft && <BookmarkIcon />}
              {!isDraft && <BookmarkBorderIcon />}
            </IconButton>
            <IconButton onClick={() => exportAsImage(exportRef.current, selectedRefPath)}>
              <Download />
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
                      onChange={handleFontColorChange}
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
                      onChange={handleFontColorChange}
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
                  onChange={handleFontColorChange}
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
                onChange={handleFontChange}>
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
                onChange={handleFontSizeChange}
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
          <UserImage gap="2rem" mr="1rem" image={picturePath} sx={{ gridColumn: 'span 1' }} />
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
            onClick={handlePost}
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
        </Box>
      </FlexBetween>
      {/* <FlexBetween>
           <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
                color={mediumMain}
                sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
                Image
            </Typography>
            </FlexBetween>

            {isNonMobileScreens ? (
            <>
                <FlexBetween gap="0.25rem" onClick={() => setIsGif(!isGif)}>
                <GifBoxOutlined sx={{ color: mediumMain }} />
                <Typography
                    color={mediumMain}
                    sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                    Clip
                </Typography>
                </FlexBetween>
            </>
            ) : (
            <FlexBetween gap="0.25rem">
                <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
            )}

        </FlexBetween> */}
    </WidgetWrapper>
  );
};

export default MemeEditorWidget;
