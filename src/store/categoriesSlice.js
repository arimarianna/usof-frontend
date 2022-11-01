import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../helpers/consts';

const categoriesAdapter = createEntityAdapter();

const initialState = categoriesAdapter.getInitialState({
  categoriesLoadingStatus: 'idle',
  activeCategory: 'all',
});

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => await axios.get(url + '/api/categories')
);

export const fetchAddCategories = createAsyncThunk(
  'categories/fetchAddCategories',
  async (title) => await axios.post(url + '/api/categories', { title })
);

export const fetchCategoriesPost = createAsyncThunk(
  'categories/fetchCategoriesPost',
  async (id) => await axios.get(url + '/api/posts/' + id + '/categories')
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    categoryCreated: (state, action) => {
      categoriesAdapter.addOne(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCategories.pending, state => { state.categoriesLoadingStatus = 'loading'; })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoadingStatus = 'idle';
        categoriesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCategories.rejected, state => { state.categoriesLoadingStatus = 'error'; })
      .addCase(fetchAddCategories.pending, state => { state.categoriesLoadingStatus = 'loading'; })
      .addCase(fetchAddCategories.rejected, state => { state.categoriesLoadingStatus = 'error'; })
      .addCase(fetchCategoriesPost.pending, state => { state.categoriesLoadingStatus = 'loading'; })
      .addCase(fetchCategoriesPost.rejected, state => { state.categoriesLoadingStatus = 'error'; })
      .addCase(fetchCategoriesPost.fulfilled, (state, action) => { 
        state.postCategories = action.payload.data;
        state.categoriesLoadingStatus = 'idle';
      })

      .addDefaultCase(() => { });
  },
});

const { actions, reducer } = categoriesSlice;

export default reducer;

export const {
  categoryCreated,
} = actions;