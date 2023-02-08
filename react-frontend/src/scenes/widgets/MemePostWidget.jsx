import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined
} from '@mui/icons-material';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';
import MemeDialogWidget from './MemeDialogWidget';
import Meme from 'components/Meme';

const MemePostWidget = ({
  postId,
  postUserId,
  userName,
  name,
  topCaption = "",
  bottomCaption = "",
  description = "",
  topX,
  topY,
  bottomX,
  bottomY,
  font,
  fontSize,
  fontColor,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isDetail = false
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const is_Detail = Object.keys(isDetail);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: loggedInUserId })
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const childCaptionPosToParent = (topCaptionPos, bottomCaptionPos) => {
    console.log("dummy");
    //setTopCaptionPosEd(topCaptionPos);
    //setBottomCaptionPosEd(bottomCaptionPos);
  };

  return (
    <WidgetWrapper m="2rem 0" sx={{ backgroundColor: palette.neutral.light }}>
      <Friend
        friendId={postUserId}
        userName={userName}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: '1rem' }}>
        {description}
      </Typography>
      {picturePath && (
        /*<img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />*/
        <Meme
              childToParent={childCaptionPosToParent}
              isDraggable={false}
              exportRef={null}
              selectedRefPath={picturePath}
              topCaption={topCaption}
              bottomCaption={bottomCaption}
              topX={topX}
              bottomX={bottomX}
              topY={topY}
              bottomY={bottomY}
              font={font}
              fontSize={fontSize}
              fontColor={fontColor}
              fontBackground={''}
              canvasHeight={0}
              canvasWidth={0}
        />
      )}
      {!isDetail && <MemeDialogWidget postId={postId} userId={postUserId} />}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>{/*<ShareOutlined />*/}</IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>{comment}</Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default MemePostWidget;
