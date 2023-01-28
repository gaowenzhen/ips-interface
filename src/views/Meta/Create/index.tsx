import { t, Trans } from "@lingui/macro";
import { Paper, TextField } from "@mui/material";
import { BigNumber, BigNumberish } from "ethers";
import { InputHTMLAttributes, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FlexCCBox } from "../../../components/FlexBox";
import { useIPSFactoryContract, useIPSMetAverseRegisterContract } from "../../../hooks/useContract";
import useIpsTips from "../../../hooks/useIpsTips";
import { isPending } from "../../../utils/isPending";
import { LocationType } from "../../../views/Coord/Create";
import { TextFieldContainer } from "../../../views/SpaceNFT/Mint";
import { ReactComponent as AlertIcons } from "../../../asstes/app/alert.svg";

import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { IPSNftAddress } from "../../../constants/index";

import styled from "styled-components";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
// import FormControl from '@mui/material/FormControl';
import VitemItems from "./vitemitems.json";

const Main = styled(FlexCCBox)`
  width: 100%;
  height: 100%;
`;

const Item = styled(FlexCCBox)`
  width: 100%;
  margin-top: 20px;
  padding: 0 20px;
`;

const CreateBtn = styled(FlexCCBox)<{ disabled?: boolean }>`
  padding: 6px 35px;
  background: ${({ disabled }) => (disabled ? "#706EFF" : "#DAE2EA")};
  color: #ffffff;
  white-space: nowrap;
  border: 1px solid #bed6dd;
  border-radius: 9px;
  margin-left: 24px;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? "1" : "0.2")};
`;

const FormBtn = styled(FlexCCBox)<{ reStyle?: boolean }>`
  padding: 6px 35px;
  background: ${({ reStyle }) => (reStyle ? "#706EFF" : "")};
  color: ${({ reStyle }) => (reStyle ? "#ffffff" : "#706EFF")};
  white-space: nowrap;
  border: 1px solid #706eff;
  border-radius: 12px;
  cursor: pointer;
`;

export interface StrType {
  isError: boolean;
  default: string;
}

export interface StrOrNumType {
  isError: boolean;
  default: string | Number;
}

export interface BigNAndStrAndNumType {
  isError: boolean;
  default: string | number | BigNumberish;
}

export interface MetaNFTType {
  metaName: StrType;
  metaKey: StrType;
  auctionNum: StrOrNumType;
  mintNum: StrOrNumType;
  issueNum: StrOrNumType;
  tokenId: StrOrNumType;
  contractAddress: StrType;
}

type KeyWord =
  | "metaName"
  | "metaKey"
  | "auctionNum"
  | "mintNum"
  | "issueNum"
  | "tokenId"
  | "contractAddress";
export const initData: StrType = {
  default: "",
  isError: true,
};

export interface FormDataItemType {
  key: KeyWord;
  type?: InputHTMLAttributes<unknown>["type"];
  placeholder: string;
  label: string;
  isDisabled: boolean;
}

const FormData: FormDataItemType[] = [
  {
    key: "metaName",
    placeholder: t`Please enter your meta name`,
    label: t`Meta Name`,
    isDisabled: false,
  },
  {
    key: "metaKey",
    placeholder: t`Please enter your meta KEY`,
    label: t`Meta KEY`,
    isDisabled: false,
  },
  {
    key: "auctionNum",
    type: "number",
    placeholder: t`Please enter in the amount of space allowed for auction in your current metauniverse`,
    label: t`Number of auctions`,
    isDisabled: false,
  },
  {
    key: "mintNum",
    type: "number",
    placeholder: t`Please enter the number of MINT meta space NFT that the wallet can contain`,
    label: t`Wallet MINT number`,
    isDisabled: false,
  },
  {
    key: "issueNum",
    type: "number",
    placeholder: t`Please enter the number of NFTs in the wallet's issuing meta universe`,
    label: t`Number of wallets issued`,
    isDisabled: false,
  },
  {
    key: "tokenId",
    type: "number",
    placeholder: t`Please enter TokenID value`,
    label: "TokenID",
    isDisabled: true,
  },
  {
    key: "contractAddress",
    placeholder: t`Please enter NFT contract address`,
    label: t`NFT contract address`,
    isDisabled: true,
  },
];

const MetaNFTInit: MetaNFTType = {
  metaName: initData,
  metaKey: initData,
  auctionNum: initData,
  mintNum: initData,
  issueNum: initData,
  tokenId: initData,
  contractAddress: initData,
};

export interface VirtalItem {
  Id: number;
  value: number;
  label: string;
  isSel: boolean;
}

export default function Virtualball() {
  const ipsTips = useIpsTips();
  const navigate = useNavigate();
  const ipsFactoryContract = useIPSFactoryContract();
  const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract();
  const { state } = useLocation();
  const [isCreate, setIsCreate] = useState(false);
  const [createStatus, setCreateStatus] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [contractAddress, setContractAddress] = useState("");

  const [virtualLayerList, setVirtualLayerList] = useState<VirtalItem[]>([]);

  const [sleindex, setSleindex] = useState(0);

  const [data, setData] = useState<MetaNFTType>(MetaNFTInit);

  const createMetaBtn = () => {
	setIsGetContractLoad(true);
  }

  const createMeta = useCallback(async () => {
    const {
      metaName,
      metaKey,
      auctionNum,
      mintNum,
      issueNum,
      tokenId,
      contractAddress,
    } = data;

    if (!!ipsFactoryContract) {
      console.log(
        "INFO",
        metaName,
        metaKey,
        auctionNum,
        mintNum,
        issueNum,
        tokenId,
        contractAddress
      );
      try {
        const info = await ipsFactoryContract.createMetaverse([
          metaName.default.trim(),
          metaKey.default.trim(),
          BigNumber.from(auctionNum.default), // 拍卖数量
          BigNumber.from(mintNum.default), // 钱包mint数量
          BigNumber.from(issueNum.default), // 钱包发行总量
          tokenId.default,
          contractAddress.default.trim(),
        ]);
        // console.log("INFO", info);
        await info.wait();
        ipsTips(t`Create ERROR`, { variant: "success" });
        setData(MetaNFTInit);
        // setTimeout(() => {
        //   setCreateStatus(false);
        // }, 2000);

	  // 创建成功后关闭
      closeModal()
	  clearInterval(timer)
	  setCreateStatus(false);
    // console.dir(state)
    const bindAddress = await ipsMetAverseRegisterContract?.getTokenMeta(
      IPSNftAddress,
      tokenId.default
    );
    state["address"] = bindAddress
    // 跳转入
    navigate("/binding/contract", { state: state });

      } catch (error) {
        ipsTips(t`Create ERROR`, { variant: "error" });
        // setTimeout(() => {
        //   setCreateStatus(false);
        // }, 2000);
		closeModal();
		clearInterval(timer);
		setCreateStatus(false);
		
      }
    }
  }, [ipsFactoryContract, data]);

  useEffect(() => {
    const {
      metaName,
      metaKey,
      auctionNum,
      mintNum,
      issueNum,
      tokenId,
      contractAddress,
    } = data;

    setIsCreate(
      !!metaName.default &&
        !!metaKey.default &&
        !!Number(auctionNum.default) &&
        !!Number(mintNum.default) &&
        !!Number(issueNum.default) &&
        !!tokenId.default &&
        !!contractAddress.default
    );
  }, [data]);

  useEffect(() => {
    if (state) {
      setTokenId((state as LocationType)?.tokenId.toString() ?? "");
      setContractAddress(
        (state as LocationType)?.contractAddress.toString() ?? ""
      );
      setVirtualLayerList(VitemItems);
    }
  }, [state]);

  useEffect(() => {
    if (isCreate) {
      setCreateStatus(!isCreate);
    }
  }, [isCreate]);

  useEffect(() => {
    setData({
      ...data,
      tokenId: {
        default: tokenId,
        isError: !tokenId,
      },
      contractAddress: {
        default: contractAddress,
        isError: !contractAddress,
      },
    });
  }, [tokenId, contractAddress]);

  const [isGetContractLoad, setIsGetContractLoad] = useState(false);
  const closeModal = () => {
    setIsGetContractLoad(false);
  };

  const handleChange = (e: any) => {
    let index = parseInt(e.target.value) - 1;
    setSleindex(index);
  };

  const [isloadin, setIsloadin] = useState(false);
  const [progress, setProgress] = useState(0);

  // 确定按钮
  const haedConfirm = () => {
    setIsloadin(true);
	reProStart();
	createMeta();
  };

  let timer: any;
  const reProStart = () => {
    if (!!timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 1200);
  };

  return (
    <Main>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 0",
          minWidth: "80%",
          width: "92%",
        }}
      >
        {FormData.map((item, idx) => (
          <Item key={idx}>
            <TextFieldContainer
              error={!!data[item.key]?.isError && createStatus}
              helperText={item.placeholder}
              id="demo-helper-text-aligned"
              label={item.label}
              type={item.type}
              disabled={item.isDisabled}
              value={data[item.key]?.default}
              onChange={(e: any) => {
                let val: string | number = e.target.value.trim() ?? "";
                if (item.type === "number" && !!val) {
                  val = Number(val);
                  if (val <= 0) {
                    val = 1;
                  }
                }
                setData({
                  ...data,
                  [item.key]: {
                    default: val,
                    isError: !val,
                  },
                });
              }}
            />
          </Item>
        ))}
        <Item>
          <CreateBtn
            disabled={isCreate}
            onClick={() => {
              if (!createStatus) {
                setCreateStatus(true);
                if (isCreate) {
				  createMetaBtn();
                }
              }
            }}
          >
            {isPending(
              { createStatus: createStatus && isCreate },
              "createStatus",
              <Trans>Create</Trans>
            )}
          </CreateBtn>
        </Item>
      </Paper>
      <Modal open={isGetContractLoad} onClose={closeModal}>
        {!isloadin ? (
          <div className="createconetbody">
            <div className="c">
              <div className="t">
                <span>
                  <AlertIcons />
                </span>
                <span>
                  Are you sure you want to build the virtual ball to do?
                </span>
              </div>
              <div className="tc">
                Choose the number of space NFTS you build.
              </div>
              <div className="selbody">
                <div className="sle">
                  <Select
                    size="medium"
                    className="s"
                    value={sleindex}
                    onChange={handleChange}
                  >
                    {virtualLayerList.map((ritem) => {
                      return (
                        <MenuItem key={ritem.Id} value={ritem.Id}>
                          {ritem.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </div>
                <div className="show">
                  {virtualLayerList[sleindex]
                    ? virtualLayerList[sleindex].value
                    : "1"}{" "}
                  Space NFT
                </div>
              </div>
              <div className="btn">
                <FormBtn onClick={closeModal} reStyle={false}>
                  Cancel
                </FormBtn>
                <FormBtn onClick={haedConfirm} reStyle={true}>
                  Confirm
                </FormBtn>
              </div>
            </div>
          </div>
        ) : (
          <div className="Modalbody">
            <div className="logdinbox">
              <CircularProgress
                size={68}
                variant="determinate"
                value={progress}
              />
              <div className="lodintxt">
                Wait for the virtual ball to be created ...
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Main>
  );
}
