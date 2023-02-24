import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import Draggable from 'react-draggable';

const Meme = ({
  childToParent: childCaptionPosToParent,
  isDraggable,
  exportRef,
  selectedRefPath,
  topCaption,
  middleCaption,
  bottomCaption,
  font,
  fontSize,
  fontColor,
  topX,
  topY,
  middleX,
  middleY,
  bottomX,
  bottomY
}) => {
  const { palette } = useTheme();
  const [outline, setOutline] = useState('white');
  const [hoverBorder, setHoverBorder] = useState(1);
  const [recalcFontSize, setRecalcFontSize] = useState(3);
  const [topCaptionPos, setTopCaptionPos] = useState({ x: 0, y: 0 });
  const [middleCaptionPos, setMiddleCaptionPos] = useState({ x: 0, y: 0 });
  const [bottomCaptionPos, setBottomCaptionPos] = useState({ x: 0, y: 0 });
  const topCaptionRef = useRef();
  const middleCaptionRef = useRef();
  const bottomCaptionRef = useRef();
  const imageRef = useRef();
  const topTextRef = useRef();
  const middleTextRef = useRef();
  const bottomTextRef = useRef();

  useEffect(() => {
    if (!isDraggable) {
      setHoverBorder(0);
    }
    const imageWidth = imageRef.current.clientWidth;
    setRecalcFontSize(fontSize * imageWidth * 0.1);
  }, []);

  useEffect(() => {
    childCaptionPosToParent(topCaptionPos, middleCaptionPos, bottomCaptionPos);
  }, [topCaptionPos]);

  useEffect(() => {
    childCaptionPosToParent(topCaptionPos, middleCaptionPos, bottomCaptionPos);
  }, [middleCaptionPos]);

  useEffect(() => {
    childCaptionPosToParent(topCaptionPos, middleCaptionPos, bottomCaptionPos);
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
  };

  const onMiddleCaptionStop = (e, data) => {
    const newX = data.x + middleCaptionRef.current.offsetLeft;
    const imageWidth = imageRef.current.clientWidth;
    const newY = data.y + middleCaptionRef.current.offsetTop;
    const imageHeight = imageRef.current.clientHeight;
    setMiddleCaptionPos({
      x: Math.floor((newX / imageWidth) * 100),
      y: Math.floor((newY / imageHeight) * 100)
    });
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

  useEffect(() => {
    const imageWidth = imageRef.current.clientWidth;
    setRecalcFontSize(fontSize * imageWidth * 0.1);
  }, [topCaption]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const imageWidth = imageRef.current.clientWidth;
    setRecalcFontSize(fontSize * imageWidth * 0.1);
  }, [bottomCaption]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const imageWidth = imageRef.current.clientWidth;
    setRecalcFontSize(fontSize * imageWidth * 0.1);
  }, [fontSize]); // eslint-disable-line react-hooks/exhaustive-deps

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
        src={selectedRefPath && `http://localhost:3001/assets/${selectedRefPath}`}
        style={{ objectFit: 'contain', width: '100%', borderRadius: '5px' }}
        alt="Select or upload a Reference first..."
        height="340vw"
        width="auto"
      />

      <Draggable onStop={onTopCaptionStop} bounds="parent" disabled={!isDraggable}>
        <Box
          ref={topCaptionRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          position="absolute"
          top={`${topY}%`}
          left={`${topX}%`}
          width="fit-content"
          sx={{ '&:hover': { border: `${hoverBorder}px ${palette.primary.main}` } }}>
          <Typography
            ref={topTextRef}
            variant="h4"
            color={fontColor}
            fontWeight="500"
            style={{
              fontFamily: font,
              fontSize: `${recalcFontSize}%`,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textShadow: `2px 2px ${outline}`,
              cursor: 'grab'
            }}>
            {topCaption}
          </Typography>
        </Box>
      </Draggable>
      <Draggable onStop={onMiddleCaptionStop} bounds="parent" disabled={!isDraggable}>
        <Box
          ref={middleCaptionRef}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          position="absolute"
          top={`${middleY}%`}
          left={`${middleX}%`}
          width="fit-content"
          sx={{ '&:hover': { border: `${hoverBorder}px ${palette.primary.main}` } }}>
          <Typography
            ref={middleTextRef}
            variant="h4"
            color={fontColor}
            fontWeight="500"
            style={{
              fontFamily: font,
              fontSize: `${recalcFontSize}%`,
              textTransform: 'uppercase',
              fontWeight: 'bold',
              textShadow: `2px 2px ${outline}`,
              cursor: 'grab'
            }}>
            {middleCaption}
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
          sx={{ '&:hover': { border: `${hoverBorder}px ${palette.primary.main}` } }}>
          <Typography
            ref={bottomTextRef}
            variant="h4"
            color={fontColor}
            fontWeight="500"
            style={{
              fontSize: `${recalcFontSize}%`,
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
