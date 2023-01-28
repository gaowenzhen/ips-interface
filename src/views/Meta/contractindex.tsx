import { BigNumberish } from "ethers";
import ERC721ABI from "./erc721abi.json";
import { useLocation, useNavigate } from "react-router-dom";
import { Trans } from "@lingui/macro";
import { useContext, useEffect, useState } from "react";
import { IPSNFTContext, IPSNFTContextData } from "../../hooks/useIPSNft";

import { FlexCCBox, FlexSCBox } from "../../components/FlexBox";
import styled from "styled-components";
import useIpsTips from "../../hooks/useIpsTips";
// src/views/SpaceNFT/index.tsx
import { getMetaData } from "../SpaceNFT/getmetadata"
// import { IPFS_PINT } from '../../constants/index'

import MintItem from "../../views/mintitem";
import NoDataItem from "../noDataItem";
import DataItem from "../DataItem";
// import { ReactComponent as IpsShowico } from "../../asstes/app/ipsShowico.svg";
// import { ReactComponent as Ringrat } from "../../asstes/app/ringrat.svg";
// import { ReactComponent as Cnsicon } from "../../asstes/app/cnsicon.svg";
// import { ReactComponent as Timeicon } from "../../asstes/app/timeicon.svg";
import { ReactComponent as RefreshIcons } from "../../asstes/app/refresh.svg";
import { ReactComponent as ConettitneIcons } from "../../asstes/app/conettitne.svg";

import coordInit from "../Home/components/coord.js";

import Web3 from "web3";

export interface NftType {
  tokenId: BigNumberish;
  bindAddress: string;
  isBinded: boolean;
  isCreated: boolean;
  name: string;
}

export interface itemInfo {
  curl: string;
  address: string;
  tokenId: string;
  imgSrc: string;
  cnsCoord: string;
}

const NoDadatBody = styled(FlexCCBox)`
  width: 93%;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0px auto 0 6.5%;
  justify-content: start;
`;

const CoordinateText = styled(FlexSCBox)`
  flex: 1;
  padding: 9px 0;
  border-radius: 6px;
  margin: 0 12px;
  font-size: 18px;
  cursor: pointer;
  text-align: right;
  width: 160px;
  right: 0px;
  justify-content: end;
`;

const Refresh = styled(FlexCCBox)`
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 56px;
  right: 0px;
  justify-content: end;
`;

export default function ContractIndex() {
  const web3 = new Web3(window.ethereum);
  const { state: locationState } = useLocation();

  const [tokenall, setTokenall] = useState(0);
  const [conetName, setConetName] = useState("");
  const [isLodinend, setIsLodinend] = useState(false);

  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext);
  const ismobile = IPSNFT?.isMobile;
  // const uchainId = IPSNFT?.uchainId;

  const ipsTips = useIpsTips();

  // const navigate = useNavigate();
  const [state, setState] = useState<NftType[]>([]);

  const tokenId = (locationState as itemInfo)?.tokenId ?? "0";
  const coord = (locationState as itemInfo)?.cnsCoord ?? "0,0,0";
  const address = (locationState as itemInfo)?.address ?? "";
  // const curl = (locationState as itemInfo)?.curl ?? "";

  const GetCotnractData = async () => {
    if (web3.utils.isAddress(address)) {
      let abiobj: any = ERC721ABI;
      await window.ethereum.enable();
      const ctr = new web3.eth.Contract(abiobj, address);
      const ERC721InterfaceId: string = "0x80ac58cd";
      if (ctr) {
        try {

          const iserc721 = await ctr.methods
            .supportsInterface(ERC721InterfaceId)
            .call();
          if (iserc721) {

            const namers = await ctr.methods.name().call();
            setConetName(namers)
            const retokenall = await ctr.methods.totalSupply().call();
            setTokenall(retokenall);
            let items:any = []
            const rsUri = await ctr.methods.tokenURI(1).call();
 
            for (let r = 1; r < retokenall; r++) {

              let newurl = ''
              if (/ipfs:\/\//g.test(rsUri)) {
                 newurl = rsUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
                 newurl = newurl.replace('/1.json','')
                 newurl = newurl + '/' + r + '.json'
              }

              let item = {
                tokenId: r,
                ipfsUri: newurl,
                bindAddress: "",
                isBinded:false,
                isCreated: false
              }
              items.push(item);
              
              if (r > 15) {
                break
              }
            }
            // console.dir(items)
            getMetaData(items,true).then((newitem) => {
              setState(newitem)
            })
          }
        } catch (error) {
          ipsTips(`NO ERC721 Contract ERROR`, { variant: "error" });
        }

      }
    }
  };
  

  let dispose3d: any = null;
  useEffect(() => {
    if (coord) {
      setTimeout(() => {
        dispose3d = coordInit({
          domId: "#mact3d_" + tokenId,
          xyz: JSON.parse(coord),
          isclear: false,
        });
      }, 120);
      GetCotnractData();
      setIsLodinend(true)
    }

    return () => {
      if (dispose3d) {
        dispose3d.wordDestroy();
      }
    };
  }, [coord]);

  return (
    <>
      {isLodinend?<MintItem conetState={locationState} />:''}
      <div className="relistbtnbox">
        <div className="conettile"><span><ConettitneIcons/></span><span>{conetName}</span></div>
        <div className="dpyfliex">
          <CoordinateText>
          {tokenall}
          </CoordinateText>
          <Refresh
            onClick={() => {
              IPSNFT?.setIpsNftHash(+new Date() + "");
            }}
          >
            <RefreshIcons />
          </Refresh>
        </div>
      </div>
      <div className="listbody">
        {
          <NoDadatBody>
            {!state.length &&
              [1, 2, 3, 4, 5, 6].map((index) => {
                return <NoDataItem isMobile={ismobile} key={index} />;
              })}
            {!!state.length &&
              state.map((item, index) => {
                return (
                  <DataItem noimgpath={true} isExternal={true} itemObjet={item} isMobile={ismobile} key={index} />
                );
              })}
          </NoDadatBody>
        }
      </div>
    </>
  );
}