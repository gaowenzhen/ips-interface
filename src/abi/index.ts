import { Interface } from "@ethersproject/abi";

import IPSNftABI from "./IPS.json";
import IPSFactoryABI from "./IPSNFTFactory.json";
import IPSMetAverseRegisterABI from "./IPSMetaverseRegistrar.json";
import IPSCoordinateSystemABI from "./IPSCoordinateSystem.json";
import IPSBaseCoordinateBindABI from "./BaseCoordinateBind.json";
import IPSCNSRegisterarControllerABI from "./CNSRegistrarController.json";

export const IPSNftInerface = new Interface(IPSNftABI);
export const IPSFactoryInerface = new Interface(IPSFactoryABI);
export const IPSMetAverseRegisterInerface = new Interface(IPSMetAverseRegisterABI);
export const IPSCoordinateSystemInerface = new Interface(IPSCoordinateSystemABI);
export const IPSCNSRegisterarControllerInerface = new Interface(IPSCNSRegisterarControllerABI);
export const IPSBaseCoordinateBindInterface = new Interface(IPSBaseCoordinateBindABI);

