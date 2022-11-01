import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../helpers/consts';

const commentsAdapter = createEntityAdapter();

const initialState = commentsAdapter.getInitialState({
  commentsLoadingStatus: 'idle',
  activePost: null,
});

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (post_id) => await axios.get(url + `/api/posts/${post_id}/comments`)
);

export const fetchAddComment = createAsyncThunk(
  'comments/fetchAddComment',
  async ({ post_id, data }) => await axios.post(url + `/api/posts/${post_id}/comments`, data)
);

export const fetchCommentById = createAsyncThunk(
  'comments/fetchCommentById',
  async (comment_id) => await axios.get(url + `/api/comments/${comment_id}`)
);

export const fetchUpdateComment = createAsyncThunk(
  'comments/fetchUpdateComment',
  async ({ comment_id, data }) => await axios.patch(url + `/api/comments/${comment_id}`, data)
);

export const fetchDeleteComment = createAsyncThunk(
  'comments/fetchDeleteComment',
  async (comment_id) => await axios.delete(url + `/api/comments/${comment_id}`)
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    activePostChanged: (state, action) => {
      state.activePost = action.payload;
    },
    commentCreated: (state, action) => {
      commentsAdapter.addOne(state, action.payload);
    },
    commentDeleted: (state, action) => {
      commentsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => { state.commentsLoadingStatus = 'loading'; })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.commentsLoadingStatus = 'idle';
        commentsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchComments.rejected, state => { state.commentsLoadingStatus = 'error'; })

      .addDefaultCase(() => { });
  },
});

const { actions, reducer } = commentsSlice;

export default reducer;

export const {
  activePostChanged,
  commentCreated,
  commentDeleted,
} = actions;