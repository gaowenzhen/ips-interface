const Web3 = require("web3");
const web3 = new Web3("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
var abi = require('ethereumjs-abi')
async function mint() {


    // const key = web3.utils.randomHex(32)
    const private_key = "0x3bbeb2ffb668f64650ba92b20313f559e6bd71208bc8074ac939078d14f91bd1"
    // console.log(key)
    // const myaddress = web3.eth.accounts.privateKeyToAccount(private_key).address
    // console.log(myaddress)

    // var hash = web3.utils.sha3("1223344");
    // console.log("hash",hash)
    var hash = "0x" + abi.soliditySHA3(
        ["uint256", "uint256", "uint256", "uint256"],
        [12, 23, 34, 4]
    ).toString("hex");

    console.log("hash",hash)
    // var wallethash = web3.utils.sha3("0xf3f25c50f9ba4e764e2f5e5d89512a49a62e8a0ba9c86eb95d0c0d7311c456e0");
    // console.log("wallethash",wallethash)
    var wallet = web3.eth.accounts.privateKeyToAccount(private_key);
    console.log("wallet",wallet)

    var messagehash = web3.eth.accounts.hashMessage(hash);
    console.log("messagehash",messagehash)

    var sig = web3.eth.accounts.sign(hash, private_key);
    console.log("sig", sig)

    var recover = web3.eth.accounts.recover(sig);
    console.log("recover", recover)

}

mint()