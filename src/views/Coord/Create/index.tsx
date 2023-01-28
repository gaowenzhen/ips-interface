import { useCallback, useEffect, useState } from 'react'

import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { TextField, Paper } from '@mui/material'

import { FlexCCBox } from '../../../components/FlexBox'
import { useIPSCoordinateSystemContract } from '../../../hooks/useContract'
import { web3Sign } from '../../../utils/web3Sign'
import { isPending } from '../../../utils/isPending'
import { t, Trans } from '@lingui/macro'
import { initData } from '../../../views/Meta/Create'
import useIpsTips from '../../../hooks/useIpsTips'
import { createCoordRs } from '../../../utils/ipsCoordPayable'
import { TextFieldContainer } from '../../../views/SpaceNFT/Mint'
import { BigNumber } from 'ethers';

const Main = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
`

const Item = styled(FlexCCBox)`
	width: 100%;
	margin-top: 20px;
	padding: 0 20px;
`


export const CreateBtn = styled(FlexCCBox) < { disabled?: boolean } >`
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

export const CoordBox = styled.div`
	color: #005F7D;
	font-size: 16px;
	font-weight: 700;
	padding-left: 4px;
`

export interface LocationType { tokenId: string, contractAddress: string, bindAddress:string }
export interface DataType { default: string, isError: boolean }

export default function Create() {
	const { state } = useLocation()
	//console.dir(state)
	//console.dir('create.tsx -- create')
	const [coord, setCoord] = useState(["0", "0", "0"])
	const [createStatus, setCreateStatus] = useState(false)
	const [isCreate, setIsCreate] = useState(false)
	const ipsTips = useIpsTips()

	const ipsCoordinateSystem = useIPSCoordinateSystemContract()

	const [tokenId, setTokenId] = useState<DataType>(initData)
	const [contractAddress, setContractAddress] = useState<DataType>(initData)

	const createCoord = useCallback(
		async () => {
			if (ipsCoordinateSystem && tokenId) {

				const [x, y, z] = coord
				const coordHash = [x, y, z, tokenId.default]
				const coordParams = [x, y, z, tokenId.default,contractAddress.default]
				const hash = web3Sign(coordHash)
				 
				// console.dir(JSON.stringify(coordParams))
				// console.dir(tokenId.default)
				// console.dir(hash)

				try {
					const info = await ipsCoordinateSystem.createCoordinate(coordParams, tokenId.default, hash)
					console.log("INFO", info)
					await info.wait()
					ipsTips(t`Create Coord SUCCESS`, { variant: "success" })
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				} catch (error) {
					ipsTips(t`Create Coord ERROR`, { variant: "error" })
					console.log("ERROR", error)
					setTimeout(() => {
						setCreateStatus(false);
					}, 2000)
				}

			}
		},
		[ipsCoordinateSystem, tokenId, contractAddress, coord]
	)



	useEffect(() => {
		setCoord(createCoordRs())
	}, [])

	useEffect(() => {
		setIsCreate(!!tokenId && !!contractAddress)
	}, [tokenId, contractAddress])


	useEffect(() => {
		if (state) {
			const tokenId = (state as LocationType)?.tokenId ?? ""
            const id = BigNumber.from(tokenId).toString()
			const contractAddress = (state as LocationType)?.bindAddress.toString() ?? ""
			setTokenId({
				default: id.toString(),
				isError: !id
			})
			setContractAddress({
				default: contractAddress,
				isError: !contractAddress
			})
		}
	}, [state])

	return <Main>
		<Paper
			component="form"
			sx={{ p: '2px 4px', display: 'flex', flexDirection: "column", alignItems: 'center', padding: "20px 0", minWidth: "94%" }}
		>
			<Item>
				Coord: [X: <CoordBox> {coord[0]}</CoordBox>, Y: <CoordBox> {coord[1]}</CoordBox>, Z: <CoordBox> {coord[2]}</CoordBox>]
			</Item>
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
					disabled={isCreate}
					onClick={() => {
						if (!createStatus) {
							setCreateStatus(true)
							if (isCreate) {
								createCoord()
							}
						}
					}}>{isPending({ createStatus: createStatus && isCreate }, "createStatus", <Trans>Create</Trans>)}</CreateBtn>
			</Item>
		</Paper>
	</Main >

}
