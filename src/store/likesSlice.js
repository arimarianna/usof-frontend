import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../helpers/consts';


const likesAdapter = createEntityAdapter();

const initialState = likesAdapter.getInitialState({
  likesLoadingStatus: 'idle',
  commentId: null,
  comments: [],
  active: [],
});

export const fetchPostLikes = createAsyncThunk(
  'likes/fetchPostLikes',
  async (post_id) => await axios.get(url + `/api/posts/${post_id}/like`)
);

export const fetchPostSetLike = createAsyncThunk(
  'likes/fetchPostSetLike',
  async (post_id) => await axios.post(url + `/api/posts/${post_id}/like`)
);

export const fetchPostUnsetLike = createAsyncThunk(
  'likes/fetchPostUnsetLike',
  async (post_id) => await axios.delete(url + `/api/posts/${post_id}/like`)
);

export const fetchCommentLikes = createAsyncThunk(
  'likes/fetchCommentLikes',
  async (comment_id) => await axios.get(url + `/api/comments/${comment_id}/like`)
);

export const fetchCommentSetLike = createAsyncThunk(
  'likes/fetchCommentSetLike',
  async (comment_id) => await axios.post(url + `/api/comments/${comment_id}/like`)
);

export const fetchCommentUnsetLike = createAsyncThunk(
  'likes/fetchCommentUnsetLike',
  async (comment_id) => await axios.delete(url + `/api/comments/${comment_id}/like`)
);

const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCommentLikes.pending, state => { state.likesLoadingStatus = 'loading'; })
      .addCase(fetchCommentLikes.fulfilled, (state, action) => {
        state.likesLoadingStatus = 'idle';

        if (!action.payload.data[0]) return;

        if (state.commentId === null || action.payload.data[0] !== state.comment_id) {
          state.commentId = action.payload.data[0].comment_id;
          state.comments = [ action.payload.data ]; // ?
        } else if (action.payload.ref === state.postId) {
          state.comments.push(action.payload.data);
        }

      })
      .addCase(fetchCommentLikes.rejected, state => { state.likesLoadingStatus = 'error'; })

      .addCase(fetchPostLikes.fulfilled, (state, action) => {
        state.likesLoadingStatus = 'idle';
        state.active = action.payload?.data || [];
      })

      .addDefaultCase(() => { });
  },
});

const { reducer } = likesSlice;

export default reducer;
