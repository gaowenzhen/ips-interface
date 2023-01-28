import { Interface } from "@ethersproject/abi";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { Contract } from "@ethersproject/contracts";


import { IPSBaseCoordinateBindAddress, IPSCNSRegisterarControllerAddress, IPSCoordinateSystemAddress, IPSFactoryAddress, IPSMetAverseRegisterAddress, IPSNftAddress, RPC_URL } from "../constants";
import { IPSBaseCoordinateBindInterface, IPSCNSRegisterarControllerInerface, IPSCoordinateSystemInerface, IPSFactoryInerface, IPSMetAverseRegisterInerface, IPSNftInerface } from "../abi";

export const useSigner = () => {
	const { library, account } = useWeb3React<Web3Provider>();

	return useMemo(() => {
		if (!library) {
			return null;
		}
		if (!account) {
			return library;
		}

		return library?.getSigner(account).connectUnchecked() as any;
	}, [account, library]);
};

export const useContract = (address: string | undefined, abiInterface: Interface) => {
	const { library, account } = useWeb3React<Web3Provider>();
	const signer = useSigner();
	return useMemo(() => {
		if (!library || !account || !signer || !address) {
			return null;
		}
		return new Contract(address, abiInterface, signer);
	}, [address, account, library, abiInterface, signer]);
};

export const useIPSNftContract = () => {
	return useContract(IPSNftAddress, IPSNftInerface);
};

export const useIPSFactoryContract = () => {
	return useContract(IPSFactoryAddress, IPSFactoryInerface);
};

export const useIPSMetAverseRegisterContract = () => {
	return useContract(IPSMetAverseRegisterAddress, IPSMetAverseRegisterInerface);
};

export const useIPSCoordinateSystemContract = () => {
	return useContract(IPSCoordinateSystemAddress, IPSCoordinateSystemInerface);
};

export const useIPSCNSRegisterarControllerContract = () => {
	return useContract(IPSCNSRegisterarControllerAddress, IPSCNSRegisterarControllerInerface);
};

export const useIPSBaseCoordinateBindContract = () => {
	return useContract(IPSBaseCoordinateBindAddress, IPSBaseCoordinateBindInterface);
};
