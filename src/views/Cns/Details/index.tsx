import styled from "styled-components";
import { t } from "@lingui/macro";

import { useCallback, useContext, useEffect, useState } from "react";

import Dialog from '@mui/material/Dialog';

import { ReactComponent as Iicons } from "../../../asstes/app/iicon.svg";
import { ReactComponent as CutIcons } from "../../../asstes/app/1icon.svg";
import { ReactComponent as PlusIcons } from "../../../asstes/app/2icon.svg";
import { ReactComponent as WokingIcons } from "../../../asstes/app/woking.svg";
import { ReactComponent as RithIcons } from "../../../asstes/app/rith.svg";

import {
  FlexSBCBox
} from "../../../components/FlexBox";


import useIpsTips from "../../../hooks/useIpsTips";
import { useLocation } from "react-router-dom";
import { useIPSCNSRegisterarControllerContract } from "../../../hooks/useContract";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish, ethers } from "ethers";
import { ipsCnsPayable } from "../../../utils/ipsCnsPayable";
import { SearchContextData, SearchContext } from "../../../hooks/useSearchContext";
import { dayjsTime } from "../../../utils/dayjsTime";

import {ReactComponent as Warnignico}  from "../../../asstes/app/warning.svg";
import CopyBox from "../../../components/CopyBox";
import { IPSNFTContextData, IPSNFTContext } from "../../../hooks/useIPSNft";



interface CnsNftType {
  tokenId: BigNumberish;
  cnsName: string;
  cnsTerm: string;
}

// 外部用到
export const CnsCard = styled(FlexSBCBox)<{
  disabled?: boolean;
  isMobile?: boolean;
}>`
  padding: 16px 20px;
  background: #fff;
  border: 1px solid rgba(112, 110, 255, 0.46);
  border-radius: 6px;
`;

function Cns() {
  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
  // const web3 = new Web3(window.ethereum || RPC_URL);
  const locationState = useLocation();
  const ipsTips = useIpsTips();
  const searchContextData = useContext<SearchContextData>(SearchContext);
  const { account, chainId, library } = useWeb3React<Web3Provider>();

  const [cnsName, setCnsName] = useState("");
  let rsCnsName: string = ""
  //let rsCnsName: string = searchContextData?.searchState ?? "";

  const [rsAccount, setRsAccount] = useState(account || "");

  const ipsCns = useIPSCNSRegisterarControllerContract();
  const [cnsGroup, setCnsGroup] = useState(0);
  const [cnsStatus, setCnsStatus] = useState(false);
  // const [CnsGroupList] = useState([t`Register`, t`Details`, t`Subdomains`]);
  const [CnsGroupList,setCnsGroupList] = useState([{txt: 'Register',id:'1',isSel: true}, {txt: 'Details',id:'2',isSel: false}, {txt: 'Subdomains',id:'3',isSel: false}]);
  const [tabId,setTabId] = useState('1');
  const [cnsTerm, setCnsTerm] = useState(1);
  const [price, setPrice] = useState("--");
  const [cnsTime, setCnsTime] = useState(false);
  const [cnsNftLen, setCnsNftLen] = useState(0);
  const [isData, setIsData] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [hash, setHash] = useState("");
  const [endTime, setEndTime] = useState("");
  const [futureTime,setFutureTime] = useState("");
  const [isExtend, setIsExtend] = useState(false);
  const [isBalance,setIsBalance]= useState(false);


  //###
  useEffect(() => {

    rsCnsName = searchContextData?.searchState ?? "";
    if (rsCnsName && typeof rsCnsName !== "undefined") {
      setIsRegister(true);
      setCnsName(rsCnsName || "");
    }

  }, [searchContextData]);

  useEffect(() => {
    if (locationState.state) {
      rsCnsName = (locationState.state as CnsNftType)?.cnsName ?? "";
    }
    if(rsCnsName){
      setCnsName(rsCnsName || "");
    }
  }, [locationState]);

  const register = useCallback(async () => {
    if (price === "--" || !price || typeof price === "undefined") {
      ipsTips("wait for the price", {
        variant: "warning",
      });
      return;
    }

    if (!isRegister) {
      if (!!cnsName) {
        setIsRegister(true);
        let reCnsTerm = cnsTerm * 12;
        ipsCnsPayable(
          { account, chainId },
          { cnsName, cnsTerm: reCnsTerm, isRenew }
        )
          .then((transaction: any) => {
            if (transaction && transaction.status) {
              ipsTips(isRenew ? t`Renew CNS SUCCESS` : t`Bind CNS SUCCESS`, {
                variant: "success",
                autoHideDuration: 3000,
              });
              setHash(new Date().getTime().toString());
              setIsRegister(false);
            }
            handleClose()
          })
          .catch((err: any) => {
            let etxt = err.message;
            ipsTips(
              isRenew
                ? `Renew CNS ERROR,${etxt}`
                : `Register CNS ERROR,${etxt}`,
              {
                variant: "error",
                autoHideDuration: 3000,
              }
            );
            setIsRegister(false);
            handleClose()
          });
      } else {
        ipsTips(`CNS name cannot be empty`, { variant: "error" });
      }
    } else {
      return false;
    }
  }, [account, chainId, cnsName, cnsTerm, isRenew, price, isRegister]);

  const cnsPrice = useCallback(async () => {
    if (!!ipsCns && !!cnsName) {
      const MIN_PRICE = cnsTerm * 0.001;
      let price = 0;
      if (cnsName.length === 3) {
        price = MIN_PRICE * 16;
      } else if (cnsName.length === 4) {
        price = MIN_PRICE * 4;
      } else {
        price = MIN_PRICE;
      }
      price = price * 12;
      let rsprice = price.toFixed(4).toString() || "0"
      setPrice(rsprice);
      setIsRegister(false);
      checkubalance(rsprice)
      getNewfutrData(endTime)
    }
  }, [cnsTerm, ipsCns, cnsName, library, endTime, rsAccount]);

  const checkubalance = (rsprice:any) => {
    if(IPSNFT){
      let ubalance = IPSNFT?.userBalance?.toString() || "0"
      if(parseFloat(rsprice) < parseFloat(ubalance)){
        setIsBalance(true)
      }
    }
  }

  useEffect(() => {
    if ((cnsStatus && cnsStatus) || (isExtend && cnsGroup === 2))
      cnsPrice();
  }, [isExtend, cnsStatus, cnsTerm, cnsName,IPSNFT]);

  const init = useCallback(async () => {
    if (!cnsName) return;
    if (ipsCns && cnsName) {
      const cnsTime = await ipsCns.nameExpires(cnsName);
      if (cnsTime.toString() === "0") {
        setCnsTime(false);
        setIsRenew(false);
        ipsTips(`The current domain ${cnsName} is not registered`, {
          variant: "success",
          autoHideDuration: 1000,
        });
      } else {
        let dateRs = dayjsTime(Number(cnsTime));
        const tinfo = `Domain name: ${cnsName} Expires on ${dateRs}`;
        ipsTips(tinfo, {
          variant: "success",
          autoHideDuration: 1000,
        });
        setEndTime(dateRs);
        getNewfutrData(dateRs)
        setIsRenew(true);
        setCnsTime(true);
      }
      setCnsStatus(true)
    }

  }, [ipsCns, cnsName]);

  const getNewfutrData = (dateRs:string) => {
    let newdateset = dateRs.replace(/(^\d{4})-?.*/,"$1")
    let newyary = parseInt(newdateset) + cnsTerm
    let newdateRs = newyary.toString() + dateRs.replace(/^\d{4}(-?.*)/,"$1")
    setFutureTime(newdateRs)
  }

  useEffect(() => {
    init();
  }, [hash, cnsName]);

  const setCnsMsgBtn = (item:any) =>{
    let copygrlist = JSON.parse(JSON.stringify(CnsGroupList))
    for (let r = 0; r < copygrlist.length; r++) {
      let reitem = copygrlist[r];
      reitem.isSel = false
      if(reitem.id === item.id){
        reitem.isSel = true
        setTabId(item.id)
      } 
    }
    setCnsGroupList(copygrlist)
  }

  const [isInputVal,setIsInputVal] = useState(false)
  const subInputChange = (e:any) => {
   let text = e.target.value.trim()
   if(text && text.length > 1){
    setIsInputVal(true)
   } else{
    setIsInputVal(false)
   }
  }

  const getTabId1 = (isopen?:boolean) => {
    if (tabId === '1' && !isRenew || isopen)
    return <>
    <div className="t">
      <span><Iicons/>Increase registration period to avoid gas every year.</span>
    </div>
    <div className="addyarnbox">
      <div className="iitem">
        <div className="ibox a">
        <span onClick={() => {
              if (cnsTerm !== 1) {
                setCnsTerm(cnsTerm - 1);
              }
            }}><CutIcons/></span>
        <span className="y">{cnsTerm} year</span>
        <span onClick={() => {
              setCnsTerm(cnsTerm + 1);
            }}><PlusIcons/></span>
        </div>
        <div className="txt">Registration Period</div>
      </div>
      <div className="iitem">
      <div className="ibox b">
        <span className="y">{price} ETH</span>
       </div>
       <div className="txt">Registration price to pay</div>
      </div>
    </div>
    <div className="boomtbox">
      <div className="a">
      {price} ETH + at most 0.001 ETH gas fee = at most 0.003 ETH
      </div>
      <div className="txt">Estimated Total (Price + Gas). The gas price is based at 3 Gwei</div>
      </div>
      {
      !isopen?<>
      {isBalance?<div className="btnbox"><span></span><div className="btn" onClick={register}>Request To Register</div></div>:<div className="btnbox noregister"><span><Iicons/>Insufficient balance on your wallet. Fill in your wallet and reload the page.</span><div className="btn">Request To Register</div></div>}
      </>:null
      }
     </>
     return null;
  }

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };

  const [isInputBox,setIsInputBox]= useState(false)

  const [isRegInputBox,setIsRegInputBox] = useState(false);
  const [isConInputBox,setIsConInputBox] = useState(false);

  return (
    <div className="cnsbody">
       {(!!cnsName && cnsName.length < 5 && cnsName !== '--')?<div className="warning">
			<div className="t"><Warnignico/><span>Warning</span></div>
			<div className="c">Name is too short.Names must be at least 5 characters long</div>
		 </div>:<h2>Names</h2>
     }
     {(!!cnsName && cnsName.length >= 5)?<div className={!!isRenew?'inputbox Renewbgcolor':'inputbox bralbgcolor'}>
        <div className="cnsconfigbox">
          <div className="cnsconfbody">
            <div className="top">
              <div className="l">
              <CopyBox
              textStyle={{ color: isRenew ? "#7C7AA2" : "#888888"}}
              text={cnsName}
            />
              </div>
              <div className="r">
                <div className="cnsbtngroup">
                  {CnsGroupList.map((ritem) => {
                    return <div onClick={()=>{ if(!ritem.isSel)setCnsMsgBtn(ritem)}} key={ritem.id} className={ritem.isSel? 'setbg': ''}>{ritem.txt}</div>
                  })}
                </div>
              </div>
            </div>

          {
            getTabId1()
          }
          {
            (tabId === '1' && !!isRenew)?<div className="onregister">This name is already registered</div>:null
          }


          {
            (tabId === '2' && !isRenew)?<div className="detailsBody">
              <div className="deitem"><div className="mobilern"><span>PARENT</span><span className="ml30">ips</span></div></div>
              <div className="deitem"><div className="mobilern"><span>REGISTRANT</span><span className="ml30">0x0</span></div></div>
              <div className="deitem"><div className="mobilern"><span>CONTROLLER</span><span className="ml30">Not owened</span></div><div><span className="deibtn">Set</span></div></div>
            </div>:null
          }
          {
            (tabId === '2' && !!isRenew)?<div className="detailsBody">
              <div className="deitem"><div className="mobilern"><span>PARENT</span><span className="ml30">ips</span></div></div>
              <div className="deitem"><div className="mobilern"><span>REGISTRANT</span><span className="ml30">0x0</span></div><div className={isRegInputBox?'rbtnbox heibtn':'rbtnbox'}><span className="deibtn btnaction" onClick={()=>{setIsRegInputBox(true)}}>Transfer</span></div></div>

              {
              !!isRegInputBox?<div className="addinputbox mobilebootm">
                <div className="l"><input placeholder="Enter Ethereum name or address" type="text" /></div>
                <div className="r">
                  <span className="deibtn" onClick={()=>{setIsRegInputBox(false)}}>Cancel</span>
                  <span className={isInputVal?'deibtn btnaction':'deibtn'}>Transfer</span>
                </div>
                </div>:null
              }


              <div className="deitem"><div className="mobilern"><span>CONTROLLER</span><span className="ml30">{rsAccount}</span></div><div className={isConInputBox?'rbtnbox heibtn':'rbtnbox'}><span className="deibtn btnaction" onClick={()=>{setIsConInputBox(true)}}>Set</span></div></div>
              {
              !!isConInputBox?<div className="addinputbox mobilebootm">
                <div className="l"><input placeholder="Enter Ethereum name or address" type="text" /></div>
                <div className="r">
                  <span className="deibtn" onClick={()=>{setIsConInputBox(false)}}>Cancel</span>
                  <span className={isInputVal?'deibtn btnaction':'deibtn'}>Transfer</span>
                </div>
                </div>:null
              }


              {!!isExtend?<><div className="deitem">
              <div className="mobilern"><span>EXPIRATION DATE</span><span>{endTime}</span></div>
              </div>
              {getTabId1(true)}
              <div className="boombtnbox">
                  <div>
                <span className="extbtntxt">*Extending the registration of a name you do not own does not give you ownership of it.</span>
                </div>
                <div className="textr">
                <span onClick={() => {
                      setIsExtend(false);
                    }} className="deibtn">Cancel</span>
                <span onClick={handleClickOpen} className="deibtn btnaction">Extend</span>
                </div>
              </div>
              </>:<div className="deitem"><div className="mobilern"><span>EXPIRATION DATE</span><span>{endTime}</span></div><div onClick={() => {
                      setIsExtend(true);
                    }}><span className="deibtn btnaction">Extend</span></div></div>}

        <Dialog open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
         <div className="dialogbody">
          <div className="topwoking">
            <span><WokingIcons/>Are you sure you want to do this </span>
            <span>This action will modify the state of the biockchain.</span>
          </div>
          <div className="dialogconet">
           <div>PREVIOUS  {endTime}</div>
           <div>FUTURE  {futureTime}</div>
          </div>
          <div className="dialogboomtbox">
            <span onClick={handleClose} className="deibtn">Cancel</span>
            <span onClick={register} className="deibtn btnaction">Confirm</span>
          </div>
         </div>
        </Dialog>
            </div>:null
        }


          {
            (tabId === '3' && !isRenew)?<div><span className="nodata">No Subdomains have been added</span></div>:null
          }
          { (tabId === '3' && !!isRenew)?<div>
              {
              !isInputBox?<div className="addbtnbox">
                <span onClick={()=>{setIsInputBox(true)}} className="deibtn btnaction">+ Add Subdomain</span>
                </div>: null
              }
              {
              !!isInputBox?<div className="addinputbox">
                <div className="l"><input onChange={subInputChange} placeholder="Enter Ethereum name or address" type="text" /><span className="rigthicon">{!!isInputVal?<RithIcons/>:null}</span></div>
                <div className="r">
                  <span className="deibtn" onClick={()=>{setIsInputBox(false);setIsInputVal(false)}}>Cancel</span>
                  <span className={isInputVal?'deibtn btnaction':'deibtn'}>Save</span>
                </div>
                </div>:null
              }
          
              <span className="nodata">No Subdomains have been added</span>
              </div>:null
           }

          </div>
        </div>
      </div>:null}
    </div>
  );
}

export default Cns;
