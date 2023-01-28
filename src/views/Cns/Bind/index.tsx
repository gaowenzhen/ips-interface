import styled from "styled-components";
import { t, Trans } from "@lingui/macro";

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { TextField } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { BigNumberish, BigNumber } from "ethers";


import { ReactComponent as SelIcons } from "../../../asstes/app/rotst.svg";
// import { ReactComponent as ArrowBottomIcons } from "../../../asstes/cns/arrowBottom.svg";
import CopyBox from "../../../components/CopyBox";

import {
  FlexCCBox,
  FlexSBCBox,
  FlexSCBox,
  FlexSSBox,
} from "../../../components/FlexBox";

import useIpsTips from "../../../hooks/useIpsTips";
import { TextFieldContainer } from "../../../views/SpaceNFT/Mint";
import { initData } from "../../../views/Meta/Create";
import { CreateBtn, DataType, LocationType } from "../../../views/Coord/Create";
import { isPending } from "../../../utils/isPending";
import {
  useIPSBaseCoordinateBindContract,
  useIPSCNSRegisterarControllerContract,
} from "../../../hooks/useContract";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useLocation } from "react-router-dom";

import { SearchContextData, SearchContext } from "../../../hooks/useSearchContext";
// import { dayjsTime } from "../../../utils/dayjsTime";
import { CnsCard } from "../Details";
import { BindTips } from "../../../components/BIndTips";
import { ZERO_ADDRESS,IPSNftAddress } from "../../../constants";
import useMediaQuery from "@mui/material/useMediaQuery";

import { ReactComponent as RanTricon } from "../../../asstes/app/rantricon.svg";

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

export interface ListType {
	tokenId: BigNumberish, // tokenid 
	coord?: string[], // 坐标[x, y, z]
	cnsName?: string, // cns name
	cnsTerm?: string, // cns 有效期,
	info?: string, // info
}

// const Container = styled.div`
// 	width: 100%;
// 	height: 100%;
// 	padding: 0 70px;
// `

const Container = styled.div<{ isMobile?: boolean }>`
  width: ${({ isMobile }) => (isMobile ? "92%" : "90%;")};
  height: 100%;
  text-align: ${({ isMobile }) => (isMobile ? "" : "center;")};
  margin: 0 auto;
  text-align: left;
  padding-bottom: 30px;
`;

const Title = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: #005f7d;
`;

export const CopyIcon = styled(ContentCopyIcon)`
  margin: 0 16px;
  color: #5384fe;
  opacity: 0.8;
  cursor: pointer;
`;

const Details = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const Item = styled(FlexCCBox)`
  margin-top: 20px;
  width: 100%;
`;

const CefontSize = styled.div<{ isMobile?: boolean }>`
  font-size: ${({ isMobile }) => (isMobile ? "initial" : "20px")};
  display: inline;
  margin-top: 30px;
`;

export default function Bind() {
  const ismobile = useMediaQuery("(min-width:980px)");
  const ipsTips = useIpsTips();
  const locationState = useLocation();

  const { account } = useWeb3React<Web3Provider>();

  const searchContextData = useContext<SearchContextData>(SearchContext);
  const ipsBaseCoordinateBindContract = useIPSBaseCoordinateBindContract();
  const ipsCns = useIPSCNSRegisterarControllerContract();

  const [cnsName, setCnsName] = useState(searchContextData?.searchState || "");
  const [cnsNameBinded, setCnsNameBinded] = useState("");

  const [cnsTime, setCnsTime] = useState(false);
  // coord verification
  const [coord, setCoord] = useState<string[]>([]);

  // verification
  const [verification, setVerification] = useState(false);

  const [createStatus, setCreateStatus] = useState(false);
  const [tokenId, setTokenId] = useState<DataType>(initData);
  const [contractAddress, setContractAddress] = useState<DataType>(initData);

  const [list, setList] = useState<ListType[]>([])

  const bindCns = useCallback(async () => {
    if (
      ipsBaseCoordinateBindContract &&
      !!tokenId?.default &&
      !!IPSNftAddress &&
      !!cnsName &&
      !!cnsTime
    ) {
      try {
 
        // 新功能
        let metaData = JSON.stringify({ tokenPage: "" });
        const info = await ipsBaseCoordinateBindContract.BindCNS(
          IPSNftAddress,
          tokenId.default,
          cnsName,
          metaData
        );
        
        // console.log("INFO", info);
        await info.wait();
        ipsTips(`TokenId ${tokenId.default} bind ${cnsName} SUCCESS`, {
          variant: "success",
        });
        setTimeout(() => {
          setCreateStatus(false);
        }, 2000);


      } catch (error) {
        ipsTips(`TokenId ${tokenId.default} bind ${cnsName} ERROR`, {
          variant: "error",
        });
        setTimeout(() => {
          setCreateStatus(false);
        }, 2000);
      }
    }
  }, [
    ipsBaseCoordinateBindContract,
    tokenId,
    contractAddress,
    cnsName,
    cnsTime,
  ]);

  const [iswarn,setIswarn] = useState(false);
  const verificationCallBack = useCallback(async () => {
    setIswarn(false)
    if (!cnsName) {
      ipsTips(t`Enter CNS name`, { variant: "warning" });
    } else {
      if (
        ipsCns &&
        ipsBaseCoordinateBindContract &&
        IPSNftAddress &&
        tokenId.default
      ) {
        const cnsTime = await ipsCns.nameExpires(cnsName);
        //console.dir(cnsTime)
        //console.dir('---w')
        const cnsCoord = await ipsBaseCoordinateBindContract.nameCoordinate(
          cnsName
        );
        const { x, y, z, metaverse } = cnsCoord;
        //console.dir(contractAddress.default)
        //console.dir('---123r-')
        const info = await ipsBaseCoordinateBindContract.getTokenCNS(
          IPSNftAddress,
          tokenId.default
        );
        let count = 0;

        const coord = [x.toString(), y.toString(), z.toString()];
        if (info) {
          setCnsNameBinded(info);
          ipsTips(`The tokenId ${tokenId.default} can be ${info}`, {
            variant: "warning",
          });
        } else {
          count++;
        }

        if (cnsTime.toString() === "0") {
          setCnsTime(false);
          setCoord([]);
          ipsTips(`The current domain name not register to cns add`, {
            variant: "warning",
          });
        } else {
          if (metaverse !== ZERO_ADDRESS) {

            setCoord(coord);
            setIswarn(true)
            ipsTips(
              `Current CNS name ${cnsName} bind coord [${coord.join(", ")}].`,
              { variant: "warning" }
            );
          } else {
            count++;
          }
          count++;
          setCnsTime(true);
        }
        setVerification(count === 3);
        if (count === 3) {
          ipsTips(
            `Current CNS name ${cnsName} Can bind tokenId ${tokenId.default}.`,
            { variant: "success" }
          );
        }
        setCreateStatus(false);
      }
    }
  }, [
    ipsCns,
    ipsTips,
    cnsName,
    ipsBaseCoordinateBindContract,
    contractAddress,
    tokenId,
  ]);

  useEffect(() => {
   // console.dir(11222)
   // console.dir(locationState)
    if (locationState?.state) {
      const tokenId = (locationState?.state as LocationType)?.tokenId ?? "";
      const contractAddress =
        (locationState?.state as LocationType)?.bindAddress.toString() ?? "";
      setTokenId({
        default: tokenId,
        isError: !tokenId,
      });
      setContractAddress({
        default: contractAddress,
        isError: !contractAddress,
      });
    }

    if (searchContextData?.searchState) {
      setCnsName(searchContextData?.searchState);
    }
    getCnsList()
  }, [locationState,searchContextData]);


  useEffect(() => {
    setVerification(false);
  }, [cnsName, tokenId, contractAddress, coord]);


  let newlist: ListType[] = []
	const getCnsList = useCallback(
		async () => {
			if (ipsCns) {
				const cnsLen = await ipsCns.balanceOf(account)
				let count = 0
				while (cnsLen.toNumber() > count) {
				 const reTokenId: BigNumberish = await ipsCns.tokenOfOwnerByIndex(account, BigNumber.from(count))
				 const infoName = await ipsCns.tokenName(reTokenId)
					newlist.push({coord: [], tokenId: reTokenId, cnsName: infoName, info: ""})
					count++;
				}
         setList(newlist)
			}
			
		},
		[ipsCns, account]
	)

  const selitem = (index:any) => {
    let item = list[index]
    if(item?.cnsName){
      setCnsName(item?.cnsName);
      setIsopen(!isopen)
      setIswarn(false)
      setCnsTime(false);
    }
  }

  const [isopen, setIsopen] = useState(false);
  const openlist = () => {
    setIsopen(!isopen)
  }

  return (
    <Main>
      <Container isMobile={ismobile}>
        <div className="bandcnstopbox boxShadow">
          <Title>
            <Trans>Your CNS: </Trans>
          </Title>
          <CnsCard className="mtmb15px" disabled={!!cnsTime}>
            <CopyBox
              textStyle={{ color: cnsTime ? (iswarn)?"#edc823":"#67C23A" : "rgb(222 222 222)" }}
              text={cnsName}
            />
            <div onClick={openlist} className="rbtn"><SelIcons/></div>
            <div className={isopen? "bindcnsbodylist open": "bindcnsbodylist"}>
              {
                !!list.length &&list.map((ritem,i) => {
                  return <div onClick={()=>{
                    selitem(i)
                  }} key={i}>{ritem.cnsName}</div>
                })
              }
            </div>
          </CnsCard>
          <div className={cnsTime? (iswarn)? "warnColor": "passColor": ""}>
            <span className="rmt10">
              <RanTricon />
            </span>
            <span className="cgrui">Current CNS name</span>
            <span className="pange"> {cnsTime? cnsName + ".ips": (cnsName!== '---')? cnsName :"---"} </span>
            <span className="cgrui">can be bound.</span>
          </div>
        </div>

        <Details>
          <div className="bandcnstopbox boxShadow">
            <Title>
              <Trans>Your VOXELS: </Trans>
            </Title>

            <Item>
              <TextField
                id="demo-helper-text-aligned"
                error={createStatus && tokenId.isError}
                label="TokenID"
                disabled={true}
                value={tokenId.default}
                placeholder="Please enter TokenID value"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ width: "100%" }}
                onChange={(e:any) => {
                  const val: string = e.target.value.trim() ?? "";
                  setTokenId({
                    default: val,
                    isError: !val,
                  });
                }}
              />
            </Item>

            <Item>
              <TextFieldContainer
                error={createStatus && contractAddress.isError}
                placeholder={t`Please enter NFT contract address`}
                id="demo-helper-text-aligned"
                label={t`NFT contract address`}
                disabled={true}
                value={IPSNftAddress}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e:any) => {
                  // const val: string = e.target.value.trim() ?? "";
                  // setContractAddress({
                  //   default: val,
                  //   isError: !val,
                  // });
                }}
              />
            </Item>

			<div className={cnsTime? (iswarn)? "mt15px warnColor": "mt15px passColor": "mt15px"}>
            <span className="rmt10">
              <RanTricon />
            </span>
            <span className="cgrui">Current Tokenld</span>
            <span className="pange"> {tokenId.default}</span>
            <span className="cgrui">can be bound.</span>
          </div>

            <Item>
              <CreateBtn
                disabled={true}
                onClick={() => {
                  if (!createStatus) {
                    setCreateStatus(true);
                    if (!verification) {
                      verificationCallBack();
                    } else {
                      bindCns();
                    }
                  }
                }}
              >
                {isPending(
                  { createStatus: createStatus },
                  "createStatus",
                  verification ? (
                    <Trans>Create</Trans>
                  ) : (
                    <Trans>verification</Trans>
                  )
                )}
              </CreateBtn>
            </Item>
          </div>
        </Details>
      </Container>
    </Main>
  );
}
