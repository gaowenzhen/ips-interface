import { ReactNode } from "react";
import { RouteProps } from "react-router-dom";

export interface CustomRouteItem {
	exact?: boolean;
	path?: string | "";
	mainTitle?: ReactNode;
	viceTitle?: ReactNode;
	component?: any;
	rightMenu?: ReactNode
}

// export interface CustomRouteComponentProps extends RouteProps, CustomRouteItem {
// 	parentPath?: string | "";
// 	routes?: CustomRouteItem[] | [];
// }

export type AttentionType = "success" | "warn" | "error" | "loading";
