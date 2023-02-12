import React from 'react';
import { useTheme, Box, Typography } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);

  return (
    // <WidgetWrapper>
    <Box
      width="100%"
      // marginBottom="20px"
      padding="1rem"
      //   display={isNonMobileScreens ? 'flex' : 'block'}
      gap="2rem"
      // justifyContent="center"
    >
      <Link to="/home">
        <Typography
          variant="h4"
          color={palette.neutral.dark}
          fontWeight="600"
          sx={{
            gridColumn: 'span 6'
          }}>
          Home
        </Typography>
      </Link>
      <Link to="/feed">
        <Typography
          variant="h4"
          color={palette.neutral.dark}
          fontWeight="600"
          sx={{
            gridColumn: 'span 6'
          }}>
          Feed
        </Typography>
      </Link>
      <Link to={`/profile/${user._id}`}>
        <Typography
          variant="h4"
          color={palette.neutral.dark}
          fontWeight="600"
          sx={{
            gridColumn: 'span 6'
          }}>
          Your Profile
        </Typography>
      </Link>
    </Box>
    // </WidgetWrapper>
  );
};

export default Navigation;
