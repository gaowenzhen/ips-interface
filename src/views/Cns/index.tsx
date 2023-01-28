import { useCallback, useContext, useEffect, useState,useLayoutEffect } from "react"

import { dayjsTime } from "../../utils/dayjsTime";
import useIpsTips from "../../hooks/useIpsTips";
import { useIPSCNSRegisterarControllerContract } from "../../hooks/useContract";
import { useNavigate } from "react-router-dom";
import { SearchContextData, SearchContext } from "../../hooks/useSearchContext";
import { ReactComponent as CnsCreticon } from "../../asstes/app/cnscreticon.svg";
import {ReactComponent as Warnignico}  from "../../asstes/app/warning.svg";


export default function Cns() {


	const navigate = useNavigate();
	const searchContextData = useContext<SearchContextData>(SearchContext);
	const [isRenew, setIsRenew] = useState(false);
	let rsCnsName: string = searchContextData?.searchState ?? "";
	const [cnsName, setCnsName] = useState("--");
	 

	const ipsCns = useIPSCNSRegisterarControllerContract();
	const [cnsTime, setCnsTime] = useState(false);
	const ipsTips = useIpsTips();
	const [endTime, setEndTime] = useState("");



	const init = useCallback(async () => {
		if (!rsCnsName) return;
		if (ipsCns && rsCnsName) {
		  const cnsTime = await ipsCns.nameExpires(rsCnsName);
		  if (cnsTime.toString() === "0") {
			setCnsTime(false);
			setIsRenew(true);
			ipsTips(`The current domain ${rsCnsName} is not registered`, {
			  variant: "success",
			  autoHideDuration: 1000,
			});
		  } else {

			let dateRs = dayjsTime(Number(cnsTime));
			const tinfo = `Domain name: ${rsCnsName} Expires on ${dateRs}`;
			ipsTips(tinfo, {
			  variant: "success",
			  autoHideDuration: 1000,
			});
			setEndTime(dateRs);
			setIsRenew(false);
			setCnsTime(true);
		  }
		}
        setCnsName(rsCnsName)
		rsCnsName = ''
	  }, [rsCnsName]);
	
	  useEffect(() => {
		if(!!rsCnsName){
		  init();
		}
	  }, [searchContextData]);

     const openCreate = () => {
		if(!!cnsName && cnsName !== '--'){
			navigate("/cns/details")
		}
	 }
 

	return (
		 <div className="cnsbody">
         {(!!cnsName && cnsName.length < 5 && cnsName !== '--')? <div className="warning">
			<div className="t"><Warnignico/><span>Warning</span></div>
			<div className="c">Name is too short.Names must be at least 5 characters long</div>
		 </div>:<><h2>Names</h2>
          <div className="inputbox">
			<div className={isRenew?'ic albgcolor':'ic unbgcolor'}></div>
			{isRenew?<div className="al"><span>{cnsName}</span><span onClick={openCreate}>Available</span></div>:<div onClick={openCreate} className="un"><span>{cnsName}</span><span>{endTime}  Unavailable</span></div>}
		  </div>
		  <div className="boomtbox"><span><CnsCreticon/></span><span className="c">Search for MNS at the top</span></div>
		 </>}
       
		 </div>
	)
}
