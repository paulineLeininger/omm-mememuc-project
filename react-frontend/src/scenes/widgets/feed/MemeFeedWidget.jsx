import { Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state';
import WidgetWrapper from 'components/WidgetWrapper';
import useAPI from 'hooks/useAPI';
import PostWidget from './MemePostWidget';
import MemeDialogWidget from './MemeDialogWidget';

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const { getPosts, getUserPosts } = useAPI();

  const [selectedPost, setSelectedPost] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    console.log(token);
  }, [token]);

  // // API call to server/routes/posts.js getFeedPosts
  // const getPosts = async () => {
  //   const response = await fetch('http://localhost:3001/posts', {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   const data = await response.json();
  //   dispatch(setPosts({ posts: data }));
  // };

  // // API call to server/routes/posts.js getUserPosts
  // const getUserPosts = async () => {
  //   const response = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
  //     method: 'GET',
  //     headers: { Authorization: `Bearer ${token}` }
  //   });
  //   const data = await response.json();
  //   dispatch(setPosts({ posts: data }));
  // };

  useEffect(() => {
    if (isProfile) {
      getUserPosts(userId).then((res) => dispatch(setPosts({ posts: res })));
      console.log('get user post............');
    } else {
      getPosts().then((res) => dispatch(setPosts({ posts: res })));
      console.log('get post............');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography> Explore popular memes</Typography>
      {posts?.map(
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
        }) => (
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
            openDetailView={(postid) => {
              setDialogOpen(true);
              setSelectedPost(postid);
            }}
          />
        )
      )}
      <MemeDialogWidget
        isOpen={isDialogOpen}
        setOpen={setDialogOpen}
        postId={selectedPost}
        userId={userId}
        isProfile={isProfile}
      />
    </WidgetWrapper>
  );
};

export default PostsWidget;