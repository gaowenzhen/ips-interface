import React, { useEffect, useContext, useState, useCallback } from "react";
import { selectLocale } from "../../locales";
import { useNavigate, useLocation } from "react-router-dom";
import { t } from "@lingui/macro"
import Web3 from "web3";
import { ethers } from "ethers";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";

import Modal from "@mui/material/Modal";


import { ReactComponent as WallClosIcons } from "../../asstes/app/wallclos.svg";
import { ReactComponent as FortunaticIcons } from "../../asstes/app/Fortunatic.svg";
import CoinbaseWallet from "../../asstes/app/CoinbaseWallet.png";
import WalletConnect from "../../asstes/app/WalletConnect.png";
import { ReactComponent as MetamaskIcons } from "../../asstes/app/metamask-fox.svg";
 

import { SearchContextData, SearchContext } from "../../hooks/useSearchContext";
import { IPSNFTContextData, IPSNFTContext } from "../../hooks/useIPSNft";
import { MOBILEContextData,MOBILEContext} from "../../hooks/useMOBILEContext";
import {PopItems,langMenu} from "./popmeun";
import { useIPSBaseCoordinateBindContract } from "../../hooks/useContract";


import { WALLET_CONNECT } from "../../constants";
import useIpsTips from "../../hooks/useIpsTips";

import { tryConnect } from "../../utils/ethers/tryConnect"

var cleartime:any = ""
function Header({ Callback }: { Callback?: any }) {

  const ipsTips = useIpsTips();

  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
  const [topNewid,setTopNewid] = useState(new Date().toString())
  const mobileContextData = useContext<MOBILEContextData>(MOBILEContext);
  const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract()
  
  const { account, library, activate, deactivate } = useWeb3React<Web3Provider>();

  const navigate = useNavigate();

  const getPopBox = () => {
    let dEFVRZ: Element | null = document.querySelector("#upopbox");
    let langbox: Element | null = document.querySelector("#langbox");
    return {dEFVRZ,langbox}
  }

  const clearpup = () => {
    let {dEFVRZ,langbox} = getPopBox()
    if (dEFVRZ?.className === "bBmPMw") {
      dEFVRZ.className = "jcrsQt";
    }

    if (langbox?.className === "bBmPMw") {
      langbox.className = "jcrsQt";
    }
  };

  const showpop = (event: any, elid: string) => {
    if ((event && !elid) || typeof elid === "undefined") {
      clearpup();
    } else {
      let upopbox: Element | null;
      upopbox = document.querySelector(elid);
      if (upopbox && !event) {
        let cn = upopbox.className;
        upopbox.className = cn === "bBmPMw" || !cn ? "jcrsQt" : "bBmPMw";
        return;
      }
    }
  };

  const getScrollTop = () => {
    let scrollTop = 0;

    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }

    return scrollTop;
  };

  const topMunEl = () => {
    let topnavbox: Element | null = document.querySelector("#topnavbox");
    let topinput: Element | null = document.querySelector("#topinput");
    let kQHrWFbtn: Element | null = document.querySelector(".kQHrWF");
    return { topnavbox, topinput, kQHrWFbtn };
  };

  let topiconcolor = '#ffffff'
  const pupScroll = () => {

    let ishome = (location.pathname === "home" || location.pathname === "/");
    if (!ishome) {
      return;
    }

    let stopv = getScrollTop();
    let { topnavbox, topinput } = topMunEl();
    if(topinput?.className === 'jxZNDP' && stopv > 70){
      return
    }

    clearpup();
    if (topnavbox && topinput) {
      if (stopv === 0) {
        topnavbox.className = "ksvObg";
        topinput.className = "jwPKK";
      }
      if (stopv > 68) {
        topnavbox.className = "gTNKWJ";
        topinput.className = "jxZNDP";
      }
    }
    // setIsReTopm(new Date().getTime());
  };

  // 发起搜索
  const searchContextData = useContext<SearchContextData>(SearchContext);
  const locationState = useLocation();

  const checkCoordiNate = async (inputval:any) => {
    const cnsCoord = await ipsBaseCoordinateBindContract?.nameCoordinate(inputval);
    console.dir(cnsCoord)
  }

  const updateSearchData = (inputval: any) => {
     
    let kTswBbMobile = document.querySelector(".kTswBbMobile");
    let rel = kTswBbMobile?.getAttribute('rel')
    if(rel === '1'){
      setMeunBtn(false)
    }

    if (inputval) {
      if (searchContextData) {
        searchContextData?.setSearchState(inputval);
      }
      let pathname = locationState.pathname
      if (pathname === "/" && inputval && ipsBaseCoordinateBindContract) {
         checkCoordiNate(inputval)
         return
      }


      if (pathname === "/cns") {
        //clearEvent()
        //console.dir(inputval)
        // navigate("/cns", { state: null });
        // navigate("/cns/details", { state: inputval });
      }
      
      if (pathname === "/details") {
        //clearEvent()
        navigate("/cns/details", { state: null });
      }

      if (Callback as Function) {
        Callback();
      }
    }
  };

  // 选中语言
  const lanMeunClick = (e: any) => {
    let lenrs = e.target.getAttribute('rel')
    if(lenrs){
      selectLocale(lenrs)
    }
  };

  const [isWalletModal, setIsWalletModal] = useState(false);
  const closeModal = () => {
    setIsWalletModal(false)
  }



  // 输出头部菜单，有个渲染问题，需要改进不用等钱包链接就显示
  const [topMeun, setTopMeun] = useState("");
  const [userBalance,setUserBalance] = useState("0")
  const [isReTopm,setIsReTopm]= useState(0)

  let btnclos = '<svg width="19" height="19" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.5668 12.2184L13.5672 12.2188C13.9424 12.5915 13.942 13.195 13.5679 13.5716C13.3827 13.7581 13.1389 13.85 12.8935 13.85C12.6502 13.85 12.4058 13.7571 12.2184 13.571C12.2183 13.571 12.2183 13.5709 12.2182 13.5709L7.10578 8.45941L6.99972 8.35337L6.89367 8.45941L1.78086 13.5712L1.78048 13.5716C1.59536 13.758 1.34867 13.85 1.106 13.85C0.863478 13.85 0.616736 13.7581 0.430033 13.5701L0.429854 13.5699C0.0564006 13.1952 0.0566598 12.5902 0.430966 12.2171L0.431132 12.217L5.54247 7.10663L5.64855 7.00057L5.54248 6.89449L0.43262 1.78416C0.0579056 1.40941 0.0581025 0.802956 0.429671 0.429881C0.804536 0.0564475 1.4093 0.057027 1.78066 0.429696L1.78086 0.429893L6.89367 5.5417L6.99972 5.64774L7.10578 5.5417L12.2186 0.429893L12.2188 0.429696C12.5903 0.0568683 13.1965 0.0566071 13.5698 0.429878C13.9441 0.804269 13.9432 1.40777 13.5683 1.78268L8.45696 6.89449L8.35093 7.00054L8.45695 7.1066L13.5668 12.2184ZM12.1125 0.323817L6.99972 5.43562L12.1125 0.323817Z" fill="#7A77A4" stroke="white" stroke-width="0.3"/></svg>'
  let mobilemeunbtnicon = '<svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 13H19V11.1429H0V13ZM0 1.85714H19V0H0V1.85714ZM0 7.42857H19V5.57143H0V7.42857Z" fill="#7A77A4"/></svg>'
 
  const reTopMunUi =  () => {

    let lanmenu = langMenu();
    let linkMkLcon = "/static/images/mklcon.svg";
    const connectionType = library?.connection.url;

    switch (connectionType) {
      case "metamask":
        linkMkLcon = "/static/images/metamask-fox.svg";
        break;
      case "PUBLICMINT":
        linkMkLcon = "";
        break;
      default:
        break;
    }

    // 头部右边点开菜单
    let toprmeun = ''
    toprmeun = window.popItemUi = PopItems(account,userBalance)

    let color = '#000'
  
    let spacers = t`SPACE`
    let Docsrs = t`Docs`
    let CNSrs = t`CNS`
    
	// 不能换行
    let topMunItem = "";
    let rTextItems = '<div class="kTswBb"><div style="margin-right:20px" class=" iSfocU"><a href="/spaceNFT" class="krXwdd"><span class="kYqUly">'+spacers+'</span></a><a href="/cns" class="krXwdd zbhps"><span class="kYqUly">'+CNSrs+'</span></a><a href="/c/" class="krXwdd zbhps"><span class="kYqUly">'+Docsrs+'</span></a><a id="languibtn" class="krXwdd zbhps"><svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0H7.99231H7.98077C3.56923 0.0115385 4.18788e-10 3.58846 0 8C-4.18787e-10 12.4115 3.56923 15.9885 7.98077 16H8C12.4192 16 16 12.4192 16 8C16 3.58077 12.4192 0 8 0ZM8 15.3615H7.99231H7.98077C3.92692 15.35 0.638461 12.0577 0.638461 8C0.638461 3.94231 3.92308 0.65 7.98077 0.642308H8C12.0654 0.642308 15.3615 3.93846 15.3615 8.00385C15.3615 12.0654 12.0654 15.3615 8 15.3615Z" fill="'+topiconcolor+'"/><path d="M10.5687 4.71936C9.84409 4.89478 9.09626 5.00003 8.32518 5.02342V7.6781H10.9445C10.9213 6.5827 10.7857 5.58866 10.5687 4.71936ZM8.32131 1.23827V4.43089C9.03814 4.4075 9.7356 4.31395 10.4059 4.15022C9.89834 2.53637 9.10788 1.47606 8.32131 1.23827ZM5.57409 4.14633C6.25218 4.31005 6.95351 4.4075 7.67422 4.43089V1.23047C6.88764 1.46046 6.08556 2.52077 5.57409 4.14633ZM12.8277 3.22245C11.952 2.32586 10.8322 1.67097 9.57673 1.3708C10.1502 1.96723 10.6307 2.87941 10.9755 3.9943C11.6226 3.79549 12.2426 3.53821 12.8277 3.22245ZM11.5374 7.6781H14.7651C14.6953 6.16559 14.1335 4.77783 13.2345 3.67854C12.5719 4.04497 11.8706 4.34513 11.1383 4.56733C11.3746 5.5029 11.5141 6.55931 11.5374 7.6781ZM5.0355 7.6781H7.67809V5.02342C6.89926 5.00003 6.14368 4.89478 5.41523 4.71546C5.19436 5.58476 5.05875 6.5827 5.0355 7.6781ZM10.9445 8.3252H8.32131V10.976C9.09239 10.9994 9.84409 11.1007 10.5687 11.28C10.7857 10.4146 10.9213 9.4167 10.9445 8.3252ZM5.41523 11.2839C6.14368 11.1046 6.89926 10.9994 7.67809 10.976V8.3252H5.0355C5.05875 9.42059 5.19436 10.4185 5.41523 11.2839ZM7.67809 14.7689V11.5685C6.95739 11.5919 6.25218 11.6893 5.57409 11.8531C6.08556 13.4786 6.88764 14.5428 7.67809 14.7689ZM9.57673 14.6325C10.8322 14.3284 11.952 13.6774 12.8315 12.7769C12.2465 12.4612 11.6265 12.2039 10.9794 12.0051C10.6345 13.1239 10.1502 14.0322 9.57673 14.6325ZM6.39942 1.3786C5.15561 1.68266 4.04355 2.33366 3.17173 3.22635C3.75295 3.53821 4.36516 3.79549 5.0045 3.9904C5.34935 2.87941 5.82983 1.97503 6.39942 1.3786ZM11.1383 11.436C11.8745 11.6582 12.5758 11.9583 13.2384 12.3248C14.1373 11.2255 14.6992 9.8377 14.7689 8.3252H11.5412C11.5141 9.44398 11.3746 10.4965 11.1383 11.436ZM8.32131 11.5685V14.765C9.10788 14.5272 9.89834 13.4669 10.4059 11.8492C9.7356 11.6855 9.03814 11.5919 8.32131 11.5685ZM4.84563 4.56343C4.11718 4.34124 3.41972 4.04497 2.76488 3.67854C1.86593 4.77783 1.30409 6.16559 1.23434 7.6781H4.44653C4.46591 6.55541 4.60927 5.499 4.84563 4.56343ZM4.44266 8.3252H1.23047C1.30021 9.8377 1.86206 11.2255 2.761 12.3248C3.41584 11.9622 4.1133 11.6621 4.84176 11.4399C4.60927 10.5043 4.46591 9.44788 4.44266 8.3252ZM3.16786 12.7769C4.03968 13.6696 5.15174 14.3206 6.39942 14.6247C5.82983 14.0283 5.34935 13.12 5.0045 12.009C4.36516 12.2078 3.74907 12.4651 3.16786 12.7769Z" fill="'+topiconcolor+'"/></svg><span class="kYqUly"><svg width="10" height="9" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.49495 0.0515509L1.30435 0.0515509C0.885995 0.0515509 0.649627 0.52557 0.904825 0.852833L2.50015 2.89867C2.70196 3.15747 3.09733 3.15747 3.29914 2.89867L4.89441 0.852833C5.14961 0.525565 4.9133 0.0515509 4.49495 0.0515509Z" fill="'+topiconcolor+'" /></svg></span><div aria-disabled="false" id="langbox" class="jcrsQt">    <div class=" gtnSef">        <div class="dWITPl fFAsnw"></div> <div class="dWITPl fFAsnw"><div class="iLDdPW">' +
      lanmenu + '</div></div></div></div></a></div><div class="eTCCS"><div class="dYtCQC"><button class="dEFVRZ iokAZm"><svg width="14" height="14" viewBox="0 0 12 12" fill="none"  xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#hamburgerClip)"><path d="M11 9H1C0.734784 9 0.48043 9.10536 0.292893 9.29289C0.105357 9.48043 0 9.73478 0 10C0 10.2652 0.105357 10.5196 0.292893 10.7071C0.48043 10.8946 0.734784 11 1 11H11C11.2652 11 11.5196 10.8946 11.7071 10.7071C11.8946 10.5196 12 10.2652 12 10C12 9.73478 11.8946 9.48043 11.7071 9.29289C11.5196 9.10536 11.2652 9 11 9Z"  fill="#7474BA"></path><path  d="M11 1H1C0.734784 1 0.48043 1.10536 0.292893 1.29289C0.105357 1.48043 0 1.73478 0 2C0 2.26522 0.105357 2.51957 0.292893 2.70711C0.48043 2.89464 0.734784 3 1 3H11C11.2652 3 11.5196 2.89464 11.7071 2.70711C11.8946 2.51957 12 2.26522 12 2C12 1.73478 11.8946 1.48043 11.7071 1.29289C11.5196 1.10536 11.2652 1 11 1Z" fill="#7474BA"></path><path d="M11 5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H11C11.2652 7 11.5196 6.89464 11.7071 6.70711C11.8946 6.51957 12 6.26522 12 6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5Z" fill="#7474BA"></path></g><defs><clipPath id="hamburgerClip"><rect width="14" height="14" fill="#7474BA"></rect></clipPath></defs></svg><div class="cmbyrb"><img src="' +
      linkMkLcon +
      '"/></div></button></div><div aria-disabled="false" id="upopbox" class="jcrsQt">'+ toprmeun +'</div></div></div>';

    let rinputItem =
      '<div style="overflow-y:visible" class="kRmVXS"><div style="justify-content:center" class="isSquF"><div style="opacity:1;transform:none"  class="efxEZA gfGaun"><div aria-haspopup="listbox" aria-owns="listbox--1" aria-expanded="false" class="HeaderSearchCombobox__StyledCombobox-sc-1qnp1c2-0 gMYApx" data-reach-combobox="" role="combobox"><div class=" eZuBhR"><div class=" lhaqYV"><div class="kQHrWF"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 13 13"><g fill="'+color+'" clip-path="url(#clip0)"><path d="M5.73 11.313a5.535 5.535 0 01-5.529-5.53A5.535 5.535 0 015.731.256c3.048 0 5.528 2.48 5.528 5.529a5.535 5.535 0 01-5.529 5.529zm0-9.479a3.954 3.954 0 00-3.95 3.95 3.954 3.954 0 003.95 3.949 3.954 3.954 0 003.95-3.95 3.954 3.954 0 00-3.95-3.949zM12.608 11.544l-1.89-1.89c-.325.418-.7.792-1.117 1.117l1.89 1.89a.788.788 0 001.117 0 .79.79 0 000-1.117z"></path></g><defs><clipPath id="clip0"><path fill="#fff" d="M.201.255H12.84v12.638H.201V.255z"></path></clipPath></defs></svg></div><div class=" bOALFv"></div><input id="topinput"  placeholder="Search by space nft or cns..."   class="jwPKK" value="" /><div class=" evJGmq"></div></div></div></div></div></div><div class=" dfEcWx"></div></div><div class=" dpVide"></div>';

    // 移动版
    if (window?.mobileCheck()) {
      topMunItem =
        '<div class="topMunSearch"><div style="justify-content:center" class="isSquFMobile"><div class=" eZuBhR"><div class=" lhaqYV"><div class="kQHrWF"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 13 13"><g fill="'+color+'" clip-path="url(#clip0)"><path d="M5.73 11.313a5.535 5.535 0 01-5.529-5.53A5.535 5.535 0 015.731.256c3.048 0 5.528 2.48 5.528 5.529a5.535 5.535 0 01-5.529 5.529zm0-9.479a3.954 3.954 0 00-3.95 3.95 3.954 3.954 0 003.95 3.949 3.954 3.954 0 003.95-3.95 3.954 3.954 0 00-3.95-3.949zM12.608 11.544l-1.89-1.89c-.325.418-.7.792-1.117 1.117l1.89 1.89a.788.788 0 001.117 0 .79.79 0 000-1.117z"></path></g><defs><clipPath id="clip0"><path fill="#fff" d="M.201.255H12.84v12.638H.201V.255z"></path></clipPath></defs></svg></div><div class=" bOALFv"></div><input id="topinput" placeholder="Search by space nft or cns..." class="jwPKK" value=""><div class=" evJGmq"></div></div></div></div></div><div style="justify-content:center" class="kTswBbMobile">'+ mobilemeunbtnicon +'</div>';
    } else {
      topMunItem = rinputItem + rTextItems;
    }

    const topReHtml = '<div id="topnavbox" class="ksvObg"><div class="loFzOT"><nav class="gSkwlV kQYcPP"><div class="jKqRar"><a href="/"><div class="bIlqRi"><div class="HeaderLinkSection__Child-sc-1ywcepv-0 hwczam"><div style="display:inline-block;max-width:100%;overflow:hidden;position:relative;box-sizing:border-box;margin:0"><div style="box-sizing:border-box;display:block;max-width:100%"><img style="max-width:100%;display:block;margin:0;border:none;padding:0" alt="" aria-hidden="true" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIi8+"></div><img alt="Matcha avatar" src="/static/images/Group146.png" decoding="async" data-nimg="true"  style="position:absolute;top:0;left:0;bottom:0;right:0;box-sizing:border-box;padding:0;border:none;margin:auto;display:block;width:0;height:0;min-width:100%;max-width:100%;min-height:100%;max-height:100%"></div></div><div class="hwczam"><span class="krXwdd rekrXwdd">IPS</span></div></div></a></div>' + topMunItem + "</nav></div></div>";
    
    const rendid = Math.random().toString()
    setTopNewid(rendid)
    setTopMeun(topReHtml);

    if(!!cleartime){
       clearEvent()
       clearTimeout(cleartime)
    }
    
    cleartime = setTimeout(() => {

     // console.dir('---事件--:'+ rendid)

      document.addEventListener("click", (e:any) => {
        showpop(e, "");
      });

      let dEFVRZ: Element | null = document.querySelector(".dEFVRZ");
      let languibtn: Element | null = document.querySelector("#languibtn");

      // langbox languibtn
      languibtn?.addEventListener("click", (e: any) => {
        e.stopPropagation();
        clearpup();
        showpop(null, "#langbox");
        
      });
   
     
      dEFVRZ?.addEventListener("click", (e: any) => {
        e.stopPropagation();
     
        clearpup();
        showpop(null, "#upopbox");

      });
      
      document.addEventListener("scroll", pupScroll);

      let lanmun: NodeListOf<Element> | null = document.querySelectorAll(".lanmun");
      if (lanmun) {
        lanmun.forEach((el: Element) => {
          el.addEventListener("click", lanMeunClick);
        });
      }

      let { topnavbox, topinput, kQHrWFbtn } = topMunEl();
      let ishome = (location.pathname === "home" || location.pathname === "/");
      if (!ishome && topnavbox && topinput) {
        topnavbox.className = "gTNKWJ";
        topinput.className = "jxZNDP";
      }

      if (topinput && kQHrWFbtn) {
        let inputval = "";
        topinput?.removeEventListener("click", () => {});
        topinput.addEventListener(
          "keyup",
          (e: any) => {
            inputval = e.target.value.trim();
            if (e.key === "Enter") {
              updateSearchData(inputval);
            }
          },
          false
        );
        kQHrWFbtn?.removeEventListener("click", () => {});
        kQHrWFbtn.addEventListener(
          "click",
          (e: any) => {
            updateSearchData(inputval);
          },
          false
        );
      }
      
      if (window?.mobileCheck()) {
        let kTswBbMobile = document.querySelector(".kTswBbMobile");
        kTswBbMobile?.removeEventListener("click", () => {});
        kTswBbMobile?.addEventListener("click", (e: any) => {
          e.stopPropagation();
          setMeunBtn()
        });
      }

      let stopv = getScrollTop();
      if(stopv > 0){
        pupScroll()
      }
      let Disconnectrs: Element | null = document.querySelector("#Disconnectrs");
      if(Disconnectrs) {
      Disconnectrs?.addEventListener(
        "click",
        (e: any) => {
          e.stopPropagation()
          deactivate()
          // setIsWallet(false)
          sessionStorage.setItem(WALLET_CONNECT, "WALLET_CONNECT")
          ipsTips(t`Disconnect wallet link`, { variant: "success" })
        },
        false
      );
      }

      let WalletBtn: Element | null = document.querySelector("#WalletBtn");
      if(WalletBtn) {
        WalletBtn?.addEventListener(
          "click",
          (e: any) => {
            e.stopPropagation()
            setIsWalletModal(!isWalletModal);
            clearpup();
          },
          false
        );
        }

      return () => {
        document.removeEventListener("click", () => {});
        dEFVRZ = null;
        languibtn = null;
        topinput = null
        kQHrWFbtn = null
        cleartime = ""
        document.removeEventListener("scroll", pupScroll);
        window.removeEventListener('resize', reuiRande);
      };

    

    }, 560);

  };

  const setMeunBtn = (setval?:any) => {

    let kTswBbMobile = document.querySelector(".kTswBbMobile");
    let btnbln:boolean = false
    let rel = kTswBbMobile?.getAttribute('rel')
    if(!rel || rel === 'null' || rel === '0'){
      kTswBbMobile?.setAttribute('rel','1')
      btnbln = true
      if(kTswBbMobile)
       kTswBbMobile.innerHTML = btnclos
    } else {
      kTswBbMobile?.setAttribute('rel','0')
      btnbln = false
      if(kTswBbMobile)
        kTswBbMobile.innerHTML = mobilemeunbtnicon
    }
    if (setval === false && typeof setval !== 'undefined') {
      btnbln = false
    }
    mobileContextData?.setBtnState(btnbln)
  }

  // 获取当前钱包余额
  const userGetBalance = async () => {
    const reAccount:any = account?.toString()
    const web3 = new Web3(Web3.givenProvider);
    let balance = await web3.eth.getBalance(reAccount);
    let rebal = parseFloat(ethers.utils.formatEther(balance));
    let rebalance = "0";
    if (rebal) {
      rebalance = rebal.toFixed(3).toString();
      IPSNFT?.reUserBalance(rebalance)
      setUserBalance(rebalance)
    }
  }

  const clearEvent = () => {

    let kTswBbMobile = document.querySelector(".kTswBbMobile");
    if(!!kTswBbMobile){
      kTswBbMobile.removeEventListener("click", () => {});
    }
    let dEFVRZ: Element | null = document.querySelector(".dEFVRZ");
    let languibtn: Element | null = document.querySelector("#languibtn");
    if(!!dEFVRZ){
      dEFVRZ.removeEventListener("click", () => {});
    }
    if(!!languibtn){
      languibtn.removeEventListener("click", () => {});
    }
    document.removeEventListener("click", () => {});
    document.removeEventListener("scroll", pupScroll);
    window.removeEventListener('resize', reuiRande)
  }

  const reuiRande = () => {
    clearEvent()
    reTopMunUi();
  }
  

  useEffect(() => {
    if(userBalance !== '0'){
      reuiRande()
    }
  }, [userBalance,isReTopm]);


  const initTopMeunUi = () => {
    reTopMunUi();
    window.addEventListener('resize', reuiRande,false)
    window.setMeunBtn = setMeunBtn
  }


  useEffect(() => {
	if(!!account){
	  initTopMeunUi()
    userGetBalance()
   
	} else {
    initTopMeunUi();
  }
  }, [account]);

  const linkMetamask = () => {
    tryConnect(activate).then((res) => {
      console.log("RES", res)
      closeModal()
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
          closeModal()
          ipsTips(t`Successfully linked Wallet`, { variant: "success" })
        })
      })
    })
  }

  return (
    <React.Fragment>
      <div key={topNewid} dangerouslySetInnerHTML={{ __html: topMeun }}></div>
      <Modal open={isWalletModal} onClose={closeModal}>
      <div className="createconetbody">
             <div className="walletbody">
              <div className="walltop"><h4>Connect your wallet</h4><span onClick={closeModal}><WallClosIcons/></span></div>
              <div className="btns">
                <div onClick={linkMetamask}><MetamaskIcons/>Metamask</div>
                <div><FortunaticIcons/>Fortunatic</div>
                <div><img src={WalletConnect}/>WalletConnect</div>
                <div><img src={CoinbaseWallet}/>Coinbase Wallet</div>
              </div>
              <div className="wallboommt">Clear WallectConnect your Date</div>
             </div>
          </div>
      </Modal>
    </React.Fragment>
  );
}
export default Header;
