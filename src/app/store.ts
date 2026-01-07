import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { booksApiSlice } from './services/crudBooks';
import { contactusApiSlice } from './services/crudContactus';
import { authApiSlice } from './services/crudAuth';



export const store = configureStore({
  reducer: {
    [booksApiSlice.reducerPath]: booksApiSlice.reducer,
    [contactusApiSlice.reducerPath]: contactusApiSlice.reducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApiSlice.middleware,
      contactusApiSlice.middleware,
      authApiSlice.middleware
    ),

});


setupListeners(store.dispatch);

// Export useful types for the application
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

