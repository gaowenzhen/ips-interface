import styled from "styled-components";
import { t, Trans } from "@lingui/macro";

import { useCallback, useContext, useEffect, useState } from "react";

// import Web3 from "web3";
// import { RPC_URL } from "../../../constants";
import { IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { ReactComponent as TipsIcons } from "../../../asstes/cns/tips.svg";
import { ReactComponent as ArrowBottomIcons } from "../../../asstes/cns/arrowBottom.svg";
import { ReactComponent as LinkIcons } from "../../../asstes/cns/link.svg";
import CopyBox from "../../../components/CopyBox";

import CircularProgress from "@mui/material/CircularProgress";
import { blue } from "@mui/material/colors";

import {
  FlexCCBox,
  FlexSBCBox,
  FlexSCBox,
  FlexSSBox,
} from "../../../components/FlexBox";

// import { VariantType } from "notistack";
import useIpsTips from "../../../hooks/useIpsTips";
import { useLocation } from "react-router-dom";
import { useIPSCNSRegisterarControllerContract } from "../../../hooks/useContract";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumberish, ethers } from "ethers";
import { ipsCnsPayable } from "../../../utils/ipsCnsPayable";
import { SearchContextData, SearchContext } from "../../../hooks/useSearchContext";
import { dayjsTime } from "../../../utils/dayjsTime";
import { isPending } from "../../../utils/isPending";
import useMediaQuery from "@mui/material/useMediaQuery";

interface CnsNftType {
  tokenId: BigNumberish;
  cnsName: string;
  cnsTerm: string;
}

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 90%;
  height: 100%;
  margin: 0px auto;
`;

const CardItem = styled.div`
  margin-top: 16px;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: #49475d;
`;

const Bind = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #49475d;
`;

export const BindLink = styled.span`
  border-bottom: 1px solid #005f7d;
  color: #005f7d;
  cursor: pointer;
`;

const TipsIconsGroup = styled(TipsIcons)`
  margin: 0 4px;
`;

export const CnsCard = styled(FlexSBCBox)<{
  disabled?: boolean;
  isMobile?: boolean;
}>`
  padding: 16px 20px;
  background: #fff;
  border: 1px solid rgba(112, 110, 255, 0.46);
  border-radius:6px;
`;

export const CopyIcon = styled(ContentCopyIcon)`
  margin: 0 16px;
  color: #5384fe;
  opacity: 0.8;
  cursor: pointer;
`;

const CnsCardTabs = styled.div``;

const Available = styled.div`
  color: #ffffff;
  font-weight: 700;
  font-size: 24px;
`;

const CnsGroup = styled(FlexSSBox)`
  padding: 2px;
  background: #ffffff;
`;

const CnsGroupBox = styled.div<{ isRenew?: boolean }>`
  background: ${({ isRenew }) => (isRenew ? "#49475D;" : "#dce9ed;")};
  box-shadow: ${({ isRenew }) => (isRenew ? "0px 5px 10px #49475D;" : "0px 5px 10px #d2d2d2;")};
  border-bottom-left-radius: 9px;
  border-bottom-right-radius: 9px;
  width: 100%;
  text-align: center;
`;
const CnsGroupItemBox = styled.div`
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

const CnsGroupItem = styled.div<{ isCheck?: boolean }>`
  padding: 4px 16px;
  font-weight: 400;
  font-size: 16px;
  background: ${({ isCheck }) => (isCheck ? "transparent" : "#49475D")};
  color: ${({ isCheck }) => (isCheck ? "#000000" : "#FFFFFF")};
`;

const Card = styled.div`
  background: #eff5f7;
  border-radius: 18px;
  margin-top: 24px;
  padding: 24px;
`;

const Years = styled(FlexSCBox)<{ isMobile?: boolean }>`
  width: 100%;
  display: ${({ isMobile }) => (isMobile ? "flex" : "block;")};
  text-align: left;
`;

const Icon = styled(FlexCCBox)`
  background: #dce9ed;
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
`;

const YearsCheck = styled.div``;

const LinkCard = styled.div`
  max-height: 78px;
  padding: 0 16px;
`;

const UrlCard = styled.div`
  max-height: 78px;
  flex: 1;
`;

const YearsCheckContent = styled(FlexSBCBox)``;

const YearsCheckText = styled(FlexCCBox)`
  font-weight: 400;
  font-size: 20px;
  color: #49475d;
  padding: 0 24px;
`;

const YearsBorder = styled.div`
  width: 100%;
  height: 8px;
  border-bottom: 1px dashed #49475d;
`;

const LinkIcon = styled(FlexCCBox)``;

const LinkBorder = styled.div`
  width: 100%;
  height: 8px;
  border-bottom: 1px dashed transparent;
`;

const UrlContent = styled(FlexSSBox)<{ isMobile?: boolean }>`
  min-height: 30px;
  width: ${({ isMobile }) => (isMobile ? "auto" : "100%;")};
  text-align: center;
  display: inline-block;
`;

const CardInfo = styled.div`
  line-height: 2;
  font-size: 14px;
  margin-top: 16px;
`;

const CradFooter = styled.div<{ isMobile?: boolean }>`
  width: 100%;
  margin-top: ${({ isMobile }) => (isMobile ? "100px" : "20px")};
`;

const DetailsItem = styled(FlexSBCBox)`
  width: 100%;
  margin-top: 20px;
`;
const ListItem = styled.div`
  font-size: 16px;
  width: 100%;
  margin: 20px auto;
`;
const AddupPrice = styled.div`
  font-size: 16px;
  width: 60%;
  color: rgb(246, 65, 45);
`;

const Btnlint = styled.div`
font-size: 16px;
width: 40%;
color:rgb(246, 65, 45)
font: 14px px;
text-align: right;
`;

const ReItemDiv = styled.div`
  font-weight: 100;
  width: 100%;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const ReSpan = styled.span`
  color: rgb(82, 132, 255);
  font-weight: initial;
`;

export const NoData = styled(FlexCCBox)`
  width: 100%;
  padding: 100px;
`;

const RegisterCard = styled(FlexSBCBox)<{ isMobile?: boolean }>`
  flex-direction: row-reverse;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? "70px" : "30px;")};
`;

const SetBtn = styled(Button)<{ bgcolor?: string; disabled?: boolean }>`
  padding: 4px 40px;
  background: ${({ bgcolor }) => bgcolor ?? "#FFFFFF"} !important;
  border-radius: 6px;
  color: #49475d !important;
`;

const ShowBtn = styled(Button)`
  padding: 4px 20px;
  background: #ffffff !important;
  border-radius: 6px;
  margin-right: 10px !important;
  margin-bottom: 6px !important;
  border: 1px solid #ccc !important;
  color: #49475d !important;
  font-size: 16px !important;
`;

const RegisterBtn = styled(Button)<{ disabled?: boolean }>`
  padding: 4px 40px;
  background: #005f7d !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 9px;
  color: #ffffff !important;
`;

function Cns() {
  // const web3 = new Web3(window.ethereum || RPC_URL);
  const ismobile = useMediaQuery("(min-width:980px)");
  const locationState = useLocation();
  const ipsTips = useIpsTips();
  const searchContextData = useContext<SearchContextData>(SearchContext);
  const { account, chainId, library } = useWeb3React<Web3Provider>();

  let rsCnsName: string = searchContextData?.searchState ?? "";
  if (locationState.state) {
    rsCnsName = (locationState.state as CnsNftType)?.cnsName ?? "";
  }

  const [rsAccount, setRsAccount] = useState(account || "");

  const [cnsName, setCnsName] = useState(rsCnsName || "");
  const ipsCns = useIPSCNSRegisterarControllerContract();
  const [cnsGroup, setCnsGroup] = useState(0);
  const [cnsStatus, setCnsStatus] = useState(false);
  const [CnsGroupList] = useState([t`Register`, t`Details`, t`Subdomains`]);
  const [cnsTerm, setCnsTerm] = useState(1);
  const [price, setPrice] = useState("--");
  const [cnsTime, setCnsTime] = useState(false);
  const [cnsNftLen, setCnsNftLen] = useState(0);
  const [isData, setIsData] = useState(false);
  const [isRenew, setIsRenew] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [hash, setHash] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isExtend, setIsExtend] = useState(false);

  // if (rsCnsName && typeof rsCnsName !== "undefined") {
  //   setIsRegister(true);
  // }
  // const [testRs, setTestRs] = useState("");
  // const ipsBaseCoordinateBind = useIPSBaseCoordinateBindContract();

  //###
  useEffect(() => {
    console.dir("details--searchContextData--useEffect");
    let rsCnsName: string = searchContextData?.searchState ?? "";
    if (rsCnsName && typeof rsCnsName !== "undefined") {
      setIsRegister(true);
    }
    setCnsName(rsCnsName || "");
  }, [searchContextData]);

  // useEffect(() => {
  //   console.dir("details-locationState--useEffect");
  //   let rsCnsName: string = (locationState.state as CnsNftType)?.cnsName ?? "";
  //   setCnsName(rsCnsName || "");
  // }, [locationState]);

  const register = useCallback(async () => {
    console.dir("details--useCallback");
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
      setPrice(price.toFixed(4).toString() || "0");
      setIsRegister(false);
    }
  }, [cnsTerm, ipsCns, cnsName, library, endTime, rsAccount]);

  useEffect(() => {
    if ((cnsStatus && cnsStatus && !cnsGroup) || (isExtend && cnsGroup === 2))
      cnsPrice();
  }, [isExtend, cnsStatus, cnsGroup, cnsTerm, cnsName]);

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
        setIsRenew(true);
        setCnsTime(true);
      }
    }
  }, [ipsCns, cnsName]);

  useEffect(() => {
    init();
  }, [hash, cnsName]);

  const reCnsGroup = () => {
    let cngh = (
      <CnsGroup>
        {CnsGroupList.map((item, idx) => (
          <CnsGroupItem
            key={idx}
            className="cnsGroupItem"
            onClick={(e:any) => {
              e.stopPropagation();
              setCnsGroup(idx);
            }}
            isCheck={cnsGroup === idx}
          >
            {item}
          </CnsGroupItem>
        ))}
      </CnsGroup>
    );
    if (!ismobile) {
      cngh = (
        <CnsGroupBox isRenew={isRenew}>
          <CnsGroupItemBox>{cngh}</CnsGroupItemBox>
        </CnsGroupBox>
      );
    }
    return cngh;
  };

  const reIconButton = () => {
    let iconbtn = <></>;
    if (ismobile) {
      iconbtn = (
        <IconButton aria-label="search">
          {cnsStatus ? (
            reCnsGroup()
          ) : (
            <Available>
              <Trans>{isRenew ? "Unavailable" : "Available"}</Trans>
            </Available>
          )}
        </IconButton>
      );
    } else {
      iconbtn = <IconButton aria-label="search"></IconButton>;
    }
    return iconbtn;
  };

  return (
    <Main>
      <Container>
        <CardItem>
          <Title>
            <Trans>Names</Trans>
          </Title>
        </CardItem>

        <CardItem>
          <CnsCard disabled={!!cnsTime} isMobile={ismobile}>
            <CopyBox
              textStyle={{ color: isRenew ? "#FFFFFF" : "#888888" }}
              text={cnsName}
            />
            <CnsCardTabs>
              {reIconButton()}

              <IconButton
                onClick={() => {
                  if (!cnsName)
                    return ipsTips(t`CNS name cannot be empty`, {
                      variant: "warning",
                    });
                  if (!cnsStatus) setIsRegister(true);

                  setCnsStatus(!cnsStatus);
                }}
                type="submit"
                sx={{ p: "10px" }}
                aria-label="search"
              >
                <ArrowBottomIcons fill="#FFF" />
              </IconButton>
            </CnsCardTabs>
          </CnsCard>
          {cnsStatus && !ismobile ? reCnsGroup() : ""}
        </CardItem>

        <CardItem>
          <Bind>
            <TipsIconsGroup />{" "}
            <Trans>
              If you have SPACE NFT, you can <BindLink>bind</BindLink> them
              directly.
            </Trans>
          </Bind>
        </CardItem>

        {cnsGroup === 0 && !!cnsStatus && (
          <Card>
            <Years isMobile={ismobile}>
              <YearsCheck>
                <YearsCheckContent>
                  <Icon
                    onClick={() => {
                      if (cnsTerm !== 1) {
                        setCnsTerm(cnsTerm - 1);
                      }
                    }}
                  >
                    <RemoveIcon />
                  </Icon>
                  <YearsCheckText>
                    {cnsTerm} <Trans>year</Trans>
                  </YearsCheckText>
                  <Icon
                    onClick={() => {
                      setCnsTerm(cnsTerm + 1);
                    }}
                  >
                    <AddIcon />
                  </Icon>
                </YearsCheckContent>
                <YearsBorder />
                <CardInfo>
                  <TipsIconsGroup /> <Trans>Registration Period</Trans>
                </CardInfo>
              </YearsCheck>

              {ismobile ? (
                <LinkCard>
                  <LinkIcon>
                    <LinkIcons width="24px" height="24px" />
                  </LinkIcon>
                  <LinkBorder />
                  <CardInfo style={{ visibility: "hidden" }}>
                    <TipsIconsGroup /> If
                  </CardInfo>
                </LinkCard>
              ) : (
                ""
              )}

              <UrlCard>
                <UrlContent isMobile={ismobile}>{price}</UrlContent>
                <YearsBorder />
                <CardInfo>
                  <TipsIconsGroup /> <Trans>Registration Price to pay</Trans>
                </CardInfo>
              </UrlCard>
            </Years>

            <CradFooter isMobile={ismobile}>
              <YearsBorder />
              <CardInfo>
                <TipsIconsGroup />{" "}
                <Trans>
                  Estimated Total( Price+?). The ? price is based at ?.
                </Trans>
              </CardInfo>
            </CradFooter>
          </Card>
        )}

        {cnsGroup === 1 && !!cnsStatus && (
          <Card>
            <DetailsItem>
              <ReItemDiv>
                <span>Parent: </span>
                <ReSpan>{endTime && isRenew ? cnsName + '.ips':'ips'}</ReSpan>
              </ReItemDiv>
            </DetailsItem>
            <DetailsItem>
              <ReItemDiv>
                <span>Registrant: </span>
                <ReSpan>{endTime && isRenew ? rsAccount:'0x0'}</ReSpan>
              </ReItemDiv>
            </DetailsItem>
            <DetailsItem>
              <ReItemDiv>
                <span>Controller: </span>
                <ReSpan>Not owned</ReSpan>
              </ReItemDiv>
              <SetBtn>
                <Trans>Set</Trans>
              </SetBtn>
            </DetailsItem>
          </Card>
        )}

        {isData && <NoData />}

        {cnsGroup === 2 && !!cnsStatus && isRenew && endTime && (
          <Card>
            <DetailsItem>
              <ReItemDiv>
                <span>PARENT: </span>
                <ReSpan>{cnsName}.ips</ReSpan>
              </ReItemDiv>
            </DetailsItem>
            <DetailsItem>
              <ReItemDiv>
                <span>REGISTRANT: </span>
                <ReSpan>{rsAccount}</ReSpan>
              </ReItemDiv>
            </DetailsItem>
            <DetailsItem>
              <Trans>CONTROLLER</Trans>{" "}
              <SetBtn>
                <Trans>Transfer</Trans>
              </SetBtn>
            </DetailsItem>
            {!!isExtend ? (
              <div>
                <ReItemDiv>
                  <span>EXPIRATION DAIE: </span>
                  <ReSpan>{endTime}</ReSpan>
                </ReItemDiv>
                <DetailsItem>
                  <Years isMobile={ismobile}>
                    <YearsCheck>
                      <YearsCheckContent>
                        <Icon
                          onClick={() => {
                            if (cnsTerm !== 1) {
                              setCnsTerm(cnsTerm - 1);
                            }
                          }}
                        >
                          <RemoveIcon />
                        </Icon>
                        <YearsCheckText>
                          {cnsTerm} <Trans>year</Trans>
                        </YearsCheckText>
                        <Icon
                          onClick={() => {
                            setCnsTerm(cnsTerm + 1);
                          }}
                        >
                          <AddIcon />
                        </Icon>
                      </YearsCheckContent>
                      <YearsBorder />
                      <CardInfo>
                        <TipsIconsGroup /> <Trans>Registration Period</Trans>
                      </CardInfo>
                    </YearsCheck>

                    <LinkCard>
                      <LinkIcon>
                        <LinkIcons width="24px" height="24px" />
                      </LinkIcon>
                      <LinkBorder />
                      <CardInfo style={{ visibility: "hidden" }}>
                        <TipsIconsGroup /> If
                      </CardInfo>
                    </LinkCard>

                    <UrlCard>
                      <UrlContent isMobile={ismobile}>{price}</UrlContent>
                      <YearsBorder />
                      <CardInfo>
                        <TipsIconsGroup />{" "}
                        <Trans>Registration Price to pay</Trans>
                      </CardInfo>
                    </UrlCard>
                  </Years>
                </DetailsItem>
                <DetailsItem>
                  <AddupPrice>
                    *Extending the registration of a name you do not own does
                    not give you ownership of it.
                  </AddupPrice>
                  <Btnlint>
                    <ShowBtn
                      onClick={() => {
                        setIsExtend(false);
                      }}
                    >
                      Cancel
                    </ShowBtn>
                    <ShowBtn disabled={isRegister} onClick={register}>
                      Extend
                    </ShowBtn>
                    {isRegister && (
                      <CircularProgress
                        size={38}
                        sx={{
                          color: blue[100],
                          position: "absolute",
                          top: 4,
                          left: 6,
                          zIndex: 1,
                        }}
                      />
                    )}
                  </Btnlint>
                </DetailsItem>
              </div>
            ) : (
              <>
                <DetailsItem>
                  <ReItemDiv>
                    <span>EXPIRATION DAIE: </span>
                    <ReSpan>{endTime}</ReSpan>
                  </ReItemDiv>
                </DetailsItem>
                <DetailsItem>
                  <SetBtn
                    onClick={() => {
                      setIsExtend(true);
                    }}
                    bgcolor="#DCE9ED"
                  >
                    <Trans>Extend</Trans>
                  </SetBtn>
                </DetailsItem>
              </>
            )}
          </Card>
        )}
        {cnsGroup === 2 && !endTime && (
          <NoData>No Subdomains have been added</NoData>
        )}
      </Container>
      {!!cnsStatus ? (
        <RegisterCard isMobile={ismobile}>
          <RegisterBtn disabled={isRegister} onClick={register}>
            <PersonOutlineIcon />
            {isPending(
              { isRegister },
              "isRegister",
              isRenew ? t`RENEW` : t`REGISTER`
            )}
            {isRegister && (
              <CircularProgress
                size={38}
                sx={{
                  color: blue[100],
                  position: "absolute",
                  top: 4,
                  left: 6,
                  zIndex: 1,
                }}
              />
            )}
          </RegisterBtn>
        </RegisterCard>
      ) : (
        <NoData />
      )}
    </Main>
  );
}

export default Cns;
