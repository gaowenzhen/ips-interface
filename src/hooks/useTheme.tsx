import { useState, useCallback } from "react"
import { BASE_THEME_DARK, BASE_THEME_KEYWORD, BASE_THEME_LIGHT } from "../constants"

// 样式更改
function useTheme(): any {
	const [theme, setTheme] = useState<string>(localStorage.getItem(BASE_THEME_KEYWORD) ?? BASE_THEME_LIGHT)
	const dark = { default: localStorage.getItem(BASE_THEME_KEYWORD) ?? BASE_THEME_LIGHT }

	const toggleTheme = useCallback(
		() => {
			const th = theme === BASE_THEME_DARK ? BASE_THEME_LIGHT : BASE_THEME_DARK
			const THSTheme = localStorage.getItem(BASE_THEME_KEYWORD)
			if (THSTheme != null) {
				document.documentElement.setAttribute('data-theme', th)
				localStorage.setItem(BASE_THEME_KEYWORD, th)
			}
			dark.default = th
			setTheme(th)
		},
		[theme]
	)

	return {
		theme,
		toggleTheme,
		dark
	}
}
export default useTheme