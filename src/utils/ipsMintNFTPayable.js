import { IPSNftAddress, RPC_URL, WHITE_ADDRESS } from "../constants";
import IPSNftABI from "../abi/IPS.json";

import Web3 from 'web3'
import { BigNumber } from "ethers";
const { MerkleTree } = require("merkletreejs");


export function ipsNftContract () {
	var web3 = new Web3(window.ethereum || RPC_URL)
	const ctr = new web3.eth.Contract(IPSNftABI, IPSNftAddress)
	return [web3, ctr]
}

export function transactionOption(web3, call, account, amount, mintN, chainId) {

	const transaction = {
		"to": IPSNftAddress,
		"from": account,
		"value": BigNumber.from(amount).mul(BigNumber.from(mintN)).toHexString(),
		// "value": (amount * mintN).toString(),
		"data": call.encodeABI(),
		"chainId": chainId
	}

	// console.dir(transaction)
	
	return call.estimateGas({ from: account, value: amount })
		.then( (result) => {
			return web3.eth.sendTransaction(transaction,()=>{
				return result
			 })
		})
}

//### AUCTIONMINT
export const ipsAuctionMintNFTPayable = async (account, chainId, mintN) => {
	const [web3, ctr] = ipsNftContract()
	const auctionSaleStart = await ctr.methods.saleConfig().call();
	const auctionSaleStartTime = auctionSaleStart.auctionSaleStartTime
	const amount = await ctr.methods.getAuctionPrice(auctionSaleStartTime).call();
	// const nonce = await web3.eth.getTransactionCount(IPSNftAddress, "latest");
	var call = ctr.methods.auctionMint(mintN)

	return transactionOption(web3, call, account, amount, mintN, chainId);
}

//### PUBLICMINT -- 大于1，无法查出gat费用
export const ipsPublicMintNFTPayable = async (account, chainId, mintN, coordRs) => {
 

	const [web3, ctr] = ipsNftContract()
	const auctionSaleStart = await ctr.methods.saleConfig().call();
	const amount = auctionSaleStart.publicPrice
	var call = ctr.methods.publicSaleMint(mintN)
 
	return transactionOption(web3, call, account, amount, mintN, chainId)
}

export const ipsWhiteMintNFTPayable = async (account, chainId, mintN) => {

	const [web3, ctr] = ipsNftContract()
	const { mintlistPrice: amount } = await ctr.methods.saleConfig().call();
	const tree = new MerkleTree(WHITE_ADDRESS.map((x) => web3.utils.sha3(x + "31")), web3.utils.sha3, { sort: true });
	const root = tree.getRoot();
	const root_hash = tree.getHexRoot();
	const leaf = web3.utils.sha3(account);
	const proof1 = tree.getHexProof(leaf);
	 
	var call = ctr.methods.whitelistMint(mintN, proof1)
	return transactionOption(web3, call, account, amount, mintN, chainId)
}
