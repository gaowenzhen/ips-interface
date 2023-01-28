import { Web3Provider } from "@ethersproject/providers";
import { t, Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { FlexCCBox } from "../../components/FlexBox";
import useIpsTips from "../../hooks/useIpsTips";
import { tryConnect } from "../../utils/ethers/tryConnect"
import styled from "styled-components";

const Main = styled(FlexCCBox)`
	width: 100%;
	height: 100%;
	min-width: 500px;
	min-height: 500px;
`

const Container = styled.div`
	background: #FFFFFF;
	box-shadow: 0px 5px 10px #D2D2D2;
	border-radius: 18px;
	padding: 40px 200px;
	cursor: pointer;
	font-size: 18px;
	font-weight: 700;
	color: #49475D;
`

function ConnectWallet() {
	const { account, chainId, activate, library } = useWeb3React<Web3Provider>();
	const ipsTips = useIpsTips()

	// useEffect(() => {
	// 	// alert("1")
	// 	console.log("CONNECT", account, chainId, activate, library)
	// }, [account, chainId, activate, library])

	return (
		<Main >
			<Container onClick={() => {
				
				tryConnect(activate).then((res) => {
					console.log("RES", res)
					ipsTips(t`Successfully linked Wallet`, {variant: "success"})
				}).catch((err) => {
					console.log("ERROR", err)
					window?.ethereum?.request({
						id: 1,
						jsonrpc: "2.0",
						method: 'wallet_switchEthereumChain',
						params: [{
							chainId: "0x13881",
						}],
					}).then((res: any) => {
						ipsTips(t`Switch network in chianId is 0x13881`)
						tryConnect(activate).then((res) => {
							console.log("RES", res)
							ipsTips(t`Successfully linked Wallet`, { variant: "success" })
						})
					})
				})
			}}>
				<Trans>CONNEXT TO WALLET</Trans>
			</Container>
		</Main>
	)
}

export default ConnectWallet