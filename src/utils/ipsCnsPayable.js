import { IPSCNSRegisterarControllerAddress, RPC_URL } from "../constants";
import IPSCNSRegisterarControllerABI from "../abi/CNSRegistrarController.json";

import Web3 from 'web3'
import { BigNumber } from "ethers";

export function ipsCNSRegisterarControllerContract() {
	const web3 = new Web3(window.ethereum || RPC_URL)
	const ctr = new web3.eth.Contract(IPSCNSRegisterarControllerABI, IPSCNSRegisterarControllerAddress)
	return [web3, ctr]
}

export function transactionOption(web3, call, account, amount, chainId) {

	const transaction = {
		"to": IPSCNSRegisterarControllerAddress,
		"from": account,
		"value": BigNumber.from(amount).toHexString(),
		"data": call.encodeABI(),
		"chainId": chainId
	}

	return call.estimateGas({ from: account, value: amount }).then((result) => {
		return web3.eth.sendTransaction(transaction,()=>{
           return result
		})
	})
}

export const ipsCnsPayable = async ({ account, chainId }, { cnsName, cnsTerm, isRenew }) => {

	const [web3, ctr] = ipsCNSRegisterarControllerContract()

	//var price = await deployedCNSRegistrarController.price('wwww.comf', 30);
  //  await waitTrans(await deployedCNSRegistrarController.connect(user1).registerWithConfig(domain, domainDuration, { value: price }), "buy domain");
  console.dir(cnsTerm)
  console.dir('--xx---')

	const amount = await ctr.methods.price(cnsName, cnsTerm).call();

	let call = await ctr.methods.registerWithConfig(cnsName, cnsTerm)
	if (isRenew) {
		console.log('isRenew', isRenew)
		call = ctr.methods.renew(cnsName, cnsTerm)
	}

	return transactionOption(web3, call, account, amount, chainId);
}


