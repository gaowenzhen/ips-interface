import { useContext, useCallback, useState, useEffect, useLayoutEffect } from "react";
import styled from "styled-components"

import { Trans } from "@lingui/macro";

import { ReactComponent as SearchIcons } from "../../asstes/header/search.svg";
import { SearchContextData, SearchContext } from "../../hooks/useSearchContext";
import { useLocation } from "react-router-dom";

import { FlexCCBox, FlexSCBox } from "../FlexBox"
import { IPS_CNS_KEY } from "../../constants";
import { useNavigate } from "react-router-dom"


const Main = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
	position: relative;
	top: 0;
	left: 0;
	padding: 0 20px;
`

const HomeSearchMain = styled(FlexCCBox)`
	position: relative;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(221, 233, 237, .45);
	border-radius: 8px;
	height: 42px
`

const HomeSearchInput = styled.input`
	width: 100%;
	height: 100%;
	border: 0 none;
	font-size: 16px;
	background: transparent;
	padding-left: 16px;
`

const HomeSearchEmpty = styled(FlexCCBox) <{ ischeck: string }>`
	display: ${({ ischeck }) => ischeck === "true" ? "none" : "flex"};
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	&:hover {
		cursor: text;
	}
`

const Text = styled.div`
	margin-left: 16px;
`

const SearchBtn = styled(FlexCCBox) <{ disabled?: boolean }>`
	width: 150px;
	padding: 4px 40px;
	background: #005F7D;
	border-radius: 6px;
	color: #FFFFFF;
	margin-left: 20px;
	line-height: 1.5;
	height: 100%;
	cursor: pointer;
	opacity: ${({ disabled }) => disabled ? "1" : "0.2"};
`

function HomeSearch({Callback}:{Callback?:any}) {
	
	const navigate = useNavigate()
	const searchContextData = useContext<SearchContextData>(SearchContext)
	const [ischeck, setIsCheck] = useState(false)
	const [search, setSearch] = useState("")
	const locationState = useLocation()

	const updateSearchData = useCallback(() => {
		if (searchContextData && search) {
			console.dir(search)
			searchContextData?.setSearchState(search)
		}
		if(locationState.pathname === '/cns' && search){
			navigate("/cns/details", { state: search })
		}
		if(locationState.pathname === '/details'){
			navigate("/cns/details", { state: null })
		}
		
		if (Callback as Function) {
			Callback()
		}

	}, [search])

	// useLayoutEffect(() => {
	// 	console.log('homesearch-useLayoutEffect-11')
	// 	const ipsCnsKey = sessionStorage.getItem(IPS_CNS_KEY)
	// 	if (ipsCnsKey && (searchContextData?.searchState !== ipsCnsKey)) {
	// 		if(locationState.pathname !== '/cns'){
	// 		searchContextData?.setSearchState(ipsCnsKey)
	// 		console.log('useLayoutEffect')
	// 		} else {
	// 			sessionStorage.removeItem(IPS_CNS_KEY)
	// 		}
	// 	}

	// }, [])

	// useEffect(() => {
	// 	console.log('homesearch-useEffect')
	// 	if(!ischeck){
    //       return
	// 	}
	// 	setSearch(searchContextData?.searchState ?? search)
	// 	setIsCheck(true)
	// }, [searchContextData])

	

	return <Main>
		<HomeSearchMain>
			<HomeSearchInput value={search}
				onBlur={() => {
					if (!search) {
						setIsCheck(false)
					}
				}}
				onKeyUp={(e:any) => {
					if (e.key === "Enter") {
						updateSearchData()
					}
				}}
				onChange={(e:any) => {
					setSearch(e.target.value.trim())
				}}
				key={ischeck.toString()}
				autoFocus={ischeck} />
			<HomeSearchEmpty ischeck={!!ischeck + ""} onClick={() => {
				setIsCheck(true)
			}}>
				<FlexSCBox>
					<SearchIcons />
					<Text><Trans>Search</Trans></Text>
				</FlexSCBox>
			</HomeSearchEmpty>
		</HomeSearchMain>
		<SearchBtn disabled={!!search} onClick={() => {
			updateSearchData()
		}}>
			<Trans>Search</Trans>
		</SearchBtn>
	</Main>
}

export default HomeSearch