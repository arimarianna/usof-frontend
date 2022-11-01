import { configureStore } from '@reduxjs/toolkit';

import middleware from './middleware';

import posts from './postsSlice';
import categories from './categoriesSlice';
import users from './usersSlice';
import comments from './commentsSlice';
import likes from './likesSlice';

const store = configureStore({
  reducer: { posts, categories, users, comments, likes },
  middleware: (getDefaultMiddleware) => [ ...getDefaultMiddleware({ serializableCheck: false }), middleware ],
  devTools: true,
});

export { store };