import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import Form from './Form';

const LoginPage = () => {
  const isNonMobileScreen = useMediaQuery('(min-width:1000px)'); // hook into mui

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const { dark } = theme.palette.neutral;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const { alt } = theme.palette.background;
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center">
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          MemeGenerator
        </Typography>
      </Box>
      <Box
        width={isNonMobileScreen ? '50%' : '93%'}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}>
        <Typography fontWeight="500" variant="h5" sx={{ mb: '1.5rem' }}>
          Welcome to the OMM23 MemeGenerator, enjoy!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};
export default LoginPage;
