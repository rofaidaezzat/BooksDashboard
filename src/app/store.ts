import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { booksApiSlice } from './services/crudBooks';
import { contactusApiSlice } from './services/crudContactus';
import { authApiSlice } from './services/crudAuth';
import { newsPaperApiSlice } from './services/crudNewsPaper';
import { coursesApiSlice } from "./services/crudCourses";


export const store = configureStore({
  reducer: {
    [booksApiSlice.reducerPath]: booksApiSlice.reducer,
    [contactusApiSlice.reducerPath]: contactusApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [newsPaperApiSlice.reducerPath]: newsPaperApiSlice.reducer,
    [coursesApiSlice.reducerPath]: coursesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApiSlice.middleware,
      contactusApiSlice.middleware,
      authApiSlice.middleware,
      newsPaperApiSlice.middleware,
      coursesApiSlice.middleware
    ),

});


setupListeners(store.dispatch);

// Export useful types for the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

