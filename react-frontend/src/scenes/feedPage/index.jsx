import React from 'react';
import { Box } from '@mui/material';
import NavBar from 'scenes/navigation/NavBar';
import Navigation from 'scenes/navigation/Navigation';
import { useSelector } from 'react-redux';
import PageWrapper from 'PageWrapper';
import MemeFeedWidget from '../widgets/feed/FeedWidget';
import FriendListWidget from '../widgets/friends/FriendListWidget';

const FeedPage = () => {
  const user = useSelector((state) => state.user);
  return (
    <PageWrapper>
      <Box
        width="100%"
        // padding="2rem 6%"
        //   display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="center">
        {/* <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
        <UserWidget userId={userId} picturePath={user.picturePath} />
        <Box m="2rem 0" />
        <FriendListWidget userId={userId} />
      </Box> */}

        {/* <Box flexBasis={isNonMobileScreens ? '70%' : undefined}> */}
        <MemeFeedWidget isProfile={false} />
        {/* </Box> */}
      </Box>
    </PageWrapper>
  );
};

export default FeedPage;
