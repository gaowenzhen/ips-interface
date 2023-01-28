import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as SearchIcons } from "../../asstes/app/bindshe.svg";
import useIpsTips from "../../hooks/useIpsTips";
import {
  useIPSFactoryContract,
  useIPSMetAverseRegisterContract,
} from "../../hooks/useContract";
import { ZERO_ADDRESS, IPSNftAddress } from "../../constants";
import Web3 from "web3";
import ERC721ABI from "./erc721abi.json";

// import axios from "axios";
import Modal from "@mui/material/Modal";

export default function BindMeta() {

  // 合约绑定
  let ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract();
  // 写入绑定
  const ipsFactoryContract = useIPSFactoryContract()

  const web3 = new Web3(window.ethereum);
  const ipsTips = useIpsTips();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [imgSrc, setImgSrc] = useState("");
  const [address, setAddress] = useState("");
  const [isContractBtn, setIsContractBtn] = useState(false);
  const [isGetContractLoad, setIsGetContractLoad] = useState(false);
  const [state, setSate] = useState({
    iframesrc: "",
    cnsCoord: "0,0,0",
    tokenId: "0",
    cnsname: "",
    contractAddress: "",
    bindAddress: "",
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (locationState?.state) {
      let { iframesrc } = locationState?.state;
      setSate(locationState?.state);
      let imgsrc = iframesrc.replace(".html", ".png");
      setImgSrc(imgsrc);
    }
  }, []);

  // 点击bind后
  const bindaction = () => {
    // 非地址，退出
    if (!isContractBtn) {
      return;
    }
    reProStart();
    setIsGetContractLoad(true);
    // 发起721合约验证
    bindContract();
  };

  const bindContract = async () => {
    if (web3.utils.isAddress(address) && ipsMetAverseRegisterContract && ipsFactoryContract) {
      // 检查合约地址是否在ips上绑定过,
      // 拿tokenid和ips的合约地址去查，不是用户填写的合约地址
      const bindAddress = await ipsMetAverseRegisterContract?.getTokenMeta(
        IPSNftAddress,
        state?.tokenId
      );
      const isBinded = await ipsMetAverseRegisterContract?.isBinded(bindAddress);
     
      if (!isBinded) {

        let abiobj: any = ERC721ABI;
        await window.ethereum.enable();
        const ctr = new web3.eth.Contract(abiobj, address);
        const ERC721InterfaceId: string = "0x80ac58cd";
        if (ctr) {
          try {
            const iserc721 = await ctr.methods
              .supportsInterface(ERC721InterfaceId)
              .call();
            // 是721,跳入
            if (iserc721) {

              // 写入绑定到合并合约内
              // console.dir(state?.tokenId)
              // console.dir(IPSNftAddress)
              // console.dir(address)
              // console.log('---xxx--')
              // 0x19cf5a3f5724b05ea971d87401eb7292419e1453
              
              // 关联合约错误
              const info = await ipsFactoryContract.bind(state?.tokenId, IPSNftAddress, address)
							await info.wait()


              // 跳转入查看，绑定合约的全部nft
                let bindmetainfo = {
                  address: address,
                  tokenId: state.tokenId,
                  imgSrc: imgSrc,
                  cnsCoord: state.cnsCoord,
                };
                navigate("/binding/contract", { state: bindmetainfo });
              
            }
            clearbind()
          } catch (error) {
            clearbind()
            ipsTips(`NO ERC721 Contract ERROR`, { variant: "error" });
          }
        }
      } else {
        clearbind()
        ipsTips(`The contract address has been bound`, { variant: "error" });
      }
    }
  };

  const clearbind = () => {
    setIsGetContractLoad(false);
    setIsContractBtn(false);
    if (!!timer) {
      clearInterval(timer);
    }
  }

  // 检查input输入，地址是否有效
  const contractChange = (e: any) => {
    let addsrc = e.target.value;
    if (addsrc && web3.utils.isAddress(addsrc)) {
      let contractpmint = web3.eth.getCode(addsrc);
      contractpmint.then(() => {
        setIsContractBtn(true);
        setAddress(e.target.value);
      });
    }
  };

  const closeModal = () => {
    setIsGetContractLoad(false);
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

  // 旧版
  // http://122.228.226.116:3024/
  return (
    <div className="binmetabox">
      <div className="indexItem ipsItemPc">
        <div className="imgbox">
          <img src={imgSrc} />
        </div>
        <h3>YOUR SPACE NFT</h3>
        <h4>TokenID:{state?.tokenId} Unbound</h4>
      </div>
      <div className="contSearch">
        <div className="inputbox">
          <SearchIcons />
          <input
            onChange={contractChange}
            placeholder="Enter a contract address"
            type="text"
          />
        </div>
        <div
          onClick={bindaction}
          className={isContractBtn ? "searchbtn setbgcolor" : "searchbtn"}
        >
          <span>Bind</span>
        </div>
      </div>
      <Modal open={isGetContractLoad} onClose={closeModal}>
        <div className="Modalbody">
          <div className="logdinbox">
            <CircularProgress
              size={68}
              variant="determinate"
              value={progress}
            />
            <div className="lodintxt">Waiting for the binding...</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
