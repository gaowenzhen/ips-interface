import React, { useMemo } from 'react'
import {
	createGlobalStyle,
	css,
	DefaultTheme,
	ThemeProvider as StyledComponentsThemeProvider,
} from 'styled-components/macro'
import useIsDarkMode from '../hooks/useIsDarkMode'

import { Colors } from './styled'


export const MEDIA_WIDTHS = {
	upToExtraSmall: 500,
	upToSmall: 720,
	upToMedium: 960,
	upToLarge: 1280,
}

// Migrating to a standard z-index system https://getbootstrap.com/docs/5.0/layout/z-index/
// Please avoid using deprecated numbers
export enum Z_INDEX {
	deprecated_zero = 0,
	deprecated_content = 1,
	dropdown = 1000,
	sticky = 1020,
	fixed = 1030,
	modalBackdrop = 1040,
	offcanvas = 1050,
	modal = 1060,
	popover = 1070,
	tooltip = 1080,
}

const mediaWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
	(accumulator, size) => {
		; (accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (max-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
		return accumulator
	},
	{}
) as any

const white = '#FFFFFF'
const black = '#000000'

function colors(isDarkMode: boolean): Colors {
	return {
		isDarkMode,
		// base
		white,
		black,

		// text
		text1: isDarkMode ? '#FFFFFF' : '#000000',

		// backgrounds / greys
		bg0: isDarkMode ? '#191B1F' : '#FFF',

		//specialty colors
		modalBG: isDarkMode ? 'rgba(0,0,0,.425)' : 'rgba(0,0,0,0.3)',
		advancedBG: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.6)',

		//primary colors
		primary1: isDarkMode ? '#2172E5' : '#E8006F',

		// color text
		primaryText1: isDarkMode ? '#5090ea' : '#D50066',

		// secondary colors
		secondary1: isDarkMode ? '#2172E5' : '#E8006F',

		// other
		blue0: isDarkMode ? '#2172E5' : '#0068FC',

		error: isDarkMode ? '#FD4040' : '#DF1F38',
		success: isDarkMode ? '#27AE60' : '#007D35',
		warning: '#FF8F00',

		// dont wanna forget these blue yet
		// blue5: isDarkMode ? '#153d6f70' : '#EBF4FF',
	}
}

function theme(isDarkMode: boolean): DefaultTheme {
	return {
		...colors(isDarkMode),

		grids: {
			sm: 8,
			md: 12,
			lg: 24,
		},

		//shadows
		shadow1: isDarkMode ? '#000' : '#2F80ED',

		// media queries
		mediaWidth: mediaWidthTemplates,

		// css snippets
		flexColumnNoWrap: css`
      display: flex;
      flex-flow: column nowrap;
    `,
		flexRowNoWrap: css`
      display: flex;
      flex-flow: row nowrap;
    `,
	}
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
	const { isDarkMode } = useIsDarkMode()

	const themeObject = useMemo(() => theme(isDarkMode), [isDarkMode])

	return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>
}

/**
 * Preset styles of the Rebass Text component
 */

export const ThemedGlobalStyle = createGlobalStyle`
html {
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg0} !important;
}

a {
 color: ${({ theme }) => theme.blue0}; 
}
`