import { createContext, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, BigNumberish } from "ethers";
import { IPSNftAddress } from "../constants";
import { useIPSMetAverseRegisterContract, useIPSNftContract } from "./useContract";

// coord [x,y,z, hash]
export interface IPSNFTType {
	tokenId: BigNumberish, // tokenid 
	bindAddress: string, // bind 合约地址
	isBinded: boolean, // 是否bind nft
	isCreated: boolean, // 是否 创元宇宙
	isCoord?: boolean, // 是否生成坐标
	coord?: string[], // 坐标[x, y, z]
	isBindCns?: boolean, // 是否bind cns
	cnsName?: string, // cns name
	cnsTerm?: string, // cns 有效期
	coordHash?: string, // coord[3]
	metaverse?: string, // coord metaverse,
	ipfsUri: string
}

export type IPSNFTContextData = {
	ipsNft: IPSNFTType[],
	isMobile?: boolean,
	userBalance?: string,
	uchainId?: number,
	reUserBalance: Dispatch<SetStateAction<string>>
	setIpsNftHash: Dispatch<SetStateAction<string>>,
	tokenall: number
} | undefined

export const IPSNFTContext = createContext<IPSNFTContextData>(undefined);

// useSearchContext

export function useIPSNFT() {

	const { account } = useWeb3React<Web3Provider>();
	const ipsNftContract = useIPSNftContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()

	const [ipsNft, setIpsNft] = useState<IPSNFTType[]>([])
	const [hash, setHash] = useState("")
	const getNFT = useCallback(
		async () => {
			if (!!ipsNftContract && !!ipsMetAverseRegisterContract) {
				const nftLen = await ipsNftContract.balanceOf(account)
				// setNftLen(nftLen.toNumber())
				let count = 0
				const list: IPSNFTType[] = []
				while (nftLen.toNumber() > count) {
					const tokenId: BigNumberish = await ipsNftContract.tokenOfOwnerByIndex(account, BigNumber.from(count))
					const ipfsUri = await ipsNftContract.tokenURI(tokenId);
					console.dir(ipfsUri);
					console.log('--x')

					const bindAddress = await ipsMetAverseRegisterContract.getTokenMeta(IPSNftAddress, tokenId);
					console.log('bindAddress', bindAddress)
					const isBinded = await ipsMetAverseRegisterContract.isBinded(bindAddress)
					console.log('isBinded', isBinded)
					const isCreated = await ipsMetAverseRegisterContract.isCreated(bindAddress)

					list.push({
						tokenId,
						bindAddress,
						isBinded,
						isCreated,
						ipfsUri
					})
					setIpsNft(list.concat([]))
					count++
				}
			}
		},
		[ipsNftContract, account, ipsMetAverseRegisterContract]
	)

	useEffect(() => {
		if (!!hash) {
			getNFT()
		}
	}, [hash, ipsNftContract])

	useEffect(() => {
		setHash("---")
	}, [])

	return ({ ipsNft, setIpsNftHash: setHash })
}
