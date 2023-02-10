import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';

// horizontale galerie in meme editor
const MemeSelection = ({ inputImgs, setSelectedRefIndex, setSelectedRefPath }) => {
  const { palette } = useTheme();
  const { medium } = palette.neutral;
  return (
    <Box
      display="flex"
      borderRadius="5px"
      p="0.5rem"
      sx={{
        overflow: 'auto',
        gridColumn: 'span 6',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
      {inputImgs.map((img, index) => (
        <FlexBetween key={index}>
          <Button
            onClick={() => {
              setSelectedRefPath(img.picturePath);
              setSelectedRefIndex(index);
            }}
            width="70px"
            height="70px"
            alt="ref"
            sx={{
              color: medium,
              '&:focus': {
                border: 1,
                borderColor: palette.primary.dark
              }
            }}
            p="1rem">
            <img
              src={`http://localhost:3001/assets/${img.picturePath}`}
              style={{ objectFit: 'cover', borderRadius: '5px' }}
              width="70px"
              height="70px"
              alt="ref"
              // p="1rem"
            />
          </Button>
        </FlexBetween>
      ))}
    </Box>
  );
};

export default MemeSelection;
