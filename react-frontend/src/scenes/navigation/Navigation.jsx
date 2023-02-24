import React from 'react';
import { useTheme, Box, Typography, Stack } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomeIcon from '@mui/icons-material/Home';
import Person2Icon from '@mui/icons-material/Person2';
import TextsmsIcon from '@mui/icons-material/Textsms';

const Navigation = () => {
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
    <Box width="100%" paddingTop="1rem" gap="2rem">
      <Stack spacing={2}>
        {pages.map((page, id) => (
          <Stack direction="row" spacing={2} key={id}>
            {page.icon}
            <Link to={page.path}>
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
  );
};

export default Navigation;
