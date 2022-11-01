import { fetchLogout, fetchLogin, fetchPasswordReset, fetchRegister, fetchConfirmRegistration } from './usersSlice';
import { fetchAddCategories, fetchCategories } from './categoriesSlice';
import { fetchAddComment } from './commentsSlice';
import { fetchCreatePost } from './postsSlice';
import { fetchCommentSetLike, fetchCommentUnsetLike, fetchPostUnsetLike, fetchPostSetLike } from './likesSlice';

export default ({ dispatch, getState }) => (next) => (action) => {
  const state = getState();

  const post_id = state.posts.activePost?.id;

  switch (action.type) {
  case `${fetchLogout.fulfilled}`:
  case `${fetchRegister.fulfilled}`:
  case `${fetchPasswordReset.fulfilled}`:
  case `${fetchConfirmRegistration.fulfilled}`:
    localStorage.setItem('usof.user_id', '');
    window.location = '/login';
    break;
  case `${fetchLogin.fulfilled}`: {
    const { payload: { data: { id } } = {} } = action;
    localStorage.setItem('usof.user_id', id);
    window.location = '/';
    break;
  }
  case `${fetchAddCategories.fulfilled}`:
    dispatch(fetchCategories());
    break;
  case `${fetchCreatePost.fulfilled}`: 
    window.location = '/';
    break;
  case `${fetchPostSetLike.fulfilled}`:
  case `${fetchPostUnsetLike.fulfilled}`:
  case `${fetchCommentSetLike.fulfilled}`:
  case `${fetchCommentUnsetLike.fulfilled}`:
  case `${fetchAddComment.fulfilled}`:
    window.location = '/post/' + post_id;
    break;
  }

  return next(action);
}; 