import { createContext, Dispatch, SetStateAction } from "react";
import { useEffect, useState } from 'react'
import { IPS_CNS_KEY } from '../constants'

export type SearchContextData = {
	searchState: string
	setSearchState: Dispatch<SetStateAction<string>>
} | undefined

export const SearchContext = createContext<SearchContextData>(undefined);

// useSearchContext



export default function useSearchState() {

	const [searchState, setOldSearchState] = useState("")
	const [newSearchState, setNewSearchState] = useState("")

	useEffect(() => {
		if (newSearchState) {
			sessionStorage.setItem(IPS_CNS_KEY, newSearchState)
			setOldSearchState(newSearchState)
		}
	}, [newSearchState])

	return ({ searchState, setSearchState: setNewSearchState })
}
