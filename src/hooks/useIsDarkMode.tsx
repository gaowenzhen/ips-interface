import { useState, useEffect } from 'react'
import { useAppSelector } from '.'
import { BASE_THEME_DARK } from '../constants'

function useIsDarkMode() {
	const theme = useAppSelector(state => state.theme.theme)
	const [isDarkMode, setIsDarkMode] = useState(false)
	useEffect(() => {
		setIsDarkMode(theme === BASE_THEME_DARK)
	}, [theme])

	return { isDarkMode }
}
export default useIsDarkMode