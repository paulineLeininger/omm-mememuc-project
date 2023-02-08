import { Box } from '@mui/material';
import { flexbox, styled } from '@mui/system';

//allows us to reuse these css properties in different areas
const FlexBetween = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export default FlexBetween;
