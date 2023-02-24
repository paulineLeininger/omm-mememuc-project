import { Box, Button, Typography, useTheme } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state';
import WidgetWrapper from 'components/WidgetWrapper';
import useAPI from 'hooks/useAPI';
import { useParams, Link } from 'react-router-dom';
import FlexBetween from 'components/FlexBetween';
import PostWidget from './PostWidget';
import MemeDialogWidget from './MemeDialogWidget';

const MemeFeedWidget = ({ feedUserId, isProfile = false, maxPosts }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const { getPosts, getUserPosts } = useAPI();
  const { palette } = useTheme();
  const { postId } = useParams();

  const [selectedPost, setSelectedPost] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [visibleCount, setVisibleCount] = useState(2); // show 10 items at a time
  const observerRef = useRef(null);

  useEffect(() => {
    console.log(token);
  }, [token]);

  useEffect(() => {
    if (postId) {
      setSelectedPost(postId);
      setDialogOpen(true);
    }
  }, [postId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prevCount) => prevCount + 2); // show 10 more items
        }
      },
      {
        rootMargin: '0px',
        threshold: 1.0
      }
    );
    observer.observe(observerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isProfile) {
      getUserPosts(feedUserId).then((res) => dispatch(setPosts({ posts: res })));
      console.log('get user post............');
    } else {
      getPosts().then((res) => dispatch(setPosts({ posts: res })));
      console.log('get post............');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper
      style={{
        display: 'flex-row',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      <Typography
        variant="h4"
        color={palette.neutral.dark}
        fontWeight="500"
        sx={{
          gridColumn: 'span 6'
        }}>
        {isProfile ? 'Your recent posts' : 'Explore recent memes'}
      </Typography>
      <Box maxWidth="400px" display="flex-row">
        {posts
          .slice(0)
          .reverse()
          .slice(0, maxPosts || visibleCount)
          .map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              userName,
              description,
              // topCaption,
              // bottomCaption,
              // topCaptionX,
              // bottomCaptionX,
              // topCaptionY,
              // bottomCaptionY,
              font,
              fontSize,
              fontColor,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                userName={userName}
                name={`${firstName} ${lastName}`}
                description={description}
                font={font}
                fontSize={fontSize}
                fontColor={fontColor}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
                openDetailView={(postid) => {
                  setDialogOpen(true);
                  setSelectedPost(postid);
                }}
              />
            )
          )}
        <div ref={observerRef} />
        {maxPosts && (
          <Link to="/feed">
            <Button> Show More </Button>
          </Link>
        )}
      </Box>
      <MemeDialogWidget
        isOpen={isDialogOpen}
        setOpen={setDialogOpen}
        postId={selectedPost}
        userId={user._id}
        isProfile={isProfile}
      />
    </WidgetWrapper>
  );
};

export default MemeFeedWidget;
