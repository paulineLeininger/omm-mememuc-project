import React, { useState } from 'react';
import { Box, Button, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';

// horizontale galerie in meme editor
const MemeSelection = ({ inputImgs, selectedRefIndex, setSelectedRefIndex }) => {
  const { palette } = useTheme();
  const { medium } = palette.neutral;
  return (
    <Box
      display="flex"
      borderRadius="5px"
      sx={{
        overflow: 'auto',
        // gridColumn: 'span 6',
        '&::-webkit-scrollbar': { display: 'none' }
      }}>
      {inputImgs.map((img, index) => (
        <FlexBetween key={index}>
          <Button
            onClick={() => {
              setSelectedRefIndex(index);
            }}
            width="70px"
            height="70px"
            alt="ref"
            sx={{
              color: medium,
              border: index === selectedRefIndex ? 1 : 'none',
              borderColor: index === selectedRefIndex ? palette.primary.dark : 'none'
            }}
            m="1rem">
            <img
              src={`http://localhost:3001/assets/${img}`}
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
