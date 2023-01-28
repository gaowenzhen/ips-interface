import { Web3Provider } from "@ethersproject/providers"
import { t, Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { BigNumber, BigNumberish } from "ethers"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../../components/FlexBox"
import { IPSNftAddress, ZERO_ADDRESS } from "../../constants"
import { useIPSFactoryContract, useIPSMetAverseRegisterContract, useIPSNftContract } from "../../hooks/useContract"
import useIpsTips from "../../hooks/useIpsTips"
import styled from "styled-components"

import HomePng from "../../asstes/home/home.png";
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft"
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

const NoNftItem = styled(FlexSCBox)`
	margin-top: 20px;
	text-align: left;
	margin-left: auto;
    margin-right: auto;
    width: 80%;
`

export interface NftType {
	tokenId: BigNumberish,
	bindAddress: string,
	isBinded: boolean,
	isCreated: boolean,
}

export default function SpaceNFT() {
 

	const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)

	const ismobile = useMediaQuery("(min-width:980px)");
	const navigate = useNavigate()
	 
	const { account } = useWeb3React<Web3Provider>();
	const ipsTips = useIpsTips()


	const [state, setState] = useState<NftType[]>([])
	const [nftLen, setNftLen] = useState(0)
	const ipsNftContract = useIPSNftContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()
	// const ipsFactoryContract = useIPSFactoryContract()

	useEffect(() => {
		if (IPSNFT?.ipsNft) {
			setState(IPSNFT.ipsNft)
		}
	}, [IPSNFT])

	// 获取nft
	const getNFT = useCallback(
		async () => {
			if (!!ipsNftContract && !!ipsMetAverseRegisterContract) {
				const nftLen = await ipsNftContract.balanceOf(account)
				setNftLen(nftLen.toNumber())
				let count = 0
				const list: NftType[] = []
				while (nftLen.toNumber() > count) {
					const tokenId: BigNumberish = await ipsNftContract.tokenOfOwnerByIndex(account, BigNumber.from(count))
					// const info = await ipsMetAverseRegisterContract.metaBinded(IPSNftAddress, tokenId)
					const bindAddress = await ipsMetAverseRegisterContract.getTokenMeta(IPSNftAddress, tokenId);
					const isBinded = await ipsMetAverseRegisterContract.isBinded(bindAddress)
					const isCreated = await ipsMetAverseRegisterContract.isCreated(bindAddress)
					list.push({
						tokenId,
						bindAddress,
						isBinded,
						isCreated
					})
					count++
				}
			}

		},
		[ipsNftContract, account, ipsMetAverseRegisterContract]
	)

	useEffect(() => {
		getNFT()
	}, [ipsNftContract])


	return (
		<HomeMain>
			{
				!state.length && <NoNft>
					<NoNftItem >It looks like you don’t have Scenes. </NoNftItem>
					<NoNftItem ><Here >Click here </Here> to get started.</NoNftItem>
				</NoNft>
			}
			{
				!!state.length && <Container isMobile={ismobile}>
					{
					state.map((item,idx) => <Item isMobile={ismobile} key={idx} onClick={() => {
						navigate("detail", {
							state: {
								...item,
								// tokenId: item.tokenId.toString()
							}
						})
					}}>
						<ItemImg src={HomePng} />
						<ItemDetail>
							{/* <Options><Price>Coord (54,32,1,13)</Price> <Price>Price</Price></Options> */}
							<Options>
								<PriceAmount>TOKENID</PriceAmount>
								<PriceAmount>{ item.tokenId.toString()}</PriceAmount>
							</Options>
							{/* <Options onClick={(e:any) => {
								e.stopPropagation()
							}}>
								<PriceAmount>{item.bindAddress.slice(0, 6)}...{item.bindAddress.slice(item.bindAddress.length - 7)}</PriceAmount>
								<PriceAmount>CREATE</PriceAmount>
							</Options> */}
						</ItemDetail>
						<Options >
							{
								!item.isBinded && !item.isCreated  ?  <Fragment>
									<Price onClick={(e:any) => {
										e.stopPropagation()
										if (item.isBinded) {
											ipsTips(t`The current address has been bound to NFT.`, { variant: "warning" })
										} else {
											navigate("bind", { state: item })
										}

									}}><Trans>Binding NFT</Trans></Price>
									<Price onClick={(e:any) => {
										e.stopPropagation()
										if (item.isCreated) {
											ipsTips(t`The current address has create Meta`, { variant: "warning" })
										} else {
											navigate("/meta/create", { state: { tokenId: item.tokenId.toString(), contractAddress: IPSNftAddress } })
										}
									}}><Trans>Create Meta</Trans></Price>
								</Fragment> :
									<Price onClick={() => {
										if (item.isBinded) {
											ipsTips(t`The current address has been bound to NFT.`, { variant: "warning" })
										} else {
											ipsTips(t`The current address has create Meta`, { variant: "warning" })
										}
									}}>
										{item.isBinded ? t`Binded NFT` : t`Created Meta`}
									</Price>
							}
						</Options>
					</Item>)}
				</Container>
			}
		</HomeMain>
	)
}
