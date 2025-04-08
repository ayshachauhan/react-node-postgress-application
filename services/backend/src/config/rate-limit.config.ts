import {
  RATE_LIMIT_LOGIN_REQUESTS,
  RATE_LIMIT_LOGIN_WINDOW_MS,
  RATE_LIMIT_RESET_REQUESTS,
  RATE_LIMIT_RESET_WINDOW_MS,
} from 'src/utils/constants';

export default () => ({
  rateLimit: {
    reset: {
      maxRequests: parseInt(RATE_LIMIT_RESET_REQUESTS || '5', 10),
      timeWindowMs: parseInt(RATE_LIMIT_RESET_WINDOW_MS || '3600000', 10),
    },
    login: {
      maxRequests: parseInt(RATE_LIMIT_LOGIN_REQUESTS || '10', 10),
      timeWindowMs: parseInt(RATE_LIMIT_LOGIN_WINDOW_MS || '60000', 10),
    },
  },
});
