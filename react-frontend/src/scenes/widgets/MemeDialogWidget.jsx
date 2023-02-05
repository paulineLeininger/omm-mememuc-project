import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PostWidget from './PostWidget';
import { useState } from "react";
import { setPosts } from "state";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function BootstrapDialogTitle(props) {
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
                "&:hover": { color: palette.neutral.dark }
            }}
            >
            <CloseIcon />
            </IconButton>
        ) : null}
        </DialogTitle>
    );
    }
    BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

const MemeDialogWidget = ({postId, userId, isProfile = false }) => { 
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const [open, setOpen] = React.useState(false);
    const [isShuffleChecked, setIsShuffleChecked] = React.useState(true);
    const [nextPostIndex, setNextPostIndex] = React.useState(0);
    const [post_id, setPost_id] = React.useState(postId);
    const [progress, setProgress] = React.useState(0);
    const [isSlideShow, setIsSlideShow] = React.useState(false);


    const { palette } = useTheme();     

    // API call to server/routes/posts.js getFeedPosts
    const getPosts = async () => {
        const response = await fetch("http://localhost:3001/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    };
    // API call to server/routes/posts.js getUserPosts
    const getUserPosts = async () => {
        const response = await fetch(
        `http://localhost:3001/posts/${userId}/posts`,
        {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    };

    useEffect(() => {
        if (isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        if (isSlideShow) {
            const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    console.log("timer finished");
                    handleShuffle();
                    return 0;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
            }, 300);

            return () => {
                clearInterval(timer);
            };
        }
  }, [isSlideShow]);

    const handleClickOpen = () => {
        setPost_id(postId);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setIsSlideShow(false);
    };

    const handleSlideShow = () => {
        setIsSlideShow(!isSlideShow);
    };

    const handleClickNext = () => {
        for (let i = 0; i < posts.length; i++){
            if (posts[i]._id === post_id) {
                const postIndex = i;
                if ((postIndex < (posts.length-1))){ 
                    setNextPostIndex(postIndex + 1);
                    setPost_id(posts[nextPostIndex]._id);
                }
            }
        }    
    };

    const handleClickPrevious = () => {
        for (let i = 0; i < posts.length; i++){
            if (posts[i]._id === post_id) {
                const postIndex = i;
                if ((postIndex > 0)){
                    setNextPostIndex(postIndex - 1);
                    setPost_id(posts[nextPostIndex]._id);
                }
            }  
        }   
    };

    const handleShuffle = () => { 
        const rand = Math.floor(Math.random() * posts.length)
        console.log("rand: " + rand);
        setPost_id(posts[rand]._id);
    };
    
    const handleChange = (event) => {
        setIsShuffleChecked(event.target.isShuffleChecked);
    };

    return (
        <div>
        <Button variant="outlined" width="100%" height="100%" onClick={handleClickOpen}>
            View Details
        </Button>
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <BootstrapDialogTitle id="customized-dialog-title"
                    onClose={handleClose}
                    variant="h4"
                    color={palette.neutral.dark}
                    fontWeight="500">
            Post Details
            </BootstrapDialogTitle>
                <DialogContent dividers>
                    <FormControlLabel control={
                        <Switch
                            checked={isShuffleChecked}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />} label="ShuffleMemes" />
                    <Box>
                        <FlexBetween>
                            <DialogActions>
                                {isShuffleChecked && !isSlideShow &&
                                <ArrowBackIosIcon onClick={handleShuffle}
                                    sx={{
                                        color: palette.neutral.medium,
                                        "&:hover": { color: palette.neutral.dark }
                                    }} />
                                } 
                                {nextPostIndex > 0 && !isShuffleChecked && !isSlideShow &&
                                <ArrowBackIosIcon onClick={handleClickPrevious}
                                    sx={{
                                        color: palette.neutral.medium,
                                        "&:hover": { color: palette.neutral.dark }
                                    }} />
                                } 
                                {(nextPostIndex === 0 && !isShuffleChecked) || isSlideShow && 
                                <ArrowBackIosIcon
                                    sx={{
                                        color: palette.neutral.light,
                                    }} />
                                }
                            
                        </DialogActions>
                        {posts.map(
                        ({
                        _id,
                        userId,
                        firstName,
                        lastName,
                        userName,
                        description,
                        location,
                        picturePath,
                        userPicturePath,
                        likes,
                        comments,
                        }) => ((post_id===_id) && (
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
                                isDetail={true}
                            />
                            )
                        )
                        )}
                            <DialogActions>
                                {isShuffleChecked && !isSlideShow &&
                                    <ArrowForwardIosIcon onClick={handleShuffle}
                                        sx={{
                                            color: palette.neutral.medium,
                                            "&:hover": { color: palette.neutral.dark }
                                        }} />
                                }
                                {nextPostIndex < (posts.length - 1) && !isShuffleChecked && !isSlideShow &&
                                    <ArrowForwardIosIcon onClick={handleClickNext}
                                        sx={{
                                            color: palette.neutral.medium,
                                            "&:hover": { color: palette.neutral.dark }
                                        }} />
                                }
                                {(nextPostIndex === (posts.length - 1) && !isShuffleChecked) || isSlideShow && 
                                <ArrowForwardIosIcon
                                    sx={{
                                        color: palette.neutral.light,
                                    }} />
                                }
                                </DialogActions>
                        </FlexBetween>
                        <Box display="grid"
                            gridTemplateColumns="repeat(6, minmax(0, 1fr))">
                        <DialogActions>
                            <Button sx={{gridColumn: "span 1"}} onClick={handleSlideShow}>
                                {!isSlideShow && 
                                    <PlayCircleIcon/>
                                }
                                {isSlideShow &&
                                    <PauseCircleIcon/>
                                }
                            </Button>
                            </DialogActions>
                            <LinearProgress sx={{gridColumn: "span 5"}} variant="determinate" value={progress} />
                        </Box>
                        </Box>
                </DialogContent>
        </BootstrapDialog>
        </div>
    );
}; 
export default MemeDialogWidget;