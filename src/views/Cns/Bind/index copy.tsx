import styled from "styled-components"
import { t, Trans } from "@lingui/macro"

import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";

import { IconButton, Paper } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SearchIcon from '@mui/icons-material/Search';

import { ReactComponent as TipsIcons } from "../../../asstes/cns/tips.svg";
import { ReactComponent as ArrowBottomIcons } from "../../../asstes/cns/arrowBottom.svg";
import CopyBox from "../../../components/CopyBox";

import { FlexCCBox, FlexSBCBox, FlexSCBox, FlexSSBox } from "../../../components/FlexBox";

import useIpsTips from "../../../hooks/useIpsTips";
import { TextFieldContainer } from "../../../views/SpaceNFT/Mint";
import { initData } from "../../../views/Meta/Create";
import { CreateBtn, DataType, LocationType } from "../../../views/Coord/Create";
import { isPending } from "../../../utils/isPending";
import { useIPSBaseCoordinateBindContract, useIPSCNSRegisterarControllerContract } from "../../../hooks/useContract";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useLocation } from "react-router-dom";
import { SearchContextData, SearchContext } from "../../../hooks/useSearchContext";
import { dayjsTime } from "../../../utils/dayjsTime";
import { CnsCard } from "../Details";
import { BindTips } from "../../../components/BIndTips";
import { ZERO_ADDRESS } from "../../../constants";
import useMediaQuery from "@mui/material/useMediaQuery";

const Main = styled.div`
	width: 100%;
	height: 100%;
`

// const Container = styled.div`
// 	width: 100%;
// 	height: 100%;
// 	padding: 0 70px;
// `

const Container = styled.div<{ isMobile?: boolean }>`
	width: ${({ isMobile }) => (isMobile ? "92%" : "90%;")};
	height: 100%;
	text-align: ${({ isMobile }) => (isMobile ? "" : "center;")};
	margin: 0 auto;
	text-align: left;
	padding-bottom:30px
`

const CardItem = styled.div`
	margin-top: 16px;
`

const Title = styled.div`
	font-weight: 400;
	font-size: 20px;
	color: #005F7D;
`

export const CopyIcon = styled(ContentCopyIcon)`
	margin: 0 16px;
	color: #5384FE;
	opacity: .8;
	cursor: pointer;
`

const Details = styled.div`
	margin-top: 20px;
	width: 100%;
`

const Item = styled(FlexCCBox)`
	margin-top: 20px;
	width: 100%;
`

const ImgBox = styled(FlexCCBox)`
	padding: 20px;

	background: #E7F0F3;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
border-radius: 18px;
`

const Img = styled.img`
	background: #49475D;
	width: 220px;
	height: 200px;
	border-radius: 8px;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`
const CefontSize = styled.div<{ isMobile?: boolean }>`
 font-size:${({ isMobile }) => (isMobile ? "initial" : "20px")};
 display:inline;
`

export default function Bind() {
	const ismobile = useMediaQuery("(min-width:980px)");
	const ipsTips = useIpsTips()
	const locationState = useLocation()
	const { account, chainId, library } = useWeb3React<Web3Provider>();
	const searchContextData = useContext<SearchContextData>(SearchContext)
	const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract()
	const ipsCns = useIPSCNSRegisterarControllerContract()

	const [cnsName, setCnsName] = useState(searchContextData?.searchState || "")
	const [cnsNameBinded, setCnsNameBinded] = useState("")

	const [cnsTime, setCnsTime] = useState(false)
	// coord verification
	const [coord, setCoord] = useState<string[]>([])

	// verification
	const [verification, setVerification] = useState(false)

	const [createStatus, setCreateStatus] = useState(false)
	const [tokenId, setTokenId] = useState<DataType>(initData)
	const [contractAddress, setContractAddress] = useState<DataType>(initData)

	const bindCns = useCallback(
		async () => {
			// console.dir(ipsBaseCoordinateBindContract)
			// console.dir(tokenId.default)
			// console.dir(contractAddress.default)
			// console.dir(cnsName)
			// console.dir(cnsTime)
			if (ipsBaseCoordinateBindContract && !!tokenId?.default && !!contractAddress.default && !!cnsName && !!cnsTime) {
				try {
					console.dir(2)
					const info = await ipsBaseCoordinateBindContract.BindCNS(contractAddress.default, tokenId.default, cnsName)
					console.log("INFO", info)
					await info.wait()
					ipsTips(`TokenId ${tokenId.default} bind ${cnsName} SUCCESS`, { variant: "success" })
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				} catch (error) {
					ipsTips(`TokenId ${tokenId.default} bind ${cnsName} ERROR`, { variant: "error" })
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				}

			}
		},
		[ipsBaseCoordinateBindContract, tokenId, contractAddress, cnsName, cnsTime]
	)

	const verificationCallBack = useCallback(
		async () => {
			if (!cnsName) {
				ipsTips(t`Enter CNS name`, { variant: "warning" })
			} else {
				if (ipsCns && ipsBaseCoordinateBindContract && contractAddress.default && tokenId.default) {
					const cnsTime = await ipsCns.nameExpires(cnsName)
					//console.dir(cnsTime)
					//console.dir('---w')
					const cnsCoord = await ipsBaseCoordinateBindContract.nameCoordinate(cnsName)
					const { x, y, z, metaverse } = cnsCoord
					//console.dir(contractAddress.default)
					//console.dir('---123r-')
					const info = await ipsBaseCoordinateBindContract.getTokenCNS(contractAddress.default, tokenId.default)
					let count = 0

					const coord = [x.toString(), y.toString(), z.toString()]
					if (info) {
						setCnsNameBinded(info)
						ipsTips(`The tokenId ${tokenId.default} can be ${info}`, { variant: "warning" })
					} else {
						count++;
					}

					if (cnsTime.toString() === "0") {
						setCnsTime(false)
						setCoord([])
						ipsTips(`The current domain name not register to cns add`, { variant: "warning" })
					} else {
						if (metaverse !== ZERO_ADDRESS) {
							setCoord(coord)
							ipsTips(`Current CNS name ${cnsName} bind coord [${coord.join(", ")}].`, { variant: "warning" })
						} else {
							count++;
						}
						count++;
						setCnsTime(true)
					}
					setVerification(count === 3)
					if (count === 3) {
						ipsTips(`Current CNS name ${cnsName} Can bind tokenId ${tokenId.default}.`, { variant: "success" })
					}
					setCreateStatus(false)
				}
			}
		},
		[ipsCns, ipsTips, cnsName, ipsBaseCoordinateBindContract, contractAddress, tokenId],
	)

	useEffect(() => {
		if (locationState?.state) {
			const tokenId = (locationState?.state as LocationType)?.tokenId ?? ""
			const contractAddress = (locationState?.state as LocationType)?.bindAddress.toString() ?? ""
			setTokenId({
				default: tokenId,
				isError: !tokenId
			})
			setContractAddress({
				default: contractAddress,
				isError: !contractAddress
			})
		}

		if (searchContextData?.searchState) {
			setCnsName(searchContextData?.searchState)
		}

	}, [locationState,searchContextData])

	// useLayoutEffect(() => {
	// 	if (searchContextData?.searchState) {
	// 		setCnsName(searchContextData?.searchState)
	// 	}
	// }, [searchContextData])

	useEffect(() => {
		setVerification(false)
	}, [cnsName, tokenId, contractAddress,coord])



	let isCoordUi = (<Item>Current CNS name <BindTips>{ cnsName }</BindTips> not register.</Item>)
	if(cnsName && typeof cnsName !== 'undefined') {
		if (cnsTime && coord.length) {
			isCoordUi = (<Item>Current CNS name<BindTips>{ cnsName }</BindTips> bind coord <BindTips>[{coord.join(", ")}]</BindTips> .</Item>)
		} else {
			isCoordUi = (<Item>Current CNS name <BindTips>{ cnsName }</BindTips> can be bound.</Item>)
		}
	}

	return (
		<Main>
			<Container isMobile={ismobile}>

				<CardItem>
					<Title>
						<Trans>Your CNS: </Trans>
					</Title>
				</CardItem>
				<CefontSize isMobile={ismobile}>
				 {isCoordUi}
				</CefontSize>
				<CardItem>
					<CnsCard
						disabled={!!cnsTime}
					>
						<CopyBox textStyle={{ color: cnsTime ? "#FFFFFF" : "#888888" }} text={cnsName} />
					</CnsCard>
				</CardItem>

				<Details>
					<Item>
						<ImgBox>
							<Img>
							</Img>
						</ImgBox>
					</Item>
					<CefontSize isMobile={ismobile}>
					{
						cnsNameBinded ?
							<Item>Cuurent TokenId  <BindTips>{tokenId.default}</BindTips> bind cns name <BindTips>{cnsNameBinded}</BindTips>.</Item> :
							<Item>Cuurent TokenId  <BindTips>{tokenId.default}</BindTips> can be bound.</Item>
					}
					</CefontSize>
					<Paper
						component="form"
						sx={{ p: '2px 4px', display: 'flex', flexDirection: "column", alignItems: 'center', padding: "20px", marginTop: "32px", minWidth: "98%" }}
					>
						<Item>
							<TextFieldContainer
								error={createStatus && tokenId.isError}
								helperText={t`Please enter TokenID value`}
								id="demo-helper-text-aligned"
								label={"TokenID"}
								value={tokenId.default}
								onChange={(e:any) => {
									const val: string = e.target.value.trim() ?? ""
									setTokenId({
										default: val,
										isError: !val
									})
								}}
							/>
						</Item>
						<Item>
							<TextFieldContainer
								error={createStatus && contractAddress.isError}
								helperText={t`Please enter NFT contract address`}
								id="demo-helper-text-aligned"
								label={t`NFT contract address`}
								value={contractAddress.default}
								onChange={(e:any) => {
									const val: string = e.target.value.trim() ?? ""
									setContractAddress({
										default: val,
										isError: !val
									})
								}}
							/>
						</Item>
						<Item>
							<CreateBtn
								disabled={true}
								onClick={() => {
									
									if (!createStatus) {
										setCreateStatus(true)
										if (!verification) {
											verificationCallBack()
										} else {
												bindCns()
										}
									}
								}}>{isPending({ createStatus: createStatus }, "createStatus", verification ? <Trans>Create</Trans> : <Trans>verification</Trans>)}</CreateBtn>
						</Item>
					</Paper>
				</Details>

			</Container>
		</Main>
	)
}


