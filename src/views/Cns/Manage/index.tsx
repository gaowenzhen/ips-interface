import { useCallback, useEffect, useState } from "react"

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish, BigNumber } from "ethers";
import { useIPSCNSRegisterarControllerContract, useIPSBaseCoordinateBindContract } from "../../../hooks/useContract";
import { dayjsTime } from "../../../utils/dayjsTime"
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

export interface ListType {
	tokenId: BigNumberish, // tokenid 
	coord?: string[], // 坐标[x, y, z]
	cnsName?: string, // cns name
	cnsTerm?: string, // cns 有效期,
	info?: string, // info
}

export default function Manage() {


	const { account } = useWeb3React<Web3Provider>();
	const ipsCns = useIPSCNSRegisterarControllerContract()
	const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract();

	const [avatarUrl, setAvatarUrl] = useState("1")
	const [yearNum, setYearNum] = useState(1)
	const [cnsNftLen, setCnsNftLen] = useState(0)
	const [list, setList] = useState<ListType[]>([])
	const [lsLoadin, setLsLoadin] = useState(true)
	let newlist: ListType[] = []
	const getCnsList = useCallback(
		async () => {
			if (ipsCns) {
				const cnsLen = await ipsCns.balanceOf(account)
				setCnsNftLen(cnsLen.toNumber())
				let count = 0
				// console.log('cnsLen', cnsLen)
                
				while (cnsLen.toNumber() > count) {
					const tokenId: BigNumberish = await ipsCns.tokenOfOwnerByIndex(account, BigNumber.from(count))
					// console.log('tokenId', tokenId)
					const infoName = await ipsCns.tokenName(tokenId)
					//console.log('infoName', infoName)
					const info = await ipsCns.nameExpires(infoName)
					//console.log("INFO", info.toString())
					const cnsCoord = await ipsBaseCoordinateBindContract?.nameCoordinate(infoName);
					const { x, y, z, metaverse } = cnsCoord;


					newlist.push({coord: [x.toString(),y.toString(),z.toString()], tokenId: tokenId, cnsName: infoName, info: dayjsTime(info.toString())})
					count++;
				}
                setList(newlist)
                if(newlist.length < 1) {
					setLsLoadin(false)
				}

			}
			
		},
		[ipsCns, account]
	)

	const navigate = useNavigate();
	const goDetails = (item:any) => {
		navigate("/cns/details", { state: item });
	}

	const toAdddoMain = () => {
		navigate("/cns");
	}


	useEffect(() => {
		getCnsList()
	}, [ipsCns, account])

	return (
		<div className="cnsbody">
		<div className="inputbox Renewbgcolor">
			<div className="cnsconfigbox">
				<div className="cnsconfbody cnsmsgbody">
					<div className="top">
					  <span><img src="/static/images/metamask-fox.svg"/>{account}</span>
					</div>
					<div className="listbox"></div>
					<div className="cnmsglist">
					{
						!!list.length &&list.map((item,index)=>{
							return   <div onClick={()=>{goDetails(item)}} key={index} className="item">
							<div className="l"><span>{item?.cnsName}.ips</span><span>Crood {JSON.stringify(item?.coord)}</span></div>
							<div className="r"><span>Expires {item?.info}</span></div>
						  </div>
						})
					}
					{
						(!list.length && list.length < 1 && lsLoadin)? <div className="lodingbox"><CircularProgress/></div>:null
					}
					{
						(!list.length && list.length < 1 && !lsLoadin)? <div>This address does not own any domains <span className="colorblue" onClick={toAdddoMain}>to add a domain name</span></div>: ''
					}
					</div>
				</div>
			</div>
		</div>
		</div>
	)
}
