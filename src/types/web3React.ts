import { AbstractConnector } from "@web3-react/abstract-connector";

export type ActivateType = (
	connector: AbstractConnector,
	onError?: (error: Error) => void,
	throwErrors?: boolean
) => Promise<void>;

export interface Web3ReactManagerFunctions {
	activate: ActivateType;
	setError: (error: Error) => void;
	deactivate: () => void;
}
