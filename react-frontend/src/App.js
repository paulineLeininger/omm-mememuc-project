import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage'; // path like this possible via jsconfig
import ProfilePage from 'scenes/profilePage';
import LoginPage from 'scenes/loginPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery, Box, CssBaseline, CssBaselineProps, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import MemeFeedWidget from 'scenes/widgets/feed/FeedWidget';
import FeedPage from 'scenes/feedPage';
import NavBar from 'scenes/navigation/NavBar';
import UserWidget from 'scenes/widgets/profile/UserWidget';
import Navigation from 'scenes/navigation/Navigation';
import { themeSettings } from './theme';

const App = () => {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const isNonMobileScreens = useMediaQuery('(min-width:1000px)');
  const user = useSelector((state) => state.user);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
            <Route path="/feed" element={<FeedPage />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
