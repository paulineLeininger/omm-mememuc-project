import React from 'react';
import { useMediaQuery, Box } from '@mui/material';
import NavBar from 'scenes/navigation/NavBar';
import Navigation from 'scenes/navigation/Navigation';

const PageWrapper = ({ children }) => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  return (
    <>
      <NavBar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="0.5rem"
        justifyContent="space-between">
        {isNonMobileScreens && (
          <Box flexBasis="20%">
            <Navigation />
          </Box>
        )}

        <Box
          flexBasis={isNonMobileScreens ? '80%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}>
          {children}
        </Box>
      </Box>
    </>
  );
};

export default PageWrapper;
