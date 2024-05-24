import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import apiMiddleware from './apiMiddleware'; // Import the API middleware
import authReducer from './reducers/auth';
import calendarReducer from './reducers/calendar';
import evalsReducer from './reducers/evals';
import insuranceTypesReducer from './reducers/insuranceTypes';
import mediaReducer from './reducers/media';
import practiceHomesReducer from './reducers/practiceHomes';
import practicesReducer from './reducers/practices';
import referrersReducer from './reducers/referrer';
import surgeryReducer from './reducers/surgery';
import surgeryConfigurationReducer from './reducers/surgeryConfigurations';
import surgeryTypeReducer from './reducers/surgeryTypes';
import templatesReducer from './reducers/templates';
import permissionsReducer from './reducers/userPermissions';
import usersReducer from './reducers/users';
import reviewReducer from './reducers/review';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
    practices: practicesReducer,
    users: usersReducer,
    templates: templatesReducer,
    surgeryTypes: surgeryTypeReducer,
    practiceHomes: practiceHomesReducer,
    insuranceTypes: insuranceTypesReducer,
    evals: evalsReducer,
    referrers: referrersReducer,
    surgeries: surgeryReducer,
    calendars: calendarReducer,
    surgeryConfigurations: surgeryConfigurationReducer,
    permissions: permissionsReducer,
    reviews: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware),
});

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
