import { Box, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import UserWidget from 'scenes/widgets/profile/UserWidget';
import MemeFeedWidget from 'scenes/widgets/feed/FeedWidget';
import NavBar from 'scenes/navigation/NavBar';
import FriendListWidget from 'scenes/widgets/friends/FriendListWidget';
import MemeEditor from 'scenes/widgets/editor/MemeEditor';
import Navigation from 'scenes/navigation/Navigation';
import PageWrapper from 'PageWrapper';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const { _id, picturePath } = useSelector((state) => state.user);

  return (
    <PageWrapper>
      <Box
        width="100%"
        display={isNonMobileScreens ? 'flex' : 'block'}
        gap="2rem"
        justifyContent="space-between">
        <Box
          flexBasis={isNonMobileScreens ? '70%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}>
          {/* <MemeEditorWidget picturePath={picturePath} /> */}
          <MemeEditor />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? '30%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}>
          <MemeFeedWidget maxPosts={4} />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default HomePage;
