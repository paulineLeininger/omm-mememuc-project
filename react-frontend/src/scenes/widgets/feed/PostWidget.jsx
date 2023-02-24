import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined
} from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';
import useAPI from 'hooks/useAPI';
import Meme from 'components/Meme';

const PostWidget = ({
  postId,
  postUserId,
  userName,
  name,
  // topCaption,
  // bottomCaption,
  description,
  // topX,
  // topY,
  // bottomX,
  // bottomY,
  // font,
  // fontSize,
  // fontColor,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  openDetailView
  // isDetail = false
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  // const is_Detail = Object.keys(isDetail);

  const { palette } = useTheme();
  const { main } = palette.neutral;
  const primary = palette.primary.main;
  const { patchPostLike } = useAPI();

  const patchLike = async () => {
    // console.log(`post id: ${postId}`);
    patchPostLike(loggedInUserId, postId)
      .then((res) => res.json())
      .then((post) => dispatch(setPost({ post })));
  };

  const childCaptionPosToParent = (topCaptionPos, bottomCaptionPos) => {
    console.log('dummy');
  };

  useEffect(() => {
    console.log('like update');
  }, [likes]);

  return (
    <WidgetWrapper m="1rem 0" sx={{ backgroundColor: palette.neutral.light }}>
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
        <Button
          onClick={() => {
            openDetailView(postId);
            console.log('image clicked');
          }}>
          <img
            src={`http://localhost:3001/assets/${picturePath}`}
            style={{ objectFit: 'contain', width: '100%', maxWidth: '300px', borderRadius: '5px' }}
            alt="meme"
          />
        </Button>
      )}
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

        <IconButton>{/* <ShareOutlined /> */}</IconButton>
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

export default PostWidget;
