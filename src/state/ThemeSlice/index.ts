import { createAction, createSlice } from "@reduxjs/toolkit";
import { BASE_THEME_KEYWORD, BASE_THEME_LIGHT, BASE_THEME_DARK } from "../../constants";

interface MessagesState {
	theme: string,
}

const initialState: MessagesState = {
	theme: localStorage.getItem(BASE_THEME_KEYWORD) ?? BASE_THEME_LIGHT
};

export const toggleTheme = createAction<{ theme: string }>("theme/toggleTheme")

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		initTheme(state, action) {
			const theme = ((localStorage.getItem(BASE_THEME_KEYWORD) ?? BASE_THEME_DARK) === BASE_THEME_DARK) ? BASE_THEME_LIGHT : BASE_THEME_DARK;
			localStorage.setItem(BASE_THEME_KEYWORD, theme)
			document.documentElement.setAttribute('data-theme', theme)
			state.theme = action.payload.theme
		},
	},
	extraReducers: builder => builder.addCase(toggleTheme, (state, action) => {
		const theme = ((localStorage.getItem(BASE_THEME_KEYWORD) ?? BASE_THEME_DARK) === BASE_THEME_DARK) ? BASE_THEME_LIGHT : BASE_THEME_DARK;
		localStorage.setItem(BASE_THEME_KEYWORD, theme)
		document.documentElement.setAttribute('data-theme', theme)
		state.theme = theme
	})
});

export const { initTheme } = themeSlice.actions;

export default themeSlice.reducer;
