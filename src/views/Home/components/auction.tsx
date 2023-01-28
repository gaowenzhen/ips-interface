import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Modal from "@mui/material/Modal";
import { t, Trans } from "@lingui/macro";
import CircularProgress from "@mui/material/CircularProgress";
import useIpsTips from "../../../hooks/useIpsTips";

// import { createCoordRs } from "../../../utils/ipsCoordPayable";

import CoordAll from "../../../abi/coord10610.json";

import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ipsPublicMintNFTPayable } from "../../../utils/ipsMintNFTPayable";
import { IPSNFTContextData, IPSNFTContext } from "../../../hooks/useIPSNft";
import { useIPSNftContract } from "../../../hooks/useContract";

import iconds from "../../../asstes/images/vicond.png";
import Component240 from "../../../asstes/images/Component240.png";

export default function Auction() {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const IPSNFT = useContext<IPSNFTContextData>(IPSNFTContext);
  const ipsNftContract = useIPSNftContract();

  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [minitval, setMinitval] = useState("");
  const [coordRs, setCoordRs] = useState("[0,0,0]");
  const [ismint, setIsmint] = useState(false);
  const infotxt = "Your Mint count is less than or equal to 3";
  const [minitInfo, setMinitInfo] = useState(infotxt);

  // mini 变化时
  const MintInputChange = (e: any) => {
    let minvla = e.target.value.trim();
    if (!!minvla && /[1-3]/g.test(minvla)) {
      setMinitval(minvla);
    }
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

  const ipsTips = useIpsTips();
  const postconet = () => {
    let postval = Math.floor(Number(minitval));
    // ownerOf
    ipsNftContract
      ?.ownerOf(IPSNFT?.tokenall)
      .then(async () => {
        //console.dir('tokenid存在')
        let newindex = await ipsNftContract.totalSupply();
        getCoord(newindex);
        cleartime();
        ipsTips(t`has been cast`, { variant: "warning" });
      })
      .catch((err: any) => {

        // ipsNftContract.auctionMint()
        console.dir('tokenid不存在')
        ipsPublicMintNFTPayable(account, chainId, postval, coordRs)
          .then((res: any) => {
            // console.log("RES-ipspublic", res);
            ipsTips(t`MINT SUCCESS`, { variant: "success" });
            setTimeout(() => {
              cleartime();
              clearinput();
            }, 500);
          })
          .catch((err: any) => {
            // console.dir(err);
            ipsTips(t`MINT ERROR`, { variant: "error" });
            setTimeout(() => {
              cleartime();
            }, 500);
          });
      });
  };

  const clearinput = () => {
    let inputel: any = document.querySelector("#outlined-adornment-weight");
    if (inputel) {
      inputel.value = "";
      setMinitval("");
    }
  };

  const cleartime = () => {
    setIsOpen(false);
    if (!!timer) {
      clearInterval(timer);
    }
  };

  const handleMint = () => {
    // if(IPSNFT?.userBalance)
    if (!!minitval && coordRs && ismint) {
      setIsOpen(true);
      reProStart();
      postconet();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // account 账户为空？
    if (!account || typeof account === "undefined") {
      setMinitInfo("no wallet installed");
      setIsmint(false);
      return;
    }

    // 余额不够
    if (IPSNFT?.userBalance === "0" || !IPSNFT?.userBalance) {
      setMinitInfo("Insufficient wallet balance");
      setIsmint(false);
      return;
    }

    // 已经mint 过
    const nftLen = IPSNFT?.ipsNft;
    if (!nftLen) {
      setIsmint(false);
      return;
    }

    if (nftLen?.length > 2) {
      setMinitInfo("You have completed minting 3 coins");
      setIsmint(false);
      return;
    }
    // let indexcoordRs = CoordAll[(IPSNFT?.tokenall)];
    getCoord(IPSNFT?.tokenall);
    setIsmint(true);
    setMinitInfo(infotxt);
  }, [IPSNFT, account]);

  // 10610 随机获取一个
  const getCoord = (index: number) => {
    let indexcoordRs = CoordAll[index];
    setCoordRs(JSON.stringify(indexcoordRs));
  };

  return (
    <div className="auctionbox">
      <div className="itemw l"></div>
      <div className="itemw r">
        <div>
          <span>
            <img className="imgi" src={iconds} />
          </span>
          <span className="minit">Randomly selected Space NFT</span>
        </div>
        <div className="b">COORD {coordRs}</div>
        <div className="rowinputbox mb10px">
          <span className="inputbox">
            <FormControl size="small" variant="outlined">
              <OutlinedInput
                id="outlined-adornment-weight"
                onChange={MintInputChange}
                disabled={!ismint}
                startAdornment={
                  <InputAdornment position="end">
                    <img className="imgi" src={Component240} />
                  </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
              />
            </FormControl>
          </span>
          <span className="ml20 btnbox">
            <Button
              disabled={!ismint}
              onClick={handleMint}
              variant="contained"
              color="primary"
            >
              Place bid
            </Button>
          </span>
        </div>
        <div>
          <span>
            <img className="imgi" src={iconds} />
          </span>
          <span className="minit">{minitInfo}</span>
        </div>
      </div>
      <Modal open={isOpen} onClose={closeModal}>
        <div className="Modalbody">
          <div className="logdinbox">
            <CircularProgress
              size={68}
              variant="determinate"
              value={progress}
            />
            <div className="lodintxt">Waiting for signature...</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
