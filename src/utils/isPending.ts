import { t } from "@lingui/macro";
import { ReactElement, ReactNode } from "react";

export const isPending = (pendingData: { [key: string]: boolean }, type: string, defaultText: ReactNode) => {
	return pendingData[type] ? t`Pending...` : defaultText;
};