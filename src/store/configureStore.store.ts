import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.store';
import notifeSlice from './notifeSlice.store';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { apis } from '../api/apis';

 const store = configureStore({
  reducer: {
    autenticacion: authReducer,
    notificacion: notifeSlice,
    // [apis.reducerPath]: apis.reducer,
  },

//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(apis.middleware),
});

// setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>

export default store;