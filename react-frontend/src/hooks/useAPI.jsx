import useFetch from './useFetch';

const useAPI = () => {
  const { getRequest, patchRequest, postRequest } = useFetch();

  // GET REQUESTS
  const getUserPosts = (userId) => getRequest(`http://localhost:3001/posts/${userId}/posts`);
  const getPosts = () => getRequest('http://localhost:3001/posts');
  const getRefs = () => getRequest('http://localhost:3001/refs');
  const getDrafts = (userId) => getRequest(`http://localhost:3001/drafts/${userId}`);
  const getImgs = () => getRequest('http://localhost:3001/imgs');
  const getUser = (userId) => getRequest(`http://localhost:3001/users/${userId}`);
  const getProxyImage = (imageUrl) =>
    getRequest(`http://localhost:3001/imgs/proxy-image?imageUrl=${imageUrl}`);

  // PATCH REQUESTS
  const patchPostLike = (userId, postId) =>
    patchRequest(`http://localhost:3001/posts/${postId}/like`, JSON.stringify({ userId }));
  const patchAddComment = (userId, postId, comment) =>
    patchRequest(
      `http://localhost:3001/posts/${postId}/comment`,
      JSON.stringify({ userId, comment })
    );

  // POST REQUESTS
  const postPosts = (postData) => postRequest('http://localhost:3001/posts', postData); // single post
  const postDraft = (postData) => postRequest('http://localhost:3001/drafts', postData); // single post
  const postImg = (imgData) => postRequest('http://localhost:3001/imgs', imgData);
  return {
    getUserPosts,
    getPosts,
    patchPostLike,
    patchAddComment,
    postPosts,
    postImg,
    getRefs,
    getImgs,
    getUser,
    getDrafts,
    postDraft,
    getProxyImage
  };
};

export default useAPI;
