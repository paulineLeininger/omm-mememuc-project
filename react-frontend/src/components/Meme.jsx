import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined
} from '@mui/icons-material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import exportAsImage from 'helpers/exportAsImage';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
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
  MenuItem
} from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setRefs, setImgs } from 'state';
import Draggable from 'react-draggable';

const Meme = ({
  childToParent: childCaptionPosToParent,
  isDraggable,
  exportRef,
  selectedRefPath,
  topCaption,
  bottomCaption,
  font,
  fontSize,
  fontColor,
  topX,
  topY,
  bottomX,
  bottomY,
  fontBackground,
  canvasHeight,
  canvasWidth
}) => {
  const { palette } = useTheme();
  const [outline, setOutline] = useState('white');
  const [topCaptionPos, setTopCaptionPos] = useState({ x: 0, y: 0 });
  const [bottomCaptionPos, setBottomCaptionPos] = useState({ x: 0, y: 0 });
  const topCaptionRef = useRef();
  const bottomCaptionRef = useRef();
  const imageRef = useRef();
  const topTextRef = useRef();
  const bottomTextRef = useRef();

  useEffect(() => {
    console.log(`topCaption is effect: x=${topCaptionPos.x} y=${topCaptionPos.y}`);
    childCaptionPosToParent(topCaptionPos, bottomCaptionPos);
  }, [topCaptionPos]);

  useEffect(() => {
    childCaptionPosToParent(topCaptionPos, bottomCaptionPos);
  }, [bottomCaptionPos]);

  const onTopCaptionStop = (e, data) => {
    const newX = data.x + topCaptionRef.current.offsetLeft;
    const imageWidth = imageRef.current.clientWidth;
    const newY = data.y + topCaptionRef.current.offsetTop;
    const imageHeight = imageRef.current.clientHeight;
    setTopCaptionPos({
      x: Math.floor((newX / imageWidth) * 100),
      y: Math.floor((newY / imageHeight) * 100)
    });
    console.log(`topCaption is: x=${topCaptionPos.x} y=${topCaptionPos.y}`);
  };

  const onBottomCaptionStop = (e, data) => {
    const newX = data.x + bottomCaptionRef.current.offsetLeft;
    const imageWidth = imageRef.current.clientWidth;
    const newY = data.y + bottomCaptionRef.current.offsetTop;
    const imageHeight = imageRef.current.clientHeight;
    setBottomCaptionPos({
      x: Math.floor((newX / imageWidth) * 100),
      y: Math.floor((newY / imageHeight) * 100)
    });
  };

  useEffect(() => {
    if (fontColor === 'white' || fontColor === 'yellow') {
      setOutline('black');
    } else {
      setOutline('grey');
    }
  }, [fontColor]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={exportRef}
      style={{
        position: 'relative',
        objectFit: 'contain',
        display: 'flex',
        justifyContent: 'center'
      }}>
      <img
        ref={imageRef}
        src={`http://localhost:3001/assets/${selectedRefPath}`}
        style={{ objectFit: 'contain', width: '100%', borderRadius: '5px' }}
        alt="Select or upload a Reference first..."
        // sx={{
        //   gridColumn: 'span 4'
        // }}
      />

      <Draggable onStop={onTopCaptionStop} bounds="parent" disabled={!isDraggable}>
        <Box
          ref={topCaptionRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          position="absolute"
          top={`${topY}%`}
          left={`${topX}%`}
          width="fit-content"
          sx={{ '&:hover': { border: `1px dashed ${palette.primary.main}` } }}>
          <Typography
            ref={topTextRef}
            variant="h4"
            color={fontColor}
            fontWeight="500"
            style={{
              fontFamily: font,
              fontSize: `${fontSize / 2}rem`,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textShadow: `2px 2px ${outline}`,
              cursor: 'grab'
            }}>
            {topCaption}
          </Typography>
        </Box>
      </Draggable>
      <Draggable onStop={onBottomCaptionStop} bounds="parent" disabled={!isDraggable}>
        <Box
          ref={bottomCaptionRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          position="absolute"
          top={`${bottomY}%`}
          left={`${bottomX}%`}
          width="fit-content"
          sx={{ '&:hover': { border: `1px dashed ${palette.primary.main}` } }}>
          <Typography
            ref={bottomTextRef}
            variant="h4"
            color={fontColor}
            fontWeight="500"
            style={{
              fontSize: `${fontSize / 2}rem`,
              fontFamily: font,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textShadow: `2px 2px ${outline}`,
              cursor: 'grab'
            }}>
            {bottomCaption}
          </Typography>
        </Box>
      </Draggable>
    </div>
  );
};
export default Meme;
