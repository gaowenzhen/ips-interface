import { BigNumberish } from "ethers"
import { useContext, useEffect, useState } from "react"
import { FlexCCBox } from "../../../components/FlexBox"

import styled from "styled-components"

import { IPSNFTContext, IPSNFTContextData } from "../../../hooks/useIPSNft"

import { getMetaData } from "../getmetadata"
import NoDataItem from "../../noDataItem"
import DataItem from "../../DataItem"
 

const HomeMain = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
`

const NoDadatBody = styled(FlexCCBox)`
width: 93%;
flex-direction: row;
flex-wrap:wrap;
margin: 0px auto 0 6.5%;
justify-content:start;
`


export interface MetaNftType {
	tokenId: BigNumberish,
	bindAddress: string,
	metaverse: string,
	coordHash: string,
	coord: string[],
	cnsName: string,
	cnsTerm: string
}

export interface NftType {
	tokenId: BigNumberish,
	ipfsUri: string
	bindAddress: string,
	isBinded: boolean,
	isCreated: boolean,
	coord: string,
	image: string,
}

export default function Manage() {
 
	const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
	const [state, setState] = useState<NftType[]>([])

	useEffect(() => {
		if (IPSNFT?.ipsNft && IPSNFT?.ipsNft?.length > 0) {
			getMetaData(IPSNFT.ipsNft).then((newitem) => {
				setState(newitem)
			})
		}
	}, [IPSNFT])

	return (
		<HomeMain>
			{
				
				<NoDadatBody>
					{
					(!state.length || state.length < 1) && [1,2,3].map((index)=>{
						return <NoDataItem isMobile={IPSNFT?.isMobile} key={index}/>
					})
					}
					{
							(!!state.length || state.length > 0) && state.map((item,index)=>{
								return <DataItem isMsg={true} itemObjet={item} isMobile={IPSNFT?.isMobile} key={index}/>
							})
					}
				</NoDadatBody>
			}
			
		</HomeMain>
	)
}
