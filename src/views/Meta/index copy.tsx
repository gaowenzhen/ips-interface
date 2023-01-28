import { Web3Provider } from "@ethersproject/providers"
import { t, Trans } from "@lingui/macro"
import { useWeb3React } from "@web3-react/core"
import { BigNumber, BigNumberish } from "ethers"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../../components/FlexBox"
import { IPSNftAddress, ZERO_ADDRESS } from "../../constants"
import { useIPSBaseCoordinateBindContract, useIPSCNSRegisterarControllerContract, useIPSCoordinateSystemContract, useIPSFactoryContract, useIPSMetAverseRegisterContract, useIPSNftContract } from "../../hooks/useContract"
import useIpsTips from "../../hooks/useIpsTips"
import styled from "styled-components"

import HomePng from "../../asstes/home/home.png";
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft"
import { MetaNftType } from "../SpaceNFT/Manage"
import { dayjsTime } from "../../utils/dayjsTime"

const HomeMain = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
`

const Container = styled.div`
	width: 100%;
	height: 100%;	
`

const Item = styled.div`
	display: inline-block;
	margin: 24px 0 24px 70px;
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
	width: 400px;
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
	text-align: center;
	white-space: nowrap;
`

export default function Meta() {
	const navigate = useNavigate()
	const ipsTips = useIpsTips()
	const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
	const { account } = useWeb3React<Web3Provider>();
	const ipsNftContract = useIPSNftContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()
	const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract()
	const ipsCoordinateSystem = useIPSCoordinateSystemContract()
	const ipsCns = useIPSCNSRegisterarControllerContract()

	const [state, setState] = useState<MetaNftType[]>([])
	const [nftLen, setNftLen] = useState(0)


	useEffect(() => {
		if (IPSNFT?.ipsNft && ipsCoordinateSystem && ipsCns && ipsBaseCoordinateBindContract) {
			const list: MetaNftType[] = []
			IPSNFT?.ipsNft.filter((item) => item.isCreated).forEach(async ({ tokenId, bindAddress }) => {
				const info = await ipsCoordinateSystem.getCoordinate(IPSNftAddress, tokenId)
				const cnsName = await ipsBaseCoordinateBindContract.getTokenCNS(IPSNftAddress, tokenId)
				const cnsTerm = await ipsCns.nameExpires(cnsName)
				const [a, b, c, d] = info
				list.push({
					tokenId,
					bindAddress,
					coordHash: d.toString(),
					metaverse: info.metaverse,
					cnsName,
					cnsTerm,
					coord: [a.toString(), b.toString(), c.toString()]
				})
				setState(list.concat([]))
			})
		}
	}, [IPSNFT, ipsCoordinateSystem, ipsBaseCoordinateBindContract, ipsCns])


	// 获取nft
	const getNFT = useCallback(
		async () => {
			if (!!ipsNftContract && ipsCns && ipsBaseCoordinateBindContract && !!ipsMetAverseRegisterContract && !!ipsCoordinateSystem) {
				const nftLen = await ipsNftContract.balanceOf(account)
				setNftLen(nftLen.toNumber())
				let count = 0
				const list: MetaNftType[] = []
				while (nftLen.toNumber() > count) {
					const tokenId: BigNumberish = await ipsNftContract.tokenOfOwnerByIndex(account, BigNumber.from(count))
					// const info = await ipsMetAverseRegisterContract.metaBinded(IPSNftAddress, tokenId)
					const infoHash = await ipsCoordinateSystem.getCoordinate(IPSNftAddress, tokenId)
					const [a, b, c, d] = infoHash
					const bindAddress:any = await ipsMetAverseRegisterContract.getTokenMeta(IPSNftAddress, tokenId);
					const isCreated = await ipsMetAverseRegisterContract.isCreated(bindAddress)
					const cnsName = await ipsBaseCoordinateBindContract.getTokenCNS(IPSNftAddress, tokenId)
					const cnsTerm = await ipsCns.nameExpires(cnsName)

					if (isCreated) {
						list.push({
							tokenId,
							bindAddress,
							coordHash: d.toString(),
							cnsName,
							cnsTerm,
							metaverse: infoHash.metaverse,
							coord: [a.toString(), b.toString(), c.toString()]
						})
						setState(list.concat([]))
					}
					count++
				}
			}

		},
		[ipsNftContract, ipsCns, account, ipsMetAverseRegisterContract, ipsBaseCoordinateBindContract, ipsCoordinateSystem]
	)

	useEffect(() => {
		// getNFT()
	}, [ipsNftContract, account, ipsCoordinateSystem])


	return (
		<HomeMain>
			{
				!state.length ?
					<NoNft >
						<NoNftItem >It looks like you don’t have Scenes. </NoNftItem>
						<NoNftItem ><Here onClick={() => {
							navigate("create")
						}}>Click here </Here> to get started.</NoNftItem>
					</NoNft>
					:
					<Container>
						{state.map((item) => <Item onClick={() => {
							// navigate("/spaceNFT/detail")
							console.log("ITEM", item)
						}}  >
							<ItemImg src={HomePng} onClick={(e:any) => {
								e.stopPropagation()
							}} />
							<ItemDetail>
								<Options>
									<Price>TokenID</Price>
									<Price>{item.tokenId.toString()}</Price>
								</Options>
								<Options>{
									item.metaverse === ZERO_ADDRESS ? <Price onClick={(e:any) => {
										e.stopPropagation()
										navigate("/coord/create", { state: { tokenId: item.tokenId.toString(), contractAddress: IPSNftAddress } })
									}}><Trans>Create Coord</Trans></Price> :
										<Price>Coord: [{item.coord.join(", ")}]</Price>}
								</Options>
								{
									(item.metaverse !== ZERO_ADDRESS) ? (item.cnsName ?
									<Fragment>
										<Options><Price><Trans>CNS NAME</Trans></Price><Price>{item.cnsName}</Price></Options>
										<Options><PriceAmount><Trans>Expiration time</Trans></PriceAmount> <PriceAmount>{dayjsTime(item.cnsTerm)}</PriceAmount></Options>
									</Fragment>
										:
										<Options>
											<Price onClick={(e:any) => {
												e.stopPropagation()
												navigate("/cns/bind", { state: { tokenId: item.tokenId.toString(), contractAddress: IPSNftAddress } })
											}}>Bind CNS</Price>
										</Options>) : null
								}
							</ItemDetail>
						</Item>)}
					</Container>
			}
		</HomeMain>
	)
}
