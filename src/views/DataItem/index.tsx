import { useEffect, useState } from "react";

import { IPFS_PINT, IPSNftAddress, IPFS_IMGTESTURI } from "../../constants/index";

import { useNavigate } from "react-router-dom";

import coordInit from "../Home/components/coord.js";
import { useIPSMetAverseRegisterContract } from "../../hooks/useContract";

export default function DataItem(props: any) {
  const navigate = useNavigate();
  const ipsMetAverseRegisterContract = useIPSMetAverseRegisterContract();
  const { isMsg, itemObjet, isExternal } = props;

  const [iteminfo, setIteminfo] = useState({
    iframesrc: "",
    cnsCoord: "0,0,0",
    tokenId: "0",
    cnsname: "",
    contractAddress: "",
    bindAddress: "",
  });
  let tokenid = "";
  const [accountlen, setAccountlen] = useState("xxx");
  if (!!itemObjet) {
    tokenid = itemObjet.tokenId.toString();
  }

  const [coord, setCoord] = useState("");
  const [imgsrc, setImgsrc] = useState("");
  const [isextcont, setIsextcont] = useState<boolean | false>(isExternal);

  const [isReBinded, setIsReBinded] = useState(false);
  const [isReCreated, setIsReCreated] = useState(false);
  const [cbindAddress, setCbindAddress] = useState("");
  const reSetBtn = async (tokenid: any) => {
    const bindAddress = await ipsMetAverseRegisterContract?.getTokenMeta(
      IPSNftAddress,
      tokenid
    );

    const isBinded = await ipsMetAverseRegisterContract?.isBinded(bindAddress);
    const isCreated = await ipsMetAverseRegisterContract?.isCreated(
      bindAddress
    );
    setIsReBinded(isBinded);
    setIsReCreated(isCreated);
    setCbindAddress(bindAddress);
  };

  let dispose3d: any = null;
  useEffect(() => {
    
    if (!!tokenid && !!itemObjet.image) {
      reSetBtn(tokenid).then(() => {
 

        // 内部合约图片路径替换
        let imgsrc = itemObjet.image.replace(/^ipfs:\/\//, IPFS_PINT);
        let iframesrc = imgsrc.replace(/\.png|\.jpg/, ".html");

        // props.noimgpath 外部合约不替换
        if (!/https:\/\/ipfs\./g.test(IPFS_PINT) && props.noimgpath !== true) {
          iframesrc = IPFS_IMGTESTURI + tokenid + ".html"
          imgsrc = IPFS_IMGTESTURI + tokenid + ".png"
        }

        setImgsrc(imgsrc);
        let coord = itemObjet.coord;
        setCoord(coord);
        let account = itemObjet.bindAddress;
     

        setIteminfo({
          iframesrc: iframesrc,
          cnsCoord: coord,
          tokenId: tokenid,
          cnsname: "",
          contractAddress: IPSNftAddress?.toString() || "",
          bindAddress: account,
        });

      });
      // getcoord();
      return () => {
        if (dispose3d) {
          dispose3d.wordDestroy();
        }
      };
    }
  }, []);

  const [is3dDom, setIs3dDom] = useState(false);
  let stop = (
    <svg
      viewBox="0 0 1030 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3507"
      width="28"
      height="28"
    >
      <path
        d="M512 0C229.26 0 0 229.239 0 512c0 282.783 229.239 512 512 512 282.783 0 512-229.217 512-512 0.021-282.761-229.196-512-512-512z m0 958.843C265.213 958.843 65.178 758.787 65.178 512S265.235 65.178 512 65.178c246.83 0 446.843 200.035 446.843 446.822C958.864 758.787 758.83 958.843 512 958.843z"
        p-id="3508"
        fill="#1296db"
      ></path>
      <path
        d="M365.102 328.528h85.705v385.67h-85.705v-385.67zM536.512 328.528h107.13v385.67h-107.13v-385.67z"
        p-id="3509"
        fill="#1296db"
      ></path>
    </svg>
  );
  let play = (
    <svg
      viewBox="0 0 1025 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2527"
      width="28"
      height="28"
    >
      <path
        d="M512.268258 1022.835842c-68.658678 0-135.399619-13.564433-198.369591-40.316509-60.752236-25.809077-115.373446-62.712976-162.346233-109.685763-46.971763-46.971763-83.875662-101.592974-109.685763-162.346233C15.115619 647.517366 1.551186 580.777449 1.551186 512.118771S15.115619 376.719151 41.866671 313.74918c25.810101-60.752236 62.714-115.373446 109.685763-162.346233 46.972787-46.971763 101.593997-83.875662 162.346233-109.685763 62.969971-26.751052 129.710912-40.315485 198.369591-40.315485s135.398595 13.564433 198.368567 40.315485c60.752236 25.810101 115.373446 62.714 162.346233 109.685763 46.971763 46.972787 83.875662 101.593997 109.685763 162.346233 26.752076 62.969971 40.316509 129.710912 40.316509 198.369591s-13.564433 135.398595-40.316509 198.368567c-25.809077 60.75326-62.712976 115.37447-109.685763 162.346233-46.971763 46.972787-101.592974 83.876686-162.346233 109.685763C647.666853 1009.27141 580.925912 1022.835842 512.268258 1022.835842zM512.268258 50.548195c-62.018782 0-122.293887 12.247716-179.152287 36.403219-54.923257 23.333323-104.317532 56.709936-146.810821 99.204249s-75.870926 91.888588-99.204249 146.810821c-24.155503 56.8584-36.403219 117.133505-36.403219 179.152287 0 62.017758 12.247716 122.292863 36.403219 179.152287 23.333323 54.923257 56.709936 104.317532 99.204249 146.811845 42.493289 42.493289 91.888588 75.870926 146.810821 99.204249 56.8584 24.155503 117.133505 36.403219 179.152287 36.403219 62.017758 0 122.292863-12.247716 179.152287-36.403219 54.923257-23.333323 104.317532-56.71096 146.811845-99.204249 42.493289-42.494313 75.870926-91.888588 99.204249-146.811845 24.155503-56.8584 36.403219-117.133505 36.403219-179.152287s-12.247716-122.293887-36.403219-179.152287c-23.334347-54.923257-56.71096-104.317532-99.205273-146.810821-42.493289-42.493289-91.887565-75.870926-146.810821-99.204249C634.561121 62.795911 574.286016 50.548195 512.268258 50.548195z"
        p-id="2528"
        fill="#1296db"
      ></path>
      <path
        d="M425.042443 780.041915c-4.373014 0-8.775721-0.898971-12.922457-2.741965-11.492089-5.10714-18.918329-16.5337-18.918329-29.110084L393.201657 285.216568c0-12.522118 7.381189-23.929224 18.804678-29.059913 11.424512-5.130689 24.853792-3.069608 34.214152 5.248436l233.877934 207.8907c12.998224 11.554546 20.492041 28.154799 20.558593 45.545491s-7.299278 34.048283-20.207401 45.701121L446.404787 771.835474C440.438607 777.222135 432.787112 780.041915 425.042443 780.041915zM442.349177 323.719775l0 385.566545L647.51839 524.063417c3.492473-3.153567 4.001344-7.012591 3.993153-9.032716s-0.545731-5.875054-4.063801-9.002L442.349177 323.719775z"
        p-id="2529"
        fill="#1296db"
      ></path>
    </svg>
  );
  const [btnicon, setBtnicon] = useState(play);
  const play3d = () => {
    if (is3dDom) {
      if (dispose3d) {
        dispose3d.wordDestroy();
      }
      setIs3dDom(false);
      setBtnicon(play);
      dispose3d = null;
      return;
    }
    dispose3d = setIs3dDom(true);
    setBtnicon(stop);
    setTimeout(() => {
      coordInit({
        domId: "#item3d_" + itemObjet.tokenId,
        xyz: JSON.parse(itemObjet.coord),
        isclear: false,
      });
    }, 30);
  };

  const bindmeta = async () => {
    if (!isReBinded) {
      navigate("/binding/Meta", { state: iteminfo });
    } else {
      // 跳转入查看，绑定合约的全部nft
      let bindmetainfo = {
        address: cbindAddress,
        tokenId: iteminfo.tokenId,
        imgSrc: imgsrc,
        cnsCoord: iteminfo.cnsCoord,
      };
      navigate("/binding/contract", { state: bindmetainfo });
    }
  };

  const virtualball = () => {
    if (!isReCreated) {
      navigate("/binding/Virtualball", { state: iteminfo });
    } else {
      // 跳转入查看，绑定合约的全部nft
      let bindmetainfo = {
        address: cbindAddress,
        tokenId: iteminfo.tokenId,
        imgSrc: imgsrc,
        cnsCoord: iteminfo.cnsCoord,
      };
      // console.dir(bindmetainfo)
      navigate("/binding/contract", { state: bindmetainfo });
    }
    
  };

  return (
    <div
      className={
        props?.isMobile ? "ipsItemPc ipsdItem" : "ipsItemMobile ipsdItem"
      }
    >
      <div className="imgbox">
        {!is3dDom ? (
          <img
            onClick={() => {
              navigate("/spaceNFT/showMint", { state: iteminfo });
            }}
            src={imgsrc}
          />
        ) : (
          <div id={"item3d_" + itemObjet.tokenId} className="item3dDom"></div>
        )}

        {isextcont ? (
          ""
        ) : (
          <span onClick={play3d} className="paly3d">
            {btnicon}
          </span>
        )}
      </div>
      <div className="textbox">
        <div className="trow">
          <span>TokenId</span>
          <span>{tokenid}</span>
        </div>
        <div className="trow">
          <span>CROOD</span>
          <span>{coord}</span>
        </div>
        {isMsg === true ? (
          <div className="trow msgbtnbox">
            {(isReBinded || !isReBinded) && !isReCreated ? (
              <span onClick={bindmeta}>Binding Meta</span>
            ) : (
              <span></span>
            )}
            {(isReCreated || !isReCreated) && !isReBinded ? (
              <span onClick={virtualball}>Virtual ball</span>
            ) : (
              <span></span>
            )}
          </div>
        ) : (
          <div className="trow setUitem">Owned by {itemObjet.name}</div>
        )}
      </div>
    </div>
  );
}
