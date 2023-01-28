import styled from "styled-components";
import { ReactComponent as LogoIcons } from "../../asstes/logo.svg";
import { ReactComponent as LanguageIcons } from "../../asstes/header/language.svg";
import { ReactComponent as BottomIcons } from "../../asstes/header/bottom.svg";
import { ReactComponent as LanguageCheckIcons } from "../../asstes/header/languageCheck.svg";
import { ReactComponent as LanguageGroupIcons } from "../../asstes/header/languageGroup.svg";
import { ReactComponent as MenuIcon } from "../../asstes/spaceNFT/offers.svg";
import { ReactComponent as SearchIcons } from "../../asstes/header/searchmx.svg";

import {
  FlexCCBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSCBox,
} from "../../components/FlexBox";
import HomeSearch from "../../components/HomeSearch";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState,useContext } from "react";
import { t, Trans } from "@lingui/macro";
import { locales, selectLocale } from "../../locales";
import { LOCAL_KEY, WALLET_CONNECT } from "../../constants";
import { useNavigate } from "react-router-dom";
import useIpsTips from "../../hooks/useIpsTips";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MOBILEContextData,MOBILEContext} from "../../hooks/useMOBILEContext";

const HeaderMain = styled(FlexSBCBox)<{ isMobile?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? "24px 40px;" : "20px 30px")};
  z-index: 1200;
  background: #fff;
`;

const HomeSearchBox = styled.div`
 position: fixed;
 top: 65px;
 z-index: 1200;
 background: #fff;
 text-align: center;
 width: 100%;
`

const HeaderLeft = styled(FlexSCBox)`
  cursor: pointer;
`;

const HeaderCenter = styled(FlexCCBox)`
  max-width: 500px;
  width: 100%;
  letter-spacing: 0.05em;
  color: #49475d;
  display: flex;
  flex-wrap: wrap;
`;

const HeaderRight = styled(FlexSACBox)``;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-left: 8px;
`;

const Language = styled(FlexCCBox)`
  position: relative;
  top: 0;
  left: 0;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
`;

const Wallet = styled(FlexCCBox)`
  position: relative;
  top: 0;
  left: 0;
  background: rgba(221, 233, 237, 0.45);
  padding: 8px 20px;
  border-radius: 6px;
  margin-left: 24px;
  cursor: pointer;
`;

const BottomBtn = styled(BottomIcons)`
  margin-left: 12px;
`;

const AddressAvater = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #005f7d;
`;

const Address = styled.div`
  margin-left: 8px;
`;

const AddressMenu = styled.div<{ isWallet: boolean; width?: number }>`
  position: absolute;
  display: ${({ isWallet }) => (isWallet ? "block" : "none")};
  top: 48px;
  left: 50%;
  z-index: 200;
  width: ${({ width }) => (width ? width + "px" : "100%")};
  background: #eff5f7;
  box-shadow: 0px 5px 10px rgba(155, 155, 155, 0.25);
  border-radius: 6px;
  transform: translateX(-50%);
`;

const LanguageMenu = styled.div<{ isLanguage: boolean }>`
  position: absolute;
  display: ${({ isLanguage }) => (isLanguage ? "block" : "none")};
  top: 48px;
  left: 50%;
  z-index: 200;
  background: #eff5f7;
  box-shadow: 0px 5px 10px rgba(155, 155, 155, 0.25);
  border-radius: 6px;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 400;
`;

const Item = styled.div`
  width: 100%;
  padding: 12px 16px;
`;

const LanguageItem = styled(FlexSBCBox)<{ isLangugeCheck?: boolean }>`
  min-width: 150px;
  width: 100%;
  padding: 12px 16px;
  color: ${({ isLangugeCheck }) => (isLangugeCheck ? "#005F7D" : "#393939")};
`;

const Disconnect = styled(Item)`
  color: #005f7d;
`;

const Division = styled.div`
  width: 100%;
  height: 4px;
  background: #fff;
`;
const MenuBtn = styled.div`
  background: #fff;
`;



function Header() {

  const mobileContextData = useContext<MOBILEContextData>(MOBILEContext);
  
  const ismobile = useMediaQuery("(min-width:980px)");
  const navigate = useNavigate();
  const ipsTips = useIpsTips();
  const walletRef = useRef<any>(null);
  const { account, chainId, deactivate, library } =
    useWeb3React<Web3Provider>();
  const [isWallet, setIsWallet] = useState(false);
  const [isLanguage, setIsLanguage] = useState(false);
  const [languageNum, setLanguageNum] = useState(0);
  const [isMobileSearShow,setIsMobileSearShow] = useState(false);

  useEffect(() => {
    console.dir("header--index.tsx");
    const locale = window.localStorage.getItem(LOCAL_KEY) as string;
    if (locale) {
      setLanguageNum(
        Object.values(locales)
          .map((item) => item.flag)
          .findIndex((item) => {
            return item === locale;
          })
      );
    }
  }, []);

  const MenuList = [
    {
      url: "/spaceNFT/manage",
      default: <Trans>Manage Space NFT</Trans>,
    },
    {
      url: "/meta",
      default: <Trans>Manage Meta</Trans>,
    },
  ];

  return (
    <>
    <HeaderMain isMobile={ismobile}>
      <HeaderLeft
        onClick={() => {
          navigate("/home");
        }}
      >
        <LogoIcons fill="#005F7D" />
        <LogoText>IPS.Network</LogoText>
      </HeaderLeft>
      {ismobile ? (
        <>
          <HeaderCenter>
            <HomeSearch />
          </HeaderCenter>
          <HeaderRight>
            <Language
              onClick={() => {
                if (account) {
                  setIsWallet(false);
                  setIsLanguage(!isLanguage);
                }
              }}
            >
              <LanguageIcons />
              <BottomBtn />
              <LanguageMenu isLanguage={isLanguage}>
                {Object.values(locales).map((locale, idx) => (
                  <LanguageItem
                    key={idx}
                    onClick={() => {
                      setLanguageNum(idx);
                      selectLocale(locale.flag);
                    }}
                    isLangugeCheck={languageNum === idx}
                  >
                    {locale.text}{" "}
                    {languageNum === idx ? (
                      <LanguageCheckIcons />
                    ) : (
                      <LanguageGroupIcons />
                    )}
                  </LanguageItem>
                ))}
              </LanguageMenu>
            </Language>
            <Wallet
              ref={walletRef}
              onClick={() => {
                if (account) {
                  setIsLanguage(false);
                  setIsWallet(!isWallet);
                }
              }}
            >
              <AddressAvater></AddressAvater>
              <Address>
                {account
                  ? account?.slice(0, 6) +
                    "..." +
                    account?.slice(account.length - 6)
                  : ""}
                <AddressMenu
                  width={walletRef?.current?.offsetWidth}
                  isWallet={isWallet}
                >
                  {MenuList.map((item, idx) => (
                    <Item
                      key={idx}
                      onClick={() => {
                        navigate(item.url);
                      }}
                    >
                      {item.default}
                    </Item>
                  ))}
                  <Division />
                  <Disconnect
                    onClick={(e:any) => {
                      e.stopPropagation();
                      deactivate();
                      setIsWallet(false);
                      sessionStorage.setItem(WALLET_CONNECT, "WALLET_CONNECT");
                      ipsTips(t`Disconnect wallet link`, {
                        variant: "success",
                      });
                    }}
                  >
                    <Trans>Disconnect</Trans>
                  </Disconnect>
                </AddressMenu>
              </Address>
            </Wallet>
          </HeaderRight>
          </>
      ) : (
        <>
        <SearchIcons onClick={() => {
          setIsMobileSearShow(!isMobileSearShow)
        }} />
        <MenuBtn onClick={(e:any) => {
          e.stopPropagation()
          mobileContextData?.setBtnState(!mobileContextData?.btnState)
        }}>
          <MenuIcon/>
        </MenuBtn>
        </>
      )}
    </HeaderMain>
    {!ismobile && isMobileSearShow?<HomeSearchBox><HomeSearch Callback={() =>{
      setTimeout(()=>{
        setIsMobileSearShow(false)
      },400)
    }} /></HomeSearchBox>:''}
    </>
  );
}

export default Header;
