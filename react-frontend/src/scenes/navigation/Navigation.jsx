import React from 'react';
import useMediaQuery, { useTheme, Box, Typography, Stack } from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import Person2Icon from '@mui/icons-material/Person2';
import TextsmsIcon from '@mui/icons-material/Textsms';

const Navigation = ({ isMobile }) => {
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const pages = [
    {
      path: '/home',
      name: 'Home',
      icon: <HomeIcon />
    },
    {
      path: '/feed',
      name: 'Feed',
      icon: <TextsmsIcon />
    },
    {
      path: `/profile/${user._id}`,
      name: 'Your Profile',
      icon: <Person2Icon />
    }
  ];

  return (
    // <WidgetWrapper>
    <Box
      width="100%"
      // marginBottom="20px"
      paddingTop="1rem"
      //   display={isNonMobileScreens ? 'flex' : 'block'}
      gap="2rem">
      <Stack spacing={2}>
        {pages.map((page, id) => (
          <Stack direction="row" spacing={2}>
            {page.icon}
            <Link to={page.path} key={id}>
              <Typography
                variant="h4"
                color={palette.neutral.dark}
                fontWeight={location.pathname === page.path ? 600 : 200}>
                {page.name}
              </Typography>
            </Link>
          </Stack>
        ))}
      </Stack>
    </Box>
    // </WidgetWrapper>
  );
};

export default Navigation;
