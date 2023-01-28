import { CustomRouteItem } from "../types";

import RenderRoutes from "../components/RenderRoutes";

import Home from "../views/Home";

import SpaceNFT from "../views/SpaceNFT";
import SpaceNFTManage from "../views/SpaceNFT/Manage";
import SpaceNFTBind from "../views/SpaceNFT/Bind";
import SpaceNFTMint from "../views/SpaceNFT/Mint";
import SpaceNFTDetail from "../views/SpaceNFT/Detail";

// import Meta from "../views/Meta";
// Binding Virtual ball
import Virtualball from "../views/Meta/Create";
import MetaManage from "../views/Meta/manage";
import BindMeta from "../views/Meta";
import ContractIndex from "../views/Meta/contractindex"


import Coord from "../views/Coord";
import CoordCreate from "../views/Coord/Create";

import Cns from "../views/Cns";
import CnsManage from "../views/Cns/Manage";
import CnsBind from "../views/Cns/Bind";
import CnsDetails from "../views/Cns/Details";


import Dao from "../views/Dao";
// import Docs from "../views/Docs";

import UiTest from "../views/UiTest"

import SpaceNFTRightMenu from "../views/SpaceNFT/RightMenu";
import SpaceNFTDetailRightMenu from "../views/SpaceNFT/Detail/component/RightMenu";

import MintItem from "../views/mintitem";

import { Trans } from "@lingui/macro";


const base: CustomRouteItem[] = [
	{
		path: "",
		component: Home,
	},
	{
		exact: true,
		path: "home",
		component: Home,
	},
	{
		exact: true,
		path: "spaceNFT",
		component: SpaceNFT,
		mainTitle: <Trans>SPACE</Trans>,
		viceTitle: <Trans>Subtitle Description Subtitle Description</Trans>,
		rightMenu: <SpaceNFTRightMenu />
	}, 
	// {
	// 	exact: true,
	// 	path: "meta",
	// 	component: Meta,
	// 	mainTitle: <Trans>Meta</Trans>,
	// 	viceTitle: <Trans>Meta</Trans>,
	// 	rightMenu: <SpaceNFTDetailRightMenu />
	// },
	{
		exact: true,
		path: "meta/manage",
		component: MetaManage,
		mainTitle: <Trans>Manage Meta NFT</Trans>,
		viceTitle: <Trans>Subtitle Description Subtitle Description</Trans>,
		rightMenu: <div className="topeventh60"></div>
	},
	{
		exact: true,
		path: "coord",
		component: Coord,
		mainTitle: <Trans>Coord</Trans>,
		viceTitle: <Trans>Coord</Trans>,
		rightMenu: <SpaceNFTDetailRightMenu />
	},
	{
		exact: true,
		path: "coord/create",
		component: CoordCreate,
		mainTitle: <Trans>Create Coord</Trans>,
		viceTitle: <Trans>Create Coord</Trans>,
		rightMenu: <SpaceNFTDetailRightMenu />
	},
	{
		exact: true,
		path: "binding/Virtualball",
		component: Virtualball,
		mainTitle: <Trans>Binding Virtual ball</Trans>,
		viceTitle: <Trans>Binding Virtual ball Binding Virtual ball Binding Virtual ball</Trans>
	},
	{
		exact: true,
		path: "spaceNFT/detail",
		mainTitle: <Trans>NFT Details</Trans>,
		viceTitle: <Trans>NFT Details</Trans>,
		component: SpaceNFTDetail,
		rightMenu: <SpaceNFTDetailRightMenu />
	},
	{
		exact: true,
		path: "spaceNFT/manage",
		component: SpaceNFTManage,
		mainTitle: <Trans>Manage IPS NFT</Trans>,
		viceTitle: <Trans>Manage IPS NFT</Trans>,
		rightMenu: <div className="topeventh60"></div>
	},
	{
		exact: true,
		path: "spaceNFT/bind",
		mainTitle: <Trans>Binding Space NFT</Trans>,
		viceTitle: <Trans>Binding Space NFT</Trans>,
		component: SpaceNFTBind,
		rightMenu: <SpaceNFTDetailRightMenu />
	},
	{
		exact: true,
		path: "spaceNFT/mint",
		mainTitle: <Trans>Mint Space NFT</Trans>,
		viceTitle: <Trans>Mint Space NFT</Trans>,
		component: SpaceNFTMint,
		rightMenu: <SpaceNFTDetailRightMenu />
	},
	{
		exact: true,
		path: "spaceNFT/showMint",
		component: MintItem
	},
	{
		exact: true,
		path: "cns",
		mainTitle: <Trans>Create CNS</Trans>,
		viceTitle: <Trans>Describe in detail</Trans>,
		component: Cns,
		rightMenu: <div className="topeventh60"></div>
	},
	{
		exact: true,
		path: "binding/Meta",
		mainTitle: <Trans>Binding Meta</Trans>,
		viceTitle: <Trans>Meta in detail</Trans>,
		component: BindMeta
	},
	{
		exact: true,
		path: "binding/contract",
		component: ContractIndex
	},
	{
		exact: true,
		path: "cns/bind",
		component: CnsBind,
		mainTitle: <Trans>Binding CNS</Trans>,
		viceTitle: <Trans>Describe in detail .</Trans>
	},
	{
		exact: true,
		path: "cns/details",
		component: CnsDetails,
		mainTitle: <Trans>Details CNS</Trans>,
		viceTitle: <Trans>Describe in detail</Trans>,
		rightMenu: <div className="topeventh60"></div>
	},
	{
		exact: true,
		path: "cns/manage",
		mainTitle: <Trans>Manage CNS</Trans>,
		viceTitle: <Trans>Describe in detail</Trans>,
		component: CnsManage,
		rightMenu: <div className="topeventh60"></div>
	},
	{
		exact: true,
		path: "dao",
		component: Dao,
	},
	{
		exact: true,
		path: "uitest",
		component: UiTest,
	}
];

export const RoutesList = (): JSX.Element => {
	return <RenderRoutes routes={base} />;
};

