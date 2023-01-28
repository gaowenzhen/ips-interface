
export const getAbiNetUrl = (chainId:any) => {
    let abiurl = ''
    let rpcurl = ''
    console.dir(chainId)
    switch (chainId) {
        case 80001:
          abiurl = "https://api.polygonscan.com/api?module=contract&action=getabi&address=";
          rpcurl = "https://rpc-mumbai.maticvigil.com"
          break;
        case 56:
          rpcurl = "";
          abiurl = "";
          break;
        default:
          break;
      }

    return {abiurl, rpcurl};
}