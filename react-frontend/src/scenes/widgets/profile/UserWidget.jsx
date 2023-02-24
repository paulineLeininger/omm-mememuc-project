import { ManageAccountsOutlined, LocationOnOutlined } from '@mui/icons-material';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAPI from 'hooks/useAPI';

const UserWidget = ({ userId, picturePath }) => {
  const { getUser } = useAPI();
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { dark } = palette.neutral;
  const { medium } = palette.neutral;
  const { main } = palette.neutral;

  // this is called when you render this component for the first time
  useEffect(() => {
    getUser(userId).then((res) => setUser(res));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  // destructure items from the user
  const { firstName, lastName, userName, location, friends } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem" // padding bottom
        onClick={() => navigate(`/profile/${userId}`)}>
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                '&:hover': {
                  color: palette.primary.light,
                  cursor: 'pointer'
                }
              }}>
              {userName}
            </Typography>
            <Typography pt="0.5rem" color={medium}>
              {firstName} {lastName} | {friends.length} friends
            </Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
