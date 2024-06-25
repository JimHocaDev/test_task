import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './counterSlice';
import layoutSlice from './layoutSlice';
import countainerSlice from './containerSlice';
import navSlice from './navSlice';
import groupSlice from './groupSlice';
import { bookApi } from './rtk-query';
// Store yaratish
const storeTest = configureStore({
	reducer: {
		// isOpenMenu: counterSlice,
		// positionNav: layoutSlice,
		// containerSt:countainerSlice,
		// navSt:navSlice,
		// group:groupSlice,
		[bookApi.reducerPath]: bookApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(bookApi.middleware),
});

export default storeTest;
