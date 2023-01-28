import { WALLET_CONNECT } from "../../constants";
import { ActivateType } from "../../types/web3React";
import { connector } from "./connector";


// 连接 metamask
export const tryConnect = (activate: ActivateType) => {
	return activate(
		connector,
		(err:any) => {
			console.log("ERROR", err);
		},
		true
	).then(() => {
		sessionStorage.setItem(WALLET_CONNECT, +new Date() + "")
	});
};
