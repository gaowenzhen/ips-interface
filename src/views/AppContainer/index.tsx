// import { Web3Provider } from "@ethersproject/providers";
// import { useWeb3React } from "@web3-react/core";

import { ReactNode, useEffect, useState,useContext } from "react";
// import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks";

// import { toggleTheme } from "../../state/ThemeSlice";
// import { tryConnect } from "../../utils/ethers/tryConnect";

import styled from "styled-components";

// import Footer from "../../components/Footer";
import Header from "../../components/Header";


import LeftMenu from "../LeftMenu";
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft"

// import { ReactComponent as AppLogoIcons } from "../../asstes/app/appLogo.svg";
// import { ReactComponent as AppLogoMini } from "../../asstes/app/appLogomini.svg";

import { FlexSBCBox, FlexSSBox } from "../../components/FlexBox";
//import { WALLET_CONNECT } from "../../constants";
// import { Trans } from "@lingui/macro";
// import { SearchContextData, SearchContext } from "../../hooks/useSearchContext"
import { MOBILEContext } from "../../hooks/useMOBILEContext";
// import useMediaQuery from "@mui/material/useMediaQuery";

const Main = styled.div`
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100%;
`;

const Container = styled.div<{ isMobile?: boolean }>`
  margin: 0px 0px;
  width: 100%;
  min-height: calc(100vh - 120px);
`;

const Top = styled(FlexSBCBox)<{ isMobile?: boolean }>`
  padding: 15px 0px 0px 0px;
  width: ${({ isMobile }) => (isMobile ? "100%" : "90%")};
  margin: ${({ isMobile }) => (isMobile ? "0px 0px" : "0px auto;")};
`;

const TopPc = styled(FlexSBCBox)<{ isMobile?: boolean }>`
  padding: 0px 0px;
  width: ${({ isMobile }) => (isMobile ? "96%" : "90%")};
  margin: ${({ isMobile }) => (isMobile ? "0px 0px" : "0px auto;")};
`;

const Left = styled(FlexSSBox)<{ isMobile?: boolean }>`
  font-weight: 700;
  font-size: ${({ isMobile }) => (isMobile ? "60px;" : "18px;")};
`;

// const AppIcon = styled(FlexSSBox)`
//   padding: 0;
// `;

const AppMain = styled.div`
  margin-left: 12px;
`;

const MainText = styled.div`
  line-height: 1;
  color: #000;
`;

// const MainViceText = styled.div<{ isMobile?: boolean }>`
//   font-size: ${({ isMobile }) => (isMobile ? "40px;" : "12px;")};
//   font-weight: 400;
//   color: #d0d0d0;
// `;

function AppContainer({
  mainTitle,
  viceTitle,
  children,
  rightMenu: RightMenu,
}: {
  mainTitle?: ReactNode;
  viceTitle?: ReactNode;
  children?: ReactNode;
  rightMenu?: ReactNode;
}) {
  const [btnState, setBtnState] = useState(false);
  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext)
 
 
  // const { account, activate, active, deactivate } =
  //   useWeb3React<Web3Provider>();

  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    console.log("location.pathname", theme, globalThis.location.pathname);
  }, [theme]);

  const ismobile = IPSNFT?.isMobile

  return (
    <Main>
      <MOBILEContext.Provider value={{ btnState, setBtnState }}>
      <div data-rk>
        <Header/>
        {window.mobileCheck()?<LeftMenu btnState={btnState}/>:null}
        <div className="topmt68px"></div>
        <Container onClick={()=>{
            if(btnState && !ismobile){
				setBtnState(false)
				return;
			}
		}} key="container" isMobile={ismobile}>
          {ismobile?<><div className="pctoptitle"><h1>{mainTitle}</h1><div>{viceTitle}

</div></div><TopPc isMobile={ismobile}>
           <div></div>{RightMenu}
          </TopPc></>:<Top isMobile={ismobile}>
            <Left isMobile={ismobile}>
              <AppMain>
                <MainText>{mainTitle}</MainText>
              </AppMain>
            </Left>
            {RightMenu}
          </Top>}
          {children}
        </Container></div>
      </MOBILEContext.Provider>
    </Main>
  
  );
}

export default AppContainer;
