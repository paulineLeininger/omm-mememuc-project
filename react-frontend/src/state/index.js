/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import useAPI from 'hooks/useAPI';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  refs: [],
  imgs: []
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent :(');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setRefs: (state, action) => {
      state.refs = action.payload.refs;
    },
    setImgs: (state, action) => {
      state.imgs = action.payload.imgs;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    }
    /* setRef: (state, action) => {
        const updatedRefs = state.refs.map((ref) => {
            if (ref._id === action.payload.ref._id) return action.payload.refs;
            return ref;
        });
        state.refs = updatedRefs;
        }, */
  }
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost, setRefs, setImgs } =
  authSlice.actions;
export default authSlice.reducer;
