// store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './components/ActivityLog/themeConfigSlice';

const store = configureStore({
  reducer: {
    themeConfig: themeConfigSlice,
  },
});

export default store;
