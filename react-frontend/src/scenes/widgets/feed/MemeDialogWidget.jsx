import * as React from 'react';
// import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled, useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState, useEffect } from 'react';
import { setPosts } from 'state';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import useAPI from 'hooks/useAPI';
import PostWidget from './MemePostWidget';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  const { palette } = useTheme();

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: palette.neutral.medium,
            '&:hover': { color: palette.neutral.dark }
          }}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const MemeDialogWidget = ({ postId, userId, isProfile = false, isOpen, setOpen }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  const [isShuffleChecked, setIsShuffleChecked] = React.useState(true);
  const [nextPostIndex, setNextPostIndex] = React.useState(0);
  const [currentPostId, setCurrentPostId] = React.useState();
  const [progress, setProgress] = React.useState(0);
  const [isSlideShow, setIsSlideShow] = React.useState(false);

  const { palette } = useTheme();

  const { getUserPosts, getPosts } = useAPI();

  useEffect(() => {
    setCurrentPostId(postId);
  }, [postId]);

  // // API call to server/routes/posts.js getFeedPosts
  // const getPosts = () => {
  //   fetch('http://localhost:3001/posts', {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //     .then((res) => res.json())
  //     .then((data) => dispatch(setPosts({ posts: data })));
  //   // const data = await response.json();
  // };

  // // API call to server/routes/posts.js getUserPosts
  // const getUserPosts = () => {
  //   fetch(`http://localhost:3001/posts/${userId}/posts`, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` }
  //   })
  //     .then((res) => res.json())
  //     .then((data) => dispatch(setPosts({ posts: data })));
  //   // const data = await response.json();
  // };

  useEffect(() => {
    if (isProfile) {
      getUserPosts(userId).then((res) => dispatch(setPosts({ posts: res }))); // TODO: DOES NOT WORK
    } else {
      getPosts().then((res) => dispatch(setPosts({ posts: res })));
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleShuffle = () => {
    const rand = Math.floor(Math.random() * posts.length);
    console.log(`rand: ${rand}`);
    setCurrentPostId(posts[rand]._id);
  };

  useEffect(() => {
    if (isSlideShow) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            console.log('timer finished');
            handleShuffle();
            return 0;
          }
          const diff = Math.random() * 10;
          return Math.min(oldProgress + diff, 100);
        });
      }, 300);

      clearInterval(timer);
    }
  }, [isSlideShow]);

  const handleSlideShow = () => {
    setIsSlideShow(!isSlideShow);
  };

  const handleClickNext = () => {
    for (let i = 0; i < posts.length; i += 1) {
      if (posts[i]._id === currentPostId) {
        const postIndex = i;
        if (postIndex < posts.length - 1) {
          setNextPostIndex(postIndex + 1);
          setCurrentPostId(posts[nextPostIndex]._id);
        }
      }
    }
  };

  const handleClickPrevious = () => {
    for (let i = 0; i < posts.length; i += 1) {
      if (posts[i]._id === currentPostId) {
        const postIndex = i;
        if (postIndex > 0) {
          setNextPostIndex(postIndex - 1);
          setCurrentPostId(posts[nextPostIndex]._id);
        }
      }
    }
  };

  const handleChange = (event) => {
    setIsShuffleChecked(event.target.isShuffleChecked);
  };

  return (
    <div>
      <BootstrapDialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={isOpen}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
          variant="h4"
          color={palette.neutral.dark}
          fontWeight="500">
          Post Details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <FormControlLabel
            control={
              <Switch
                checked={isShuffleChecked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="ShuffleMemes"
          />
          <Box>
            <FlexBetween>
              <DialogActions>
                {isShuffleChecked && !isSlideShow && (
                  <ArrowBackIosIcon
                    onClick={handleShuffle}
                    sx={{
                      color: palette.neutral.medium,
                      '&:hover': { color: palette.neutral.dark }
                    }}
                  />
                )}
                {nextPostIndex > 0 && !isShuffleChecked && !isSlideShow && (
                  <ArrowBackIosIcon
                    onClick={handleClickPrevious}
                    sx={{
                      color: palette.neutral.medium,
                      '&:hover': { color: palette.neutral.dark }
                    }}
                  />
                )}
                {(nextPostIndex === 0 && !isShuffleChecked) ||
                  (isSlideShow && (
                    <ArrowBackIosIcon
                      sx={{
                        color: palette.neutral.light
                      }}
                    />
                  ))}
              </DialogActions>
              {posts.map(
                ({
                  _id,
                  firstName,
                  lastName,
                  userName,
                  description,
                  location,
                  picturePath,
                  userPicturePath,
                  likes,
                  comments
                }) =>
                  currentPostId === _id && (
                    <PostWidget
                      key={_id}
                      postId={_id}
                      postUserId={userId}
                      userName={userName}
                      name={`${firstName} ${lastName}`}
                      description={description}
                      location={location}
                      picturePath={picturePath}
                      userPicturePath={userPicturePath}
                      likes={likes}
                      comments={comments}
                      isDetail
                    />
                  )
              )}
              <DialogActions>
                {isShuffleChecked && !isSlideShow && (
                  <ArrowForwardIosIcon
                    onClick={handleShuffle}
                    sx={{
                      color: palette.neutral.medium,
                      '&:hover': { color: palette.neutral.dark }
                    }}
                  />
                )}
                {nextPostIndex < posts.length - 1 && !isShuffleChecked && !isSlideShow && (
                  <ArrowForwardIosIcon
                    onClick={handleClickNext}
                    sx={{
                      color: palette.neutral.medium,
                      '&:hover': { color: palette.neutral.dark }
                    }}
                  />
                )}
                {(nextPostIndex === posts.length - 1 && !isShuffleChecked) ||
                  (isSlideShow && (
                    <ArrowForwardIosIcon
                      sx={{
                        color: palette.neutral.light
                      }}
                    />
                  ))}
              </DialogActions>
            </FlexBetween>
            <Box display="grid" gridTemplateColumns="repeat(6, minmax(0, 1fr))">
              <DialogActions>
                <Button sx={{ gridColumn: 'span 1' }} onClick={handleSlideShow}>
                  {!isSlideShow && <PlayCircleIcon />}
                  {isSlideShow && <PauseCircleIcon />}
                </Button>
              </DialogActions>
              <LinearProgress
                sx={{ gridColumn: 'span 5' }}
                variant="determinate"
                value={progress}
              />
            </Box>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
};
export default MemeDialogWidget;
