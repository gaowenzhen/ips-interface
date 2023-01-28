import { useEffect, useState,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "@lingui/macro";
import styled from "styled-components"
import {langMenu} from "../../components/Header/popmeun";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";


import { FlexCCBox, FlexSBCBox } from "../../components/FlexBox";
import useMenuList from "../../hooks/useMenuList";

// import { MOBILEContextData,MOBILEContext} from "../../hooks/useMOBILEContext";
import useMediaQuery from "@mui/material/useMediaQuery";
// import {clearEvent} from "../../utils/checkdev.js";

const LeftMenuMain = styled.div<{ isMobile?: boolean, IsShow?: boolean}>`
	position: fixed;
	top: 60px;
	left: ${({ isMobile }) => (isMobile ? "0;" : "auto")};
	right:${({ isMobile }) => (isMobile ? "auto" : "0")};
	margin-top:${({ isMobile }) => (isMobile ? "100px;" : "0px;")};
	width: ${({ isMobile }) => (isMobile ? "350px;" : "100%")};
	padding:${({ isMobile }) => (isMobile ? "80px 20px 0;" : "50px 20px 0;")};
	z-index:${({ isMobile }) => (isMobile ? "0;" : "1200;")};
	height:${({ isMobile }) => (isMobile ? "auto" : "calc(100% - 60px);")};
	background-color: ${({ isMobile }) => (isMobile ? "#fff" : "#f6f6f6;")};
	overflow-y:auto;
	display: ${({ IsShow,isMobile }) => ((IsShow && !isMobile) || isMobile ? "" : "none;")};
`
 
const Item = styled(FlexSBCBox)`
	padding: 12px 0;
	cursor: pointer;
`

export default  function LeftMenu({btnState}:{btnState?:boolean}){
	
	const ismobile = useMediaQuery("(min-width:980px)");
	// const mobileContextData = useContext<MOBILEContextData>(MOBILEContext);

	const { account } = useWeb3React<Web3Provider>();
	 
	const menuList = useMenuList()
	const navigate = useNavigate()
	const locationParams = useLocation()
	const [state, setState] = useState(menuList[0].url)
    
	const [meunlists, setMeunLists] = useState(menuList)
	 

	const reListArrt = (index:any) => {
		let copylist = meunlists.concat([])
		let itemShow = copylist[index].isShowsub
		copylist[index].isShowsub = !itemShow
		setMeunLists(copylist)
	}


	const renadItem = (item:any) => {
       
		if (item.id === 'MyWallet' && window.popItemUi) {
			return !account?<div className="itemSubBody">{ t`Login to wallet` }</div>:<div className={item.isShowsub? 'itemshowbox':'itemh'} dangerouslySetInnerHTML={{ __html: window.popItemUi }}></div>
		}
		if (item.id === 'Lang') {
			let lanmenu = langMenu();
			return <div className="itemSubBody" dangerouslySetInnerHTML={{ __html: lanmenu}}></div>
		}
	}

	return (
		<LeftMenuMain isMobile={ismobile} IsShow={btnState}>
			{meunlists.map((item,idx) => <Item key={idx} onClick={() => {
                // clearEvent()
				if(!!item.url){
					window.setMeunBtn()
					setState(item.url)
					navigate(item.url)
				} else {
					setState(idx + '')
					reListArrt(idx)
				}
				
			}}>
				<div className="leftMeunItem">
				  <div><span><img src={item.Icons}/></span><span>{item.text}</span></div>
                  {
					(!!item.url)? '': renadItem(item)
				  }
				</div>
			</Item>)}
			{!account? <div dangerouslySetInnerHTML={{ __html: window.popItemUi }}></div>: null }
		</LeftMenuMain>
	)
}
