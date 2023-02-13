import { Box, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from 'scenes/navigation/NavBar';
import FriendListWidget from 'scenes/widgets/friends/FriendListWidget';
import MemeEditorWidget from 'scenes/widgets/editor/MemeEditorWidget';
import MemeFeedWidget from 'scenes/widgets/feed/FeedWidget';
import UserWidget from 'scenes/widgets/profile/UserWidget';
import PageWrapper from 'PageWrapper';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // TODO: not needed, state is saved in redux already
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <PageWrapper>
      <Box
        width="100%"
        // padding="2rem 6%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="center">
        <Box flexBasis={isNonMobileScreens ? '30%' : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
          <Box m="2rem 0" />
        </Box>
        <Box flexBasis={isNonMobileScreens ? '70%' : undefined}>
          <MemeFeedWidget isProfile />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default ProfilePage;
