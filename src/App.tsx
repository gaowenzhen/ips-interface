
import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router } from "react-router-dom";

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { WALLET_CONNECT, IPFS_PINT } from './constants';
import "./App.css";

import { RoutesList } from './routes';
import { tryConnect } from './utils/ethers/tryConnect';
import { useIPSNftContract, useIPSMetAverseRegisterContract } from './hooks/useContract';
import { BigNumberish, BigNumber } from 'ethers';
import { IPSNFTContext, IPSNFTType } from './hooks/useIPSNft';
import useMediaQuery from "@mui/material/useMediaQuery";
import './utils/checkdev.js'

export interface NftType {
	tokenId: BigNumberish,
	bindAddress: string,
	isBinded: boolean,
	isCreated: boolean,
	ipfsUri: string
}

export default function App() {

	const { account, chainId, activate } = useWeb3React<Web3Provider>();
	const ipsNftContract = useIPSNftContract()
	const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract()

	const [connect, setConnect] = useState("")
	const [tokenall, setTokenall] = useState(0)
	const [ipsNft, setIpsNft] = useState<IPSNFTType[]>([])
	const [hash, setHash] = useState("")
	const [userBalance,setUserBalance] = useState("0")
	const [uchainId, setChainId] = useState<any>(chainId);


	useEffect(() => {
		const walletStatus = sessionStorage.getItem(WALLET_CONNECT)
		if (walletStatus !== "WALLET_CONNECT") {
			//setTimeout(() => {
				//切换连网络
				tryConnect(activate).then((res:any) => {
					console.log("RES-1", res)
					setConnect(+new Date() + "")
				}).catch((err:any) => {
					console.log("ERROR", err)
					// metamask主动切换,网络id 5
					//0x2a
					// 0x5
					//  chainId: utils.hexValue(80001), // '0x13881'
					// wallet_switchEthereumChain
					window?.ethereum?.request({
						id: 1,
						jsonrpc: "2.0",
						method: 'wallet_switchEthereumChain',
						params: [{
							chainId: "0x13881",
						}],
					}).then((res: any) => {
						//切换连网络
						tryConnect(activate).then((res:any) => {
							console.log("RES-2", res)
							setConnect(+new Date() + "")
						})
					})
				})
			// }, 500);
		}
	}, [])

    // 提前获取，当前钱包地址的，全部nft
	let list: NftType[] = []
	let tokenalllen: any = "0"

	const getNFT = useCallback(
		async () => {
			
			if (!!ipsNftContract && !!ipsMetAverseRegisterContract) {
				setUserBalance('0')
				const nftLen = await ipsNftContract.balanceOf(account)
				// 全部token
				const gettokenalllen = await ipsNftContract.totalSupply()
				if(gettokenalllen){
					tokenalllen = gettokenalllen.toString();
					setTokenall(parseInt(tokenalllen))
				}
				list = []
				let count = 0
				while (nftLen.toNumber() > count) {

					 const tokenId: BigNumberish = await ipsNftContract.tokenOfOwnerByIndex(account, BigNumber.from(count));

                    if(tokenId){
						const reipfsUri = await ipsNftContract.tokenURI(tokenId);

						let newipfsUri = ''
						if (/https:\/\/ipfs\./g.test(IPFS_PINT)) {
							newipfsUri = reipfsUri.replace('ipfs://', IPFS_PINT)
						} else {
							newipfsUri = IPFS_PINT + tokenId
						}
						 
						list.push({
							tokenId,
							ipfsUri: newipfsUri,
							bindAddress: '',
							isBinded:false,
							isCreated: false
						})
						count++
					}

				}
				setIpsNft(list);
				setChainId(chainId);
			}

		},
		[ipsNftContract, account, ipsMetAverseRegisterContract,chainId]
	)

	useEffect(() => {
		setHash(+new Date() + "")
		getNFT()
	}, [account,chainId])
 
	// key强刷新 <RoutesList key={connect} />
	// 判断是否移动版
	const isMobile = useMediaQuery("(min-width:768px)");

	return (
		<IPSNFTContext.Provider value={{uchainId, tokenall, ipsNft, setIpsNftHash: setHash, isMobile, userBalance, reUserBalance: setUserBalance }}>
			<Router>
				<RoutesList />
			</Router>
		</IPSNFTContext.Provider>
	)
}
