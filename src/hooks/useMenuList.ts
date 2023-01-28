import { useState } from "react";

import { t } from "@lingui/macro";

import SpaceNFTIcons from "../asstes/images/Group.png";
import CnsIcons from "../asstes/images/Groupqri.png";
import docsicon from "../asstes/images/docs.png";
import walleticon from "../asstes/images/walleticon.png";
import langicons from "../asstes/images/langicons.svg";

export default function useMenuList() {
 
	
    let mobile = [{
		text: t`SPACE`,
		Icons: SpaceNFTIcons,
		url: "/spaceNFT",
		isShowsub: false,
		id: 'spacenft'
	}, {
		text: t`CNS`,
		Icons: CnsIcons,
		url: "/cns",
		isShowsub: false,
		id: 'cns'
	},{
		text: t`Docs`,
		Icons: docsicon,
		url: "/c/",
		isShowsub: false,
		id: 'docs'
	}]

	let doces = [{
		text: t`My Wallet`,
		Icons: walleticon,
		url: "",
		isShowsub: false,
		id: 'MyWallet'
	}, {
		text: t`Language`,
		Icons: langicons,
		url: "",
		isShowsub: false,
		id: 'Lang'
	}]


	if (!window?.mobileCheck()) {
		const [state] = useState(mobile)
       return state
	}else{
		const [state] = useState(mobile.concat(doces))
		return state
	}
}
