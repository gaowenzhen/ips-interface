import Web3 from 'web3'
import { RPC_URL } from "../constants";
var abi = require('ethereumjs-abi')

const private_key = "0x3bbeb2ffb668f64650ba92b20313f559e6bd71208bc8074ac939078d14f91bd1"
export function web3Sign(coord) {
	var web3 = new Web3(window.ethereum || RPC_URL)
	var hash = "0x" + abi.soliditySHA3(
		["uint256", "uint256", "uint256", "uint256"],
		coord
	).toString("hex");
	var sig = web3.eth.accounts.sign(hash, private_key);
	return sig.signature
}