import { IPSCoordinateSystemAddress, RPC_URL } from "../constants";
import IPSCoordinateSystemABI from "../abi/ipsCoordinateSystemAbi.json";
// import CoordAll from "../abi/coord10610.json";

import Web3 from 'web3'
// const SHA256 = require("crypto-js/SHA256");

export const ipsCoordPayable = async (coord, tokenId, hash) => {
	var web3 = new Web3(window.ethereum || RPC_URL)
	const ctr = new web3.eth.Contract(IPSCoordinateSystemABI, IPSCoordinateSystemAddress);
	console.log('ctr', ctr, coord, tokenId, hash)
	const info = await ctr.methods.createCoordinate(coord, tokenId, hash).call()
	console.log('info', info)
	return info
}

const randomNum = (m,n) =>{
    var num = Math.floor(Math.random()*(m - n) + n);
    return num;
}

export const createCoordRs = () => {
	//let index = randomNum(0,10610)
	//let itemxyz = CoordAll[index]
	//return itemxyz.map((item) => item.toString())
	return ["32","54","12"]
}


