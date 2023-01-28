const Web3 = require("web3");

async function main() {
    const abi = require("./ipsabi.json")
    require("dotenv").config();
    const { API_URL, PRIVATE_KEY } = process.env;
    // const { createAlchemyWeb3 } = require("web3");

    const web3 = new Web3(API_URL)
    const myAddress = "0x19ada4b335b601cccbd06c8d2adc497a6e6660ef" //TODO: replace this address with your own public address
    const contract = "0x47b2eDdabC5a2D8847990b6530D3b44Ec15550D4"

    // console.log(token2)
    // nonce starts counting from 0

    const ctr = new web3.eth.Contract(abi, contract)
    console.log("contract-------->", ctr)
    const auctionSaleStart = await ctr.methods.saleConfig().call();
    const auctionSaleStartTime = auctionSaleStart.auctionSaleStartTime
    console.log("auctionSaleStartTime:::", auctionSaleStartTime)
    const amount = await ctr.methods.getAuctionPrice(auctionSaleStartTime).call();
    console.log("amount:::", amount)
    const nonce = await web3.eth.getTransactionCount(myAddress, "latest");

    const transaction = {
        "to": contract, // faucet address to return eth
        // "value": 0, // 1 ETH
        "gas": 300000,
        "nonce": nonce,
        "value": amount,
        // "data": ctr.methods.getbalance(fromtoken).encodeABI()
        "data": ctr.methods.auctionMint(1).encodeABI()
        // optional data field to send message or execute smart contract
    };

    var call = ctr.methods.auctionMint(1)
    call.estimateGas({ from: myAddress, value: amount })
        .then(async (result) => {
            //.then是接收正确返回的信息
            console.log(result) // {...}
            const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
            web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
                if (!error) {
                    console.log("🎉 The hash of your transaction is: ", hash);
                } else {
                    console.log("❗Something went wrong while submitting your transaction:", error)
                }
            });
        })
        .catch(err => {
            // .catch 返回报错信息
            console.log(err)
        })
        .finally(async () => {
            // await main();
            console.log("finish")
        })
}

main();