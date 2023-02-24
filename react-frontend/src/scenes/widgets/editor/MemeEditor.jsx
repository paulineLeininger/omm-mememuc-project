import React, { useState } from 'react';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useTheme, Box, Tabs, Tab, Typography } from '@mui/material';
import {
  ImageSearch as ImageSearchIcon,
  Collections as CollectionsIcon,
  CollectionsBookmark as CollectionsBookmarkIcon,
  BrowseGallery as BrowseGalleryIcon,
  UploadFile
} from '@mui/icons-material';
import References from './References';
import Drafts from './Drafts';

const MemeEditor = () => {
  const REFERENCE = 'reference';
  const TEMPLATE = 'template';
  const HISTORY = 'history';
  const DRAFT = 'draft';

  const { palette } = useTheme();

  const [selectedTab, setRefMode] = useState(REFERENCE);

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <Box display="grid" gap="6px" width="100%" gridTemplateColumns="repeat(6, minmax(0, 1fr))">
          <Typography
            variant="h4"
            color={palette.neutral.dark}
            fontWeight="500"
            sx={{
              gridColumn: 'span 6'
            }}>
            Create your own Meme
          </Typography>
          <Tabs
            value={selectedTab}
            display="flex"
            sx={{
              width: '100%',
              gridColumn: 'span 6',
              borderRadius: '0.5rem',
              p: '0.25rem 0rem'
            }}>
            <Tab
              value={REFERENCE}
              icon={<ImageSearchIcon />}
              label="references"
              sx={{
                width: '50%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(REFERENCE);
                // setMaxRefIndex(refs.length - 1);
              }}
            />
            {/* <Tab
              value={HISTORY}
              icon={<BrowseGalleryIcon />}
              label="history"
              sx={{
                width: '33%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(HISTORY);
                // setMaxRefIndex(refs.length - 1);
              }}
            /> */}
            <Tab
              value={DRAFT}
              icon={<CollectionsBookmarkIcon />}
              label="drafts"
              sx={{
                width: '50%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(DRAFT);
                // setMaxRefIndex(refs.length - 1);
              }}
            />
            {/* <Tab
              value={TEMPLATE}
              icon={<CollectionsIcon />}
              label="templates"
              sx={{
                width: '25%',
                gridColumn: 'span 6'
              }}
              onClick={() => {
                setRefMode(TEMPLATE);
                // setMaxRefIndex(refs.length - 1);
              }}
            /> */}
          </Tabs>
          {selectedTab === REFERENCE && <References />}
          {/* {selectedTab === HISTORY && <History />} */}
          {selectedTab === DRAFT && <Drafts />}
          {/* {selectedTab === TEMPLATE && <Templates />} */}
        </Box>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MemeEditor;
