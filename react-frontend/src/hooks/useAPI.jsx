import useFetch from './useFetch';

const useAPI = () => {
  //   const posts = useSelector((state) => state.posts);

  const { getRequest, patchRequest, postRequest } = useFetch();

  // GET REQUESTS
  const getUserPosts = (userId) => getRequest(`http://localhost:3001/posts/${userId}/posts`);
  const getPosts = () => getRequest('http://localhost:3001/posts');
  const getRefs = () => getRequest('http://localhost:3001/refs');
  const getImgs = () => getRequest('http://localhost:3001/imgs');
  const getUser = (userId) => getRequest(`http://localhost:3001/users/${userId}`);

  // PATCH REQUESTS
  const patchPostLike = (userId, postId) =>
    patchRequest(`http://localhost:3001/posts/${postId}/like`, JSON.stringify({ userId }));

  // POST REQUESTS
  const postPosts = (postData) => postRequest('http://localhost:3001/posts', postData); // single post
  const postImg = (imgData) => postRequest('http://localhost:3001/imgs', imgData);
  return { getUserPosts, getPosts, patchPostLike, postPosts, postImg, getRefs, getImgs, getUser };
};

export default useAPI;
