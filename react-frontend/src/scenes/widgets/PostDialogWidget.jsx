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

const PostDialogWidget = ({postId, userId, isProfile = false }) => { 
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);
    const [open, setOpen] = React.useState(false);

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
            console.log("get user post............");
        } else {
            getPosts();
            console.log("get post............");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
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
                    fontWeight="500"
                    sx={{
                        gridColumn: "span 6"
                    }}>
            Post Details
            </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Box>
                        <FlexBetween>
                        <DialogActions>
                            <ArrowBackIosIcon onClick={handleClose}
                                sx={{
                                    color: palette.neutral.medium,
                                    "&:hover": { color: palette.neutral.dark }
                                }} />
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
                        }) => ((postId===_id) && (
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
                            />
                            )
                        )
                        )}
                        <DialogActions>
                            <ArrowForwardIosIcon onClick={handleClose}
                                sx={{
                                    color: palette.neutral.medium,
                                    "&:hover": { color: palette.neutral.dark }
                                }} />
                                </DialogActions>
                            </FlexBetween>
                        </Box>
                </DialogContent>
        </BootstrapDialog>
        </div>
    );
}; 
export default PostDialogWidget;