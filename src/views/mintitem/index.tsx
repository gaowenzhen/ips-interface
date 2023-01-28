import { ReactComponent as IpsShowico } from "../../asstes/app/ipsShowico.svg";
import { ReactComponent as Ringrat } from "../../asstes/app/ringrat.svg";
import { ReactComponent as Cnsicon } from "../../asstes/app/cnsicon.svg";
import { ReactComponent as Timeicon } from "../../asstes/app/timeicon.svg";
import { useLocation,useNavigate } from "react-router-dom";
import { useIPSCoordinateSystemContract, useIPSBaseCoordinateBindContract,
  useIPSCNSRegisterarControllerContract, } from '../../hooks/useContract'
import { useCallback, useEffect, useState,useContext } from 'react'
import { IPSNftAddress, ZERO_ADDRESS } from "../../constants";
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft";
import { ethers } from "ethers";

import formatedData from "../../utils/formatedData.json"
import MerkleTree from "merkletreejs"
import keccak256 from "keccak256"

import { web3Sign } from '../../utils/web3Sign'
import useIpsTips from '../../hooks/useIpsTips'
import { dayjsTime } from "../../utils/dayjsTime"
 
import coordInit from "../Home/components/coord.js";

export interface itemInfo {iframesrc: string, tokenId: string, cnsCoord: string, cnsname:string,contractAddress:string,bindAddress:string }


export default function MintItem(props:any){
  const ipsTips = useIpsTips()
  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
  const { state: locationState } = useLocation()
  const ipsCoordinateSystem = useIPSCoordinateSystemContract()
  const [isActivationCoord,setIsActivationCoord] = useState(false)

  const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract();
  const ipsCns = useIPSCNSRegisterarControllerContract();

  const navigate = useNavigate()
   
  let tokenId = (locationState as itemInfo)?.tokenId ?? "0"
  let coord = (locationState as itemInfo)?.cnsCoord ?? "[0,0,0]"

  if (props.conetState) {
    tokenId = (props.conetState as itemInfo)?.tokenId ?? "0"
    coord = (props.conetState as itemInfo)?.cnsCoord ?? "[0,0,0]"
  }
   
  // 读取当前tokenid是否已经绑定过坐标
  const getCoordInfo = async () => {
    const infoHash = await ipsCoordinateSystem?.getCoordinate(IPSNftAddress, tokenId)
    if(infoHash){
      if(infoHash.metaverse === ZERO_ADDRESS){
        setIsActivationCoord(false)
      } else {
        setIsActivationCoord(true)
      }
    }
  }

// 检查当前tokenid是否，是当前钱包地址的
const [isUserTokenId, setIsUserTokenId] = useState(true)
 const checkUser = () => {
  if (IPSNFT?.ipsNft) {
    let isTokenIdItem = IPSNFT?.ipsNft.find((item)=>{
       return item.tokenId.toString() === tokenId.toString()
    })
    if (!isTokenIdItem || typeof isTokenIdItem === 'undefined') {
       setIsUserTokenId(false)
    }
  }
 }

 // 获取当前tokenid 的域名
 const [rsCnsName,setRsCnsName] = useState('Unbound CNS Name')
 const [rsCnsTerm,setCnsTerm] = useState('')
 const geTokenIdCnsName = async () => {
  const cnsName = await ipsBaseCoordinateBindContract?.getTokenCNS(IPSNftAddress, tokenId)
  if (cnsName) {
    const cnsTerm = await ipsCns?.nameExpires(cnsName)
    setRsCnsName(cnsName)
    if (cnsTerm) {
      let rstime = dayjsTime(cnsTerm.toString())
      setCnsTerm(rstime)
    }
  }
 }

  const HashCoordInfo = () => {
    const [x, y, z] = JSON.parse(coord)
    const coordHash = [x, y, z, tokenId]
    const coordParams = [x, y, z, tokenId, IPSNftAddress]
    const hash = web3Sign(coordHash)
    return {coordHash, coordParams, hash}
  }


  let merkleTree:any = null
  const formatCoordinateData = () => {
    merkleTree = new MerkleTree(formatedData, keccak256, { sortPairs: true });
  }


  let dispose3d:any = null
  
  useEffect(() => {
     if(coord){
      setTimeout(() => {
        dispose3d = coordInit({domId:'#mact3d_' + tokenId, xyz: JSON.parse(coord), isclear: false})
      }, 120)
     }
     getCoordInfo()
     checkUser()
     geTokenIdCnsName()

     formatCoordinateData()
    
    //  return () => {
    //   if (dispose3d) {
    //     dispose3d.wordDestroy()
    //   }
    //  }
  }, []);

  const formatCoordinate = (level: number, tokenId: number, x: number, y: number, z: number) => {
    var formatRsp = ethers.utils.solidityKeccak256(
      ["uint256", "string", "uint256", "string", "uint256", "string", "uint256", "string", "uint256"],
      [level, "_", tokenId, "_", x, "_", y, "_", z]
    );
    return formatRsp;
  }

  const ActivationCoord = useCallback(
		async () => {
			if (ipsCoordinateSystem && tokenId) {

				try {

          let cinfo:any = HashCoordInfo()
          const {coordParams} = cinfo
          let retokenid:number = parseInt(tokenId)
          let x:number = coordParams[0],y:number = coordParams[1],z:number = coordParams[2];
          const coordinateAfterFormat = formatCoordinate(27, retokenid, x,y,z);
          const proofHexArray = merkleTree.getHexProof(coordinateAfterFormat);
          const info = await ipsCoordinateSystem.createCoordinate(coordParams, retokenid, proofHexArray);
					await info.wait()
					ipsTips(`Create Coord SUCCESS`, { variant: "success" })
          setIsActivationCoord(true)

				} catch (error) {
					ipsTips(`Create Coord ERROR OR Not Your Nft`, { variant: "error" })
          setIsActivationCoord(false)
				}

			}
		},
		[ipsCoordinateSystem, tokenId]
	)

  return (<div className="mintItem mintItemw">
    <div className="nftattrw left">
      <div className="max3dleftbox" id={'mact3d_' + tokenId}></div>
    </div>
    <div className={isActivationCoord ? "nftattrw rigth": "nftattrw rigth noActivation"}>
        <div className="topcoord">Coord #{coord}</div>
        <div className="tokenbox flexbox"><span>TokenID : {tokenId}</span>{(!isActivationCoord && isUserTokenId)?<div onClick={ActivationCoord} className="iconbox"><span className="mr10px"> Activation Coord</span><span><IpsShowico/></span></div>:''}</div>
        <div onClick={()=>{
          // console.dir(rsCnsName)
         if(isActivationCoord && isUserTokenId && rsCnsName === 'Unbound CNS Name'){
          navigate('/cns/bind',{ state: locationState })
         }
         if (rsCnsName!== 'Unbound CNS Name' && rsCnsName) {
           let rehttp = rsCnsName
           if (!/https:\/\//g.test(rsCnsName)) {
            rehttp = 'https://' + rsCnsName + '.ips'
           }
           window.open(rehttp)
         }
        }} className="cnsbox flexbox">
          <span><Cnsicon/></span><span>{rsCnsName}</span><span><Ringrat/></span>
        </div>
        <div className="itembox"><span className="mr10px"><Timeicon/></span><span>CNS EXPIRATION DATE :{rsCnsTerm}</span></div>
    </div>
  </div>)
}