import { Box, useMediaQuery } from '@mui/material';
import MemeFeedWidget from 'scenes/widgets/feed/FeedWidget';
import MemeEditor from 'scenes/widgets/editor/MemeEditor';
import PageWrapper from 'PageWrapper';

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');

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
