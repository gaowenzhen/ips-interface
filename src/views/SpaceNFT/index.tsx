import { BigNumberish } from "ethers"
import { useContext, useEffect, useState } from "react"
import { FlexCCBox } from "../../components/FlexBox"
import styled from "styled-components"

import { IPFS_URI } from '../../constants/index'
import { getMetaData } from "./getmetadata"
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft"
import NoDataItem from "../noDataItem";
import DataItem from "../DataItem";
import useIpsTips from "../../hooks/useIpsTips";

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
background: #F9F9F9;
`

export interface NftType {
	tokenId: BigNumberish,
	bindAddress: string,
	isBinded: boolean,
	isCreated: boolean,
}

export default function SpaceNFT() {

	const ipsTips = useIpsTips();
	const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
	const ismobile = IPSNFT?.isMobile

	const [state, setState] = useState<NftType[]>([])
	// const [nftLen, setNftLen] = useState(false)
    let isload = false

	useEffect(() => {
  
		if (IPSNFT?.tokenall && IPSNFT?.tokenall > 0 && !isload) {
			// console.dir(IPSNFT?.tokenall)
			isload = true
            let items = []
		 
			for (let r = 0; r < IPSNFT?.tokenall; r ++) {

				let item = {
					tokenId: r,
					ipfsUri: IPFS_URI + r + '.json',
					bindAddress: "",
					isBinded:false,
					isCreated: false
				}
				items.push(item);
			}
			 
			getMetaData(items).then((newitem) => {
				setState(newitem)
			}).catch((err) => {
				ipsTips(`Failed to request ipfs metadata or time out`, { variant: "error" });
			});
		}
	}, [IPSNFT])

	return (
		<HomeMain>
			{
				<NoDadatBody>
					{
					!state.length && [1,2,3,4,5,6].map((index)=>{
						return <NoDataItem isMobile={ismobile} key={index}/>
					})
					}
					{
							!!state.length &&state.map((item,index)=>{
								return <DataItem itemObjet={item} isMobile={ismobile} key={index}/>
							})
					}
				</NoDadatBody>
			}
		</HomeMain>
	)
}
