import React from 'react';
import { Box } from '@mui/material';
import PageWrapper from 'PageWrapper';
import MemeFeedWidget from '../widgets/feed/FeedWidget';

const FeedPage = () => (
  <PageWrapper>
    <Box width="100%" gap="2rem" justifyContent="center">
      <MemeFeedWidget isProfile={false} />
    </Box>
  </PageWrapper>
);

export default FeedPage;
