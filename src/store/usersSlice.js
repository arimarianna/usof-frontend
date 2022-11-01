import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import { url } from '../helpers/consts';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  usersAllLoadingStatus: 'idle',
  userByIdLoadingStatus: 'idle',
  selfUser: null,
  activeUser: null,
});

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async () => await axios.get(url + '/api/users')
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async ({ id, self = false }) => {
    const user = await axios.get(url + `/api/users/${id}`);
    return { ...user, self: self };
  }
);

export const fetchLogin = createAsyncThunk(
  'users/fetchLogin',
  async (data) => await axios.post(url + '/api/auth/login', data)
);

export const fetchUpdateUser = createAsyncThunk(
  'users/fetchUpdateUser',
  async ({ user_id, data }) => await axios.patch(url + `/api/users/${user_id}`, data)
);

export const fetchRegister = createAsyncThunk(
  'users/fetchRegister',
  async (data) => await axios.post(url + '/api/auth/register', data)
);

export const fetchLogout = createAsyncThunk(
  'users/fetchLogout',
  async () => await axios.post(url + '/api/auth/logout')
);

export const fetchPasswordReset = createAsyncThunk(
  'users/fetchPasswordReset',
  async (data) => await axios.post(url + '/api/auth/password-reset', data)
);

export const fetchPasswordResetConfirm = createAsyncThunk(
  'users/fetchPasswordReset',
  async ({ token, data }) => await axios.post(url + '/api/auth/password-reset/' + token, data)
);

export const fetchConfirmRegistration = createAsyncThunk(
  'users/fetchConfirmRegistration',
  async (token) => await axios.post(url + `/api/auth/register/confirmed/${token}`)
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllUsers.pending, state => { state.usersAllLoadingStatus = 'loading'; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersAllLoadingStatus = 'idle';
        // state.filters = action.payload;
        usersAdapter.setAll(state, action.payload);
      })
      .addCase(fetchAllUsers.rejected, state => { state.usersAllLoadingStatus = 'error'; })

      .addCase(fetchUserById.pending, state => { state.userByIdLoadingStatus = 'loading'; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.userByIdLoadingStatus = 'idle';
        const { self, data } = action.payload;
        const prop = self ? 'selfUser' : 'activeUser';

        state[prop] = data;
      })
      .addCase(fetchUserById.rejected, state => { state.userByIdLoadingStatus = 'error'; })
      .addCase(fetchLogin.fulfilled, (state, action) => { state.selfUser = action.payload.data; })
      .addDefaultCase(() => { });
  },
});

const { reducer } = usersSlice;

export default reducer;
