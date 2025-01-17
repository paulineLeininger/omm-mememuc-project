import { useState } from 'react';
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { DarkMode, LightMode, Menu, Close } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode, setLogout } from 'state';
import { useNavigate } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import Navigation from './Navigation';

const NavBar = () => {
  const [isMobileMenuToggled, setMobileMenuToggled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreen = useMediaQuery('(min-width:1000px)'); // hook into mui

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const { dark } = theme.palette.neutral;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const { alt } = theme.palette.background;

  const fullName = `${user.userName}`;

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="primary"
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: primaryLight,
              cursor: 'pointer'
            }
          }}>
          MemeGenerator
        </Typography>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreen ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkMode sx={{ fontSize: '25px' }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: '25px' }} />
            )}
          </IconButton>
          <Select
            value={fullName}
            sx={{
              backgroundColor: neutralLight,
              width: '150px',
              borderRadius: '0.25rem',
              p: '0.25rem 1rem',
              '& .MuiSvGIcon-root': {
                pr: '0.25rem',
                width: '3rem'
              },
              '& .MuiSelect-select:focus': {
                backgroundColor: neutralLight
              }
            }}
            input={<InputBase />}>
            <MenuItem value={fullName}>
              <Typography>{fullName}</Typography>
            </MenuItem>
            <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
          </Select>
        </FlexBetween>
      ) : (
        <IconButton onClick={() => setMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}
      {/* MOBILE NAV */}
      {!isNonMobileScreen && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}>
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem">
            <Box justifyContent="center">
              <Navigation />
            </Box>
            <IconButton onClick={() => dispatch(setMode())} sx={{ fontSize: '25px' }}>
              {theme.palette.mode === 'dark' ? (
                <DarkMode sx={{ fontSize: '25px' }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: '25px' }} />
              )}
            </IconButton>
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: '150px',
                  borderRadius: '0.25rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem'
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: neutralLight
                  }
                }}
                input={<InputBase />}>
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};
export default NavBar;
