import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";

import SearchIcon from "@mui/icons-material/Search";

import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { FlexCCBox, FlexSBCBox, FlexSCBox } from "../../components/FlexBox";
import { ReactComponent as LogoIcons } from "../../asstes/logo.svg";
import { WHITE_ADDRESS } from "../../constants";
import useIpsTips from "../../hooks/useIpsTips";
import { t } from "@lingui/macro";
import useMenuList from "../../hooks/useMenuList";
// import { ipsAuctionMintNFTPayable, ipsWhiteMintNFTPayable, ipsPublicMintNFTPayable } from "../../utils/ipsMintNFTPayable";
import { SearchContextData, SearchContext } from "../../hooks/useSearchContext";
import useMediaQuery from "@mui/material/useMediaQuery";

const Main = styled(FlexSBCBox)`
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: auto;
  background: #005f7d;
`;

const Container = styled(FlexSBCBox)`
  padding: 120px 40px 80px;
  width: 100%;
  height: 100%;
`;

const Left = styled(FlexCCBox)`
  flex: 1;
  background: transparent;
  border-radius: 18px;
  margin: 0px 20px;
  align-self: flex-end;
  align-items: flex-end;
  padding-bottom: 100px;
`;

const Right = styled(FlexSCBox)`
  width: 200px;
  color: #fff;
  flex-direction: column;
`;

const IntervalCol = styled.div`
  height: 200px;
  width: 0;
  border: 1px solid #fff;
`;

const TabCircular = styled.div<{ isCheck?: boolean }>`
  width: ${({ isCheck }) => (isCheck ? "12px" : "8px")};
  height: ${({ isCheck }) => (isCheck ? "12px" : "8px")};
  background: #fff;
  border-radius: 50%;
  margin: 2px;
  cursor: pointer;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  &:hover {
    width: 12px;
    height: 12px;
  }
`;

const SearchCard = styled(FlexSCBox)`
  width: 100%;
  margin: 40px 0 0;
  max-width: 800px;
  border: 1px solid #ccc;
  border-radius: 8px;
  color: #fff;
  font-size: 24px;
  padding-left: 20px;
  overflow: hidden;
`;

const SearchPosition = styled.input`
  width: 100%;
  height: 100%;
  border: 0 none;
  background: transparent;
  padding: 0 16px;
  color: #fff;
  font-size: 24px;
`;

const SearchBtn = styled.div`
  color: #627885;
  height: 100%;
  background: #ffffff;
  font-size: 20px;
  padding: 8px 24px;
  cursor: pointer;
  white-space: nowrap;
`;

const MINT = styled(Button)`
  padding: 8px 20px;
  border: 1px solid #feb139 !important;
  color: #feb139 !important;
  cursor: pointer;
  margin-right: 20px !important;
`;

const LogoCard = styled(FlexSBCBox)`
  position: absolute;
  top: 0;
  left: 0;
  padding: 40px;
  width: 100%;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  flex-wrap: wrap;
`;

const Logo = styled(FlexSCBox)`
  cursor: pointer;
`;

const LogoText = styled.div`
  font-size: 24px;
  font-weight: 700;
  margin-left: 8px;
`;
const RightBox = styled.div<{ isMobile?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ isMobile }) => (isMobile ? "" : "100px")};
`;

const LogoIps = styled.div`
  border-radius: 6px;
  padding: 4px 0px;
`;
const DocsBox = styled.div`
  a{
    color: #ffffff;
    text-decoration: none;
  }
  padding: 4px 20px;
`;

function Home() {
  const navigate = useNavigate();
  const [state, setState] = useState("");
  const searchContextData = useContext<SearchContextData>(SearchContext);
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const ipsTips = useIpsTips();

  const [checkNum, setCheckNum] = useState(0);

  const menuList = useMenuList();

  const [pathName, setPathName] = useState(menuList[0].url);

  useEffect(() => {
    if (account && library) {
      // ipsAuctionMintNFTPayable(account, chainId, library)
    }
  }, [account, chainId, library]);

  const searchCallBack = useCallback(() => {
    if (!!state) {
      navigate("/cns/details", { state });
      document.title = "CNS";
      searchContextData?.setSearchState(state);
    } else {
      ipsTips(t`Enter search params`, { variant: "warning" });
    }
  }, [pathName, state, navigate, ipsTips]);

  const ismobile = useMediaQuery("(min-width:980px)");

  return (
    <Main>
      <LogoCard>
        <Logo>
          <LogoIcons fill="#FFFFFF" />
          <LogoText>IPS.Network -11</LogoText>
        </Logo>

        {/* <div>
					<MINT
						disabled={!account || !library}
						onClick={() => {
							if (account && library) {
								ipsAuctionMintNFTPayable(account, chainId, 1).then((res: any) => {
									console.log('RES', res)
									ipsTips(t`MINT SUCCESS`, { variant: "success" })
								}).catch((err: any) => {
									console.log('ERROR', err)
									ipsTips(t`MINT ERROR`, { variant: "error" })
								})
							}
						}}>
						AUCTIONMINT
					</MINT>
					<MINT
						disabled={!account || !library}
						onClick={() => {
							if (account && library) {
								const flag = WHITE_ADDRESS.includes(account ?? "")
								console.log('FLAG', flag)
								if (flag) {
									ipsWhiteMintNFTPayable(account, chainId, 1).then((res: any) => {
										console.log('RES', res)
										ipsTips(t`MINT SUCCESS`, { variant: "success" })
									}).catch((err: any) => {
										console.log('ERROR', err)
										ipsTips(t`MINT ERROR`, { variant: "error" })
									})
								} else {
									alert('非白名单地址')
								}
							}

						}}>
						WHITEMINT
					</MINT>

					<MINT
						disabled={!account || !library}
						onClick={() => {
							console.log('PUBLICMINT')
							if (account && library) {
								ipsPublicMintNFTPayable(account, chainId, 1).then((res: any) => {
									console.log('RES', res)
									ipsTips(t`MINT SUCCESS`, { variant: "success" })
								}).catch((err: any) => {
									console.log('ERROR', err)
									ipsTips(t`MINT ERROR`, { variant: "error" })
								})
							}
						}}>
						PUBLICMINT
					</MINT>
				</div>
 */}
        <RightBox isMobile={ismobile}>
        <DocsBox
            onClick={() => {
              navigate("/dao");
            }}
          >
            Dao
          </DocsBox>
          <DocsBox>
            <a href="/c">Docs</a>
          </DocsBox>

          <LogoIps
            onClick={() => {
              navigate("/spaceNFT");
            }}
          >
            Join IPS
          </LogoIps>
        </RightBox>
      </LogoCard>
      <Container>
        <Left>
          <SearchCard>
            <SearchIcon />
            <SearchPosition
              value={state}
              placeholder={t`Search CNS name`}
              onKeyUp={(e:any) => {
                if (e.key === "Enter") {
                  searchCallBack();
                }
              }}
              onChange={(e:any) => {
                setState(e.target.value.trim());
              }}
            />
            <SearchBtn onClick={searchCallBack}>Search</SearchBtn>
          </SearchCard>
        </Left>

        {/* <Right>
					{
						menuList?.map((item, idx) => <Fragment>
							{!!idx && <IntervalCol />}
							<TabCircular isCheck={checkNum === idx} onClick={() => {
								setCheckNum(idx)
								setPathName(item.url)
							}} />
						</Fragment>)
					}
				</Right> */}
      </Container>
    </Main>
  );
}

export default Home;
