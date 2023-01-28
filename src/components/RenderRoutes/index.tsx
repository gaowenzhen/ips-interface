import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Navigate, Route, Routes } from "react-router-dom";
import { CustomRouteItem } from "../../types";
import AppContainer from "../../views/AppContainer";
import { useState,useEffect,useContext } from "react";
import { MOBILEContext } from "../../hooks/useMOBILEContext";
 

import NotFound from "../../views/NotFound";
import ConnectWallet from "../../views/ConnectWallet";
import Footer from "../Footer";
import Header from "../Header";
import LeftMenu from "../../views/LeftMenu";

const RenderRoutes = ({ routes = [] }: { routes: CustomRouteItem[] }): JSX.Element => {

	const [btnState, setBtnState] = useState(false);
	
	// const [headerkey,setHeaderkey] = useState('')
	// useEffect(() => {
	// 	//console.dir(btnState)
	// 	// setHeaderkey(new Date().getTime().toString())
	// 	console.dir('renderroutes')
	//   }, [btnState]);

	const { account } = useWeb3React<Web3Provider>();
	return (
		<Routes>
           					
			{routes.map((route: CustomRouteItem, i: number) => {
				const { component: RouteComponent, rightMenu: RightMenu, mainTitle, viceTitle, path } = route
			
				let recomponet: any = null

				if(window.mobileCheck()){
					recomponet = (<div data-rk><MOBILEContext.Provider value={{ btnState, setBtnState }}><Header/><LeftMenu btnState={btnState}/><RouteComponent /><Footer/></MOBILEContext.Provider></div>)
				 } else{
					recomponet = (<div data-rk><Header/><RouteComponent /><Footer/></div>)
				}

				return (
					<Route
						key={path}
						element={((path === "home" || !path) || path === "docs" || path === "dao" || path ==="uitest") ? recomponet : (!!account ? (RouteComponent ? <AppContainer mainTitle={mainTitle} viceTitle={viceTitle} rightMenu={RightMenu} children={<RouteComponent />} /> : <Navigate to="/home" />) : <AppContainer children={<ConnectWallet />} />)}
						path={"/" + path}
					/>
				);
			})}
			<Route path="*" element={<NotFound />} />
			
			
		</Routes>
	);
};

export default RenderRoutes
