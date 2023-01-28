import { useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import { TextField, Paper, MenuItem, Select } from '@mui/material'

import { FlexCCBox } from '../../../components/FlexBox'
import { isPending } from '../../../utils/isPending'
import { t, Trans } from '@lingui/macro'
import { initData } from '../../../views/Meta/Create'
import useIpsTips from '../../../hooks/useIpsTips'
import { DataType } from '../../../views/Coord/Create'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'

import { ipsAuctionMintNFTPayable, ipsWhiteMintNFTPayable, ipsPublicMintNFTPayable } from "../../../utils/ipsMintNFTPayable";
import { WHITE_ADDRESS } from '../../../constants'
// import useMediaQuery from "@mui/material/useMediaQuery";

const Main = styled(FlexCCBox)`
	width:100%;
	height: 100%;
`

const Item = styled(FlexCCBox)`
	width: 100%;
	margin-top: 20px;
	padding: 0 20px;
`

export const TextFieldContainer = styled(TextField)`
	width: 100%;
`

const SelectContainer = styled(Select)`
	width: 100%;
`

const CreateBtn = styled(FlexCCBox) < { disabled?: boolean } >`
	padding: 4px 24px;
	background: transparent;
	color: #005F7D;
	white-space: nowrap;
	border: 1px solid #BED6DD;
	border-radius: 9px;
	margin-left: 24px;
	cursor: pointer;
	opacity: ${({ disabled }) => disabled ? "1" : "0.2"};
`

const mint = ["AUCTIONMINT", "PUBLICMINT", "WHITEMINT"]

export default function Mint() {

	const { account, chainId } = useWeb3React<Web3Provider>();

	const [mintTypeList, setMintTypeList] = useState(mint)
	const [createStatus, setCreateStatus] = useState(false)
	const [isCreate, setIsCreate] = useState(false)
	const ipsTips = useIpsTips()

	const [mintNum, setMintNum] = useState<DataType>(initData)
	// const [contractAddress, setContractAddress] = useState<DataType>(initData)

	useEffect(() => {
		// setIsCreate(!!mintNum && !!contractAddress)
		setIsCreate(!!mintNum)
	}, [mintNum])

	const [mintType, setMintType] = useState("AUCTIONMINT");

	useEffect(() => {
		if (account) {
			const flag = WHITE_ADDRESS.includes(account)
			if (flag) {
				setMintTypeList(mint)
			} else {
				setMintTypeList(mint.slice(0, 2))
			}
			setMintType("AUCTIONMINT")
		}
	}, [account])

	const handleChange = (event: any, v: any) => {
		setMintType(event.target.value as string);
	};

	const mintCallback = useCallback(
		async () => {
			if (!!mintNum?.default) {
				let mintCall = ipsAuctionMintNFTPayable
				switch (mintType) {
					case "WHITEMINT":
						mintCall = ipsWhiteMintNFTPayable
						break;
					case "PUBLICMINT":
						mintCall = ipsPublicMintNFTPayable
						break
					default:
						break;
				}
		
				mintCall(account, chainId, mintNum.default).then((res: any) => {
					console.log('RES', res)
					ipsTips(t`MINT SUCCESS`, { variant: "success" })
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				}).catch((err: any) => {
					console.dir(err)
					ipsTips(t`MINT ERROR`, { variant: "error" })
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				})

			} else {
				setTimeout(() => {
					ipsTips(t`Enter the corresponding parameters`, { variant: "warning" })
					setCreateStatus(false);
				}, 500)
			}

		},
		[account, chainId, mintType, mintNum]
	)

	return <Main>
		<Paper
			component="form"
			sx={{ p: '2px 4px', display: 'flex', flexDirection: "column", alignItems: 'center', padding: "20px 0", minWidth: "90%" }}
		>
			<Item>
				<TextFieldContainer
					error={createStatus && mintNum.isError}
					helperText={t`Please enter Mint number`}
					id="demo-helper-text-aligned"
					label={"Mint number"}
					type={"number"}
					value={mintNum.default}
					onChange={(e:any) => {
						const val: string = e.target.value.trim() ?? ""
						setMintNum({
							default: Math.floor(Number(val)) + "" || "1",
							isError: !val
						})
					}}
				/>
			</Item>
			<Item>
				<SelectContainer
					value={mintType}
					displayEmpty
					inputProps={{ 'aria-label': 'Without label' }}
					onChange={handleChange}
				>
					{
						mintTypeList.map((item,idx) => <MenuItem key={idx} value={item}>
							<em>{item}</em>
						</MenuItem>)
					}
				</SelectContainer>
				{/* <FormHelperText>Without label</FormHelperText> */}
			</Item>
			{/* <Item>
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
			</Item> */}
			<Item>
				<CreateBtn
					disabled={isCreate}
					onClick={() => {
						if (!createStatus) {
							setCreateStatus(true)
							if (isCreate) {
								mintCallback()
							}
						}
					}}>{isPending({ createStatus: createStatus && isCreate }, "createStatus", <Trans>Create</Trans>)}</CreateBtn>
			</Item>
		</Paper>
	</Main >

}
