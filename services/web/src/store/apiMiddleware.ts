import { Middleware } from '@reduxjs/toolkit';
import { fetchLoggedInUser, logoutUser } from '@root/store/reducers/auth';

const apiMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (fetchLoggedInUser.fulfilled.match(action)) {
      if (action?.payload?.statusCode === 403) {
        console.log('ddd');
        dispatch(logoutUser());
        window.location.href = '/login';
      }
    } else if (fetchLoggedInUser.rejected.match(action)) {
      dispatch(logoutUser());
      window.location.href = '/login';
    }
    return next(action);
  };

export default apiMiddleware;
