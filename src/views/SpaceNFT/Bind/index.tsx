import styled from "styled-components"
import { t, Trans } from "@lingui/macro"

import { Fragment, useCallback, useEffect, useState } from "react";

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

import { FlexCCBox, FlexSCBox } from "../../../components/FlexBox";

import useIpsTips from "../../../hooks/useIpsTips";
import { useIPSFactoryContract, useIPSMetAverseRegisterContract } from "../../../hooks/useContract";
import { web3Sign } from "../../../utils/web3Sign";
import { useLocation } from "react-router-dom";
import { ZERO_ADDRESS, IPSNftAddress } from "../../../constants";
import { NftType } from "..";
import { BigNumber } from "ethers";
import { isPending } from "../../../utils/isPending";
import CopyBox from "../../../components/CopyBox";

const Main = styled.div`
	width: 100%;
	height: 100%;
`

const Container = styled.div`
	width: 100%;
	height: 100%;
	padding: 0 70px;
`

export const CopyIcon = styled(ContentCopyIcon)`
	margin: 0 16px;
	color: #5384FE;
	opacity: .8;
	cursor: pointer;
`

const Details = styled.div`
	margin-top: 20px;
	background: #F0F7F9;
	padding: 80px;
	border-radius: 16px;
`

const Item = styled(FlexCCBox)`
	width: 100%;
`

const ImgBox = styled.div`
	padding: 20px 20px 0;
	background: #E7F0F3;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 18px;
`

const Img = styled.img`
	background: #49475D;
	width: 184px;
	height: 184px;
	border-radius: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	cursor: pointer;
`

const SearchCard = styled(FlexCCBox)`
	width: 100%;
	margin: 40px 0 0;
	max-width: 800px;
	border-radius: 8px;
	color: #005F7D;
	font-size: 24px;
	overflow: hidden;
	background: #FFFFFF;
`

const SearchPosition = styled.input`
	width: 100%;
	height: 100%;
	border: 0 none;
	background: transparent;
	padding: 0 16px;
	color: #393939;
	font-size: 24px;
`

const SearchBtn = styled.div`
	height: 100%;
	font-size: 20px;
	padding: 8px 24px;	
	cursor: pointer;
	white-space: nowrap;
`

const SearchBefore = styled.div`
	width: 12px;
	height: 46px;
	margin-right: 20px;
	background: #005F7D;
`

const NftName = styled.div`
	width: 100%;
	text-align: center;
	color: #005F7D;
	font-weight: 700;
	font-size: 16px;
`

const NftTitle = styled.div`
	margin-top: 40px;
	font-weight: 700;
	font-size: 30px;
	color: #005F7D;
`

const Position = styled.div`
	font-weight: 400;
	font-size: 30px;
	color: #000000;
`

function Cns() {
	const ipsTips = useIpsTips()
	const { state: locationState } = useLocation()
	const [tokenId, setTokenId] = useState("--")
	const [state, setState] = useState("")
	const [bind, setBind] = useState(false)
	const [hash, setHash] = useState("")
	const [isBinded, setIsBinded] = useState(true)

	const ipsFactoryContract = useIPSFactoryContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()


	//	绑定
	const bindNft = useCallback(
		async () => {
			if (state) {
				const { bindAddress } = (locationState as NftType)
				if (!!bindAddress && !!tokenId && !bind) {
					if (bindAddress !== ZERO_ADDRESS) return ipsTips(t`Already bound`, { variant: "warning" });
					if (!!ipsFactoryContract && IPSNftAddress) {
						setBind(true)
						try {
							const info = await ipsFactoryContract.bind(tokenId, IPSNftAddress, state)
							await info.wait()
							setHash(info?.hash ?? "")
						} catch (error) {
							ipsTips(t`Bind NFT ERROR.`, { variant: "error" })
						}
						setBind(false)
					} else {
						console.log('1233131')
					}
				}
			} else {
				ipsTips(t`Enter a contract address`, { variant: "warning" })
			}


		}, [ipsFactoryContract, locationState, IPSNftAddress, ipsTips, state, bind])


	const init = useCallback(
		async () => {
			const { tokenId } = (locationState as NftType)
			if (ipsMetAverseRegisterContract) {
				const bindAddress = await ipsMetAverseRegisterContract.getTokenMeta(IPSNftAddress, tokenId);
				const isBinded = await ipsMetAverseRegisterContract.isBinded(bindAddress)
				console.log('bindAddress', bindAddress)
				console.log('isBinded', isBinded)
				if (isBinded) {
					setState(bindAddress)
				}
				setIsBinded(isBinded)
			} else {
				ipsTips(t`Not NFT`, { variant: "error" })
			}
		},
		[locationState, ipsMetAverseRegisterContract],
	)

	useEffect(() => {
		init()
	}, [locationState, hash])

	useEffect(() => {
		if (locationState) {
			setTokenId(BigNumber.from((locationState as NftType).tokenId).toString())
		}

	}, [locationState])

	return (
		<Main>
			<Container>

				<Details>
					<Item>
						<ImgBox>
							<Img>
							</Img>
							<NftName>
								<Trans>{isBinded ? "Already bound" : "Unbound"}</Trans>
							</NftName>
						</ImgBox>
					</Item>

					<Item>
						<NftTitle><Trans>Your SPACE NFT </Trans></NftTitle>
					</Item>
					<Item>
						<Position>TokenID: {tokenId}</Position>
					</Item>
					<Item>
						<SearchCard >
							{!isBinded ? <Fragment>
								<SearchBefore />
								<SearchIcon />
								<SearchPosition
									disabled={isBinded}
									value={state}
									placeholder={t`Enter a contract address`}
									onKeyUp={(e:any) => {
										if (e.key === "Enter") {
											bindNft()
										}
									}} onChange={(e:any) => {
										setState(e.target.value.trim())
									}} />
								<SearchBtn onClick={(e:any) => {
									if (!isBinded) {
										e.stopPropagation()
										bindNft()
									}
								}}>
									{isPending({ bind }, "bind", t`Bind`)}
								</SearchBtn>
							</Fragment> : <CopyBox text={state.slice(0, 7) + "..." + state.slice(state.length- 7)} textStyle={{color: "#CCC"}} />}
						</SearchCard>
					</Item>
				</Details>

			</Container>
		</Main>
	)
}


export default Cns