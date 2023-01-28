
import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../../../components/FlexBox"
import { BigNumberish } from "ethers"
import { useContext, useEffect, useState } from "react"

import styled from "styled-components"

import { IPSNFTContext, IPSNFTContextData } from "../../../hooks/useIPSNft"

import { getMetaData } from "../../SpaceNFT/getmetadata"
import NoDataItem from "../../noDataItem"
import DataItem from "../../DataItem"
import { useIPSMetAverseRegisterContract } from "../../../hooks/useContract"
import { IPSNftAddress } from '../../../constants/index'

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

const NoDadatBody = styled(FlexCCBox)`
width: 93%;
flex-direction: row;
flex-wrap:wrap;
margin: 0px auto 0 6.5%;
justify-content:start;
`

export interface NftType {
	tokenId: BigNumberish,
	bindAddress: string,
	isBinded: boolean,
	isCreated: boolean,
}

export default function MetaManage() {
	
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()
	const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)

	const ismobile = IPSNFT?.isMobile

	const [state, setState] = useState<NftType[]>([])
	const [nftLen, setNftLen] = useState(0)

    
	useEffect(() => {
		if (IPSNFT?.ipsNft && IPSNFT?.ipsNft?.length > 0) {
            // let i = 0
			let list:any = []
			 
			IPSNFT?.ipsNft.map( async (reitem, i) => {
				console.dir(11111)
				if(reitem){
					const bindAddress = await ipsMetAverseRegisterContract?.getTokenMeta(
					   IPSNftAddress,
					   reitem.tokenId.toString()
					 );
					 const isBinded = await ipsMetAverseRegisterContract?.isBinded(bindAddress);
					 const isCreated = await ipsMetAverseRegisterContract?.isCreated(
						bindAddress
					  );
					 if (isBinded || isCreated) {
                        list.push(reitem)
					 }
 
					 if((IPSNFT?.ipsNft.length - 1) === i){
						setState(list)
					  }
			   }
			 
			})
		}
	}, [IPSNFT])

	

	return (
		<HomeMain>
			{
				<NoDadatBody>
					{
					!state.length && [1,2,3].map((index)=>{
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
