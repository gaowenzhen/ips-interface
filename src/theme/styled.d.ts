import { FlattenSimpleInterpolation, ThemedCssFunction } from 'styled-components/macro'

export type Color = string
export interface Colors {
	isDarkMode: boolean

	// base
	white: Color
	black: Color

	// text
	text1: Color

	// backgrounds / greys
	bg0: Color

	modalBG: Color
	advancedBG: Color

	//blues
	primary1: Color

	primaryText1: Color

	// pinks
	secondary1: Color

	// other
	blue0: Color

	error: Color
	success: Color
	warning: Color
}

declare module 'styled-components/macro' {
	export interface DefaultTheme extends Colors {
		grids: Grids

		// shadows
		shadow1: string

		// media queries
		mediaWidth: {
			upToExtraSmall: ThemedCssFunction<DefaultTheme>
			upToSmall: ThemedCssFunction<DefaultTheme>
			upToMedium: ThemedCssFunction<DefaultTheme>
			upToLarge: ThemedCssFunction<DefaultTheme>
		}

		// css snippets
		flexColumnNoWrap: FlattenSimpleInterpolation
		flexRowNoWrap: FlattenSimpleInterpolation
	}
}