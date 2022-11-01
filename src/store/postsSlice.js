import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../helpers/consts';

const postsAdapter = createEntityAdapter();

const initialState = postsAdapter.getInitialState({
  postsLoadingStatus: 'idle',
  activePost: null,
});

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ filter, page, sort }) => await axios.get(url + '/api/posts', {
    params: {
      filter,
      page,
      sort,
    },
  })
);

export const fetchPostsById = createAsyncThunk(
  'posts/fetchPostsById',
  async (id) => await axios.get(url + '/api/posts/' + id)
);

export const fetchCreatePost = createAsyncThunk(
  'likes/fetchCreatePost',
  async (data) => await axios.post(url + '/api/posts', data)
);

export const fetchUpdatePost = createAsyncThunk(
  'likes/fetchUpdatePost',
  async ({ id, value }) => await axios.patch(url + '/api/posts/' + id, value)
);


const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postCreated: (state, action) => {
      postsAdapter.addOne(state, action.payload);
    },
    postDeleted: (state, action) => {
      postsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => { state.postsLoadingStatus = 'loading'; })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.postsLoadingStatus = 'idle';
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, state => { state.postsLoadingStatus = 'error'; })
      .addCase(fetchPostsById.pending, state => { state.postsLoadingStatus = 'loading'; })
      .addCase(fetchPostsById.fulfilled, (state, action) => {
        state.postsLoadingStatus = 'idle';
        state.activePost = action.payload?.data || null;
      })
      .addCase(fetchPostsById.rejected, (state, action) => {
        state.postsLoadingStatus = 'idle';
        postsAdapter.setAll(state, action.payload);
      })
      
      .addDefaultCase(() => { });
  },
});

const { actions, reducer } = postsSlice;

export default reducer;

const { selectAll } = postsAdapter.getSelectors(state => state.posts);

export const filteredPostsSelector = createSelector(
  (state) => state.category.activeCategory,
  selectAll,

  (category, posts) => {
    if (category === 'all') {
      return posts;
    }
    return posts.filter(el => el.category.includes(category));
  }
);

export const {
  postCreated,
  postDeleted,
} = actions;