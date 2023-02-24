import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  Send as SendIcon
} from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Typography, useTheme, InputBase } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from 'state';
import useAPI from 'hooks/useAPI';

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
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const { main } = palette.neutral;
  const primary = palette.primary.main;
  const { patchPostLike, patchAddComment } = useAPI();

  const patchLike = async () => {
    patchPostLike(loggedInUserId, postId)
      .then((res) => res.json())
      .then((post) => dispatch(setPost({ post })));
  };

  const patchComment = async () => {
    patchAddComment(loggedInUserId, postId, comment)
      .then((res) => res.json())
      .then((post) => dispatch(setPost({ post })));
  };

  useEffect(() => {
    console.log('like update');
  }, [likes]);

  useEffect(() => {
    console.log('comment added');
  }, [comment]);

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
            style={{ objectFit: 'contain', width: '100%', borderRadius: '5px' }}
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
      </FlexBetween>
      {isComments && (
        <>
          <Box mt="0.5rem">
            {comments.map((comm, i) => (
              <Box key={`${name}-${i}`} sx={{ gridColumn: 'span 6' }}>
                <Divider />
                <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>{comm}</Typography>
              </Box>
            ))}
            <Divider />
          </Box>
          <FlexBetween>
            <InputBase
              placeholder="Comment"
              onChange={(e) => setComment(e.target.value)}
              sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: '0.5rem',
                padding: '1rem',
                gridColumn: 'span 5'
              }}
            />
            <IconButton sx={{ gridColumn: 'span 1' }} onClick={patchComment}>
              {' '}
              <SendIcon />{' '}
            </IconButton>
          </FlexBetween>
        </>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
