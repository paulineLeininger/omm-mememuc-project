/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  refs: [],
  imgs: [],
  drafts: []
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
    setDrafts: (state, action) => {
      state.drafts = action.payload.drafts;
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
    },
    setDraft: (state, action) => {
      const updatedDrafts = state.drafts.map((draft) => {
        if (draft._id === action.payload.draft._id) return action.payload.draft;
        return draft;
      });
      state.drafts = updatedDrafts;
    }
  }
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setRefs,
  setImgs,
  setDraft,
  setDrafts
} = authSlice.actions;
export default authSlice.reducer;
