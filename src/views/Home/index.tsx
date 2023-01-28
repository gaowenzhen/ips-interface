import {useEffect} from "react";
import coordInit from "./components/coord.js";
import Auction from "./components/auction"
import IPSIntroduce from "./components/ips-Introduce"
import SellaDlforEth from "../../components/sellaDlforEth"
import Mindmap from "./components/mindmap"


export default function Home() {

	useEffect(() => {
		// 单个nft点入
		// coordInit({domId:'.canvasbox', xyz: ["122","434","555"], isclear: false})
		coordInit({domId:'.canvasbox', xyz: '', isclear: false})
   }, []);
	
	return (<>
	 <div className="kmRSNz"></div>
	 <div className="topmt68px"></div>
	 <div className="canvasbox"></div>
	 <div className="onCanvarEvent"></div>
	 <div className="blankboxh120"></div>
     <Auction/>
	 <IPSIntroduce/>
	 <SellaDlforEth/>
	 <Mindmap/>
	</>)
}
