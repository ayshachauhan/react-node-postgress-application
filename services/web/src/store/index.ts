import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './reducers/auth';
import evalsReducer from './reducers/evals';
import insuranceTypesReducer from './reducers/insuranceTypes';
import mediaReducer from './reducers/media';
import practiceHomesReducer from './reducers/practiceHomes';
import practicesReducer from './reducers/practices';
import surgeryTypeReducer from './reducers/surgeryTypes';
import templatesReducer from './reducers/templates';
import usersReducer from './reducers/users';

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
  },
});

export type State = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
