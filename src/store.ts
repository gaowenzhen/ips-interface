import { configureStore } from "@reduxjs/toolkit";
import ThemeSlice from "./state/ThemeSlice";
// reducers are named automatically based on the name field in the slice
// exported in slice files by default as nameOfSlice.reducer

const store = configureStore({
	reducer: {
		theme: ThemeSlice,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
