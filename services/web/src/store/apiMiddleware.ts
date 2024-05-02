import { Middleware } from '@reduxjs/toolkit';
import { fetchLoggedInUser, logoutUser } from '@root/store/reducers/auth';

const apiMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (fetchLoggedInUser.rejected.match(action)) {
      if (action?.error?.message === 'Access Denied') {
        dispatch(logoutUser());
        window.location.href = '/login';
      }
    }
    return next(action);
  };

export default apiMiddleware;
