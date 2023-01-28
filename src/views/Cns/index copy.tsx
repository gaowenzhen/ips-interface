import { Web3Provider } from "@ethersproject/providers"
import { t, Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { BigNumber, BigNumberish } from "ethers"
import { useCallback, useContext, useEffect, useState,useLayoutEffect } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../../components/FlexBox"
import { useIPSCNSRegisterarControllerContract, useIPSCoordinateSystemContract, useIPSFactoryContract, useIPSMetAverseRegisterContract } from "../../hooks/useContract"
import useIpsTips from "../../hooks/useIpsTips"
import styled from "styled-components"
import HomePng from "../../asstes/home/home.png";
import { dayjsTime } from "../../utils/dayjsTime"
import { IPS_CNS_KEY } from "../../constants";
import { SearchContext, SearchContextData } from "../../hooks/useSearchContext"
import useMediaQuery from "@mui/material/useMediaQuery";


const HomeMain = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
`


const Container = styled.div<{ isMobile?: boolean }>`
	width: 100%;
	height: 100%;
	text-align: ${({ isMobile }) => (isMobile ? "" : "center;")};
`

const Item = styled.div<{ isMobile?: boolean }>`
	display: inline-block;
	margin: ${({ isMobile }) => (isMobile ? "24px 0 24px 70px;" : "24px auto")};
	vertical-align: top;
`

const ItemImg = styled.img`
	width: 300px;
	box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.5);
	border-radius: 18px;
	cursor: pointer;
`

const Options = styled(FlexSBCBox)`
	padding: 0 28px;
	margin-top: 8px;
	cursor: pointer;
`

const ItemDetail = styled.div`
	margin-top: 28px;
`

const Price = styled.div`
	color: #000000;
	opacity: 0.5;
	font-weight: 400;
	font-size: 18px;
`

const PriceAmount = styled.div`
	font-weight: 400;
	font-size: 16px;
	line-height: 34px;
	color: #696969;
	opacity: 0.5;
`

// const NoNft = styled(FlexCCBox)`
// 	width: 400px;
// 	flex-direction: column;
// 	font-weight: 400;
// 	font-size: 24px;
// 	line-height: 2;
// 	text-align: center;
// 	color: #393939;
// `

const NoNft = styled(FlexCCBox)`
	width: 100%;
	flex-direction: column;
	font-weight: 400;
	font-size: 24px;
	line-height: 2;
	text-align: center;
	color: #393939;
`

const Here = styled.span`
	color: #005F7D;
	cursor: pointer;
	padding-right: 8px;
`

// const NoNftItem = styled(FlexSCBox)`
// 	margin-top: 20px;
// 	text-align: center;
// 	white-space: nowrap;
// `

const NoNftItem = styled(FlexSCBox)`
	margin-top: 20px;
	text-align: left;
	margin-left: auto;
    margin-right: auto;
    width: 80%;
`

 interface CnsNftType {
	tokenId: BigNumberish,
	cnsName: string,
	cnsTerm: string,
}

export default function Cns() {
	const ismobile = useMediaQuery("(min-width:980px)");

	const navigate = useNavigate()
	const locationState = useLocation()
	const { account } = useWeb3React<Web3Provider>();
	const ipsTips = useIpsTips()
	const [state, setState] = useState<CnsNftType[]>([])
	const [cnsNftLen, setNftLen] = useState(0)
	const ipsCns = useIPSCNSRegisterarControllerContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()
	const ipsFactoryContract = useIPSFactoryContract()
	const searchContextData = useContext<SearchContextData>(SearchContext)
	const ipsCoordinateSystem = useIPSCoordinateSystemContract()

	// const clearSearchData = useCallback(() => {
	// 	if (searchContextData) {
	// 		console.dir('cns/index.tsx sclesrsearcf')
	// 		searchContextData?.setSearchState("")
	// 	}
	// }, [searchContextData])


	// useLayoutEffect(() => {
	// 	console.dir('cns/index.tsx useLayoutEffect')
	// 	if(locationState.pathname === '/cns' && searchContextData?.searchState){
	// 		const ipsCnsKey = sessionStorage.getItem(IPS_CNS_KEY)
	// 		if (ipsCnsKey && (searchContextData?.searchState === ipsCnsKey)) {
	// 			sessionStorage.removeItem(IPS_CNS_KEY)
	// 			searchContextData?.setSearchState('')
	// 			console.dir('ee4')
	// 		}
	// 	}

	// }, [searchContextData])

	// 获取nft
	const getNFT = useCallback(
		async () => {
			if (!!ipsCns && !!ipsMetAverseRegisterContract) {
				const cnsNftLen = await ipsCns.balanceOf(account)
				setNftLen(cnsNftLen.toNumber())
				console.dir('cns/index.tsx useCallback')
				let count = 0
				const list: CnsNftType[] = []
				while (cnsNftLen.toNumber() > count) {
					const tokenId: BigNumberish = await ipsCns.tokenOfOwnerByIndex(account, BigNumber.from(count))
					//console.log('tokenId', tokenId)
					const cnsName = await ipsCns.tokenName(tokenId)
					//console.log('cnsName', cnsName)
					const cnsTerm = await ipsCns.nameExpires(cnsName)
					//console.log("INFO", cnsTerm.toString())
					list.push({
						tokenId,
						cnsName,
						cnsTerm
					})
					setState(list.concat([]))
					count++;
				}
			}

		},
		[ipsCns, account, ipsMetAverseRegisterContract]
	)

	useEffect(() => {
		getNFT()
	}, [ipsCns])


	return (
		<HomeMain>
			{
				!state.length && <NoNft >
					<NoNftItem >It looks like you don’t have Scenes. </NoNftItem>
					<NoNftItem ><Here onClick={() => {
						navigate("details")
					}}>Click here </Here> to get started.</NoNftItem>
				</NoNft>
			}
			{
				!!state.length && <Container isMobile={ismobile}>
					{state.map((item,idx) => <Item isMobile={ismobile} key={idx}>
						<ItemImg src={HomePng} onClick={(e:any) => {
                            e.stopPropagation()
							let search = item.cnsName
							searchContextData?.setSearchState(search)
							navigate("details", { state: search })
						}} />
						<ItemDetail>
							<Options><PriceAmount><Trans>CNS NAME</Trans></PriceAmount> <PriceAmount>{item.cnsName}</PriceAmount></Options>
							<Options><PriceAmount><Trans>Expiration time</Trans></PriceAmount> <PriceAmount>{dayjsTime(item.cnsTerm)}</PriceAmount></Options>
						</ItemDetail>
					</Item>)}
				</Container>
			}
		</HomeMain>
	)
}
