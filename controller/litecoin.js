const axios = require("axios");
var fetch = require("cross-fetch");
const litecoin = require("litecoinjs");
const bitcoinjs = require("bitcoinjs-lib");
var request = require("request");

const apiEndpoint = "https://api.blockcypher.com/v1/ltc/main";

const getRate = async (req, res) => {
  const result = await fetch(
    "https://api.coinbase.com/v2/exchange-rates?currency=ltc",
    {
      headers: {
        Authorization: "Bearer b6cbb9d4-4877-41eb-873e-ddfa02a1dfb7",
      },
    }
  );
  const data = await result.json();
  // extract exchange rate for LTC-USD
  const ltc_usd_rate = parseFloat(data.data.rates.USD);
  console.log(ltc_usd_rate);

  return res.json(ltc_usd_rate);
};

async function generateAccount() {
  try {
    const addressPair = await litecoinjs.newAddress();
    const address = addressPair.address; // Example
    const wif = addressPair.wif; // Example
    const publicKey = addressPair.publicKey; // Example
    return addressPair;
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
}
const getBlock = async (sender) => {
  const { data } = await axios.post(`${apiEndpoint}/txs/new`, {
    params: { token: process.env.BLOCKCYPHER_KEY },
  });
  //const hash = data.txs[0].hash;
  return data;
};
const get = async (req, res) => {
  try {
    const newAddress = await generateAccount();

    // const rate = await getRate();
    return res.send({ newAddress });
  } catch (error) {
    return res.send({ status: false, message: error });
  }
};
const confirm = async (req, res) => {
  try {
    const { sender } = req.body;

    const confirm = false;
    //const timer = setInterval(async () => {
    const { data } = await axios.get(`${apiEndpoint}/addrs/${sender}/full`, {
      params: { token: process.env.BLOCKCYPHER_KEY },
    });
    
    console.log(data);
    return res.send( data );
  } catch (error) {
    return res.json({ status: false, message: error });
  }
};
const contract = async (blockhash) => {
  // Initialize a private key from WIF
  // var privateKeyWIF = "T5Pf23vjphynCvdAJtXomGaGcYtWsoaPTghhvEEjQAsWGW7QVvM4";
  // var privateKey = litecoin.ECPair.fromWIF(privateKeyWIF);
  // console.log(privateKey);
  // // Initialize the Litecoin network
  // var network = litecoin.networks.litecoin;
  // // Initialize the transaction builder
  // var txb = new litecoin.TransactionBuilder(network);
  // // Add the input (who is paying):
  // // [previous transaction ID, index of the output to use]
  // var txId = blockhash;
  // var outputIndex = 0;
  // txb.addInput(txId, outputIndex);
  // // Add the output (who to pay to):
  // // [payee's address, amount in litoshis]
  // var payeeAddress = "ltc1q9ahr3h8kdarv0gr07maxgsf8fgdrdv63rkqxx9";
  // var amount = 10000;
  // txb.addOutput(payeeAddress, amount);
  // // Sign the transaction
  // txb.sign(0, privateKey);
  // // Build the transaction and convert it to hex
  // var tx = txb.build();
  // var txHex = tx.toHex();
  // // Broadcast the transaction to the Litecoin network
  // // e.g. using Blockcypher's API
  // // const { data } = await axios.POST(`${apiEndpoint}/txs/push`, {
  // //   params: { token: process.env.BLOCKCYPHER_KEY },
  // //   body: JSON.stringify({
  // //     tx: txHex,
  // //   }),
  // // });
  // request(
  //   {
  //     url: "https://api.blockcypher.com/v1/ltc/main/txs/push",
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       tx: txHex,
  //     }),
  //   },
  //   function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       console.log(body);
  //     } else {
  //       console.log(error);
  //     }
  //   }
  // );
  // try {
  //   await litecoin
  //     .newTransaction({
  //       network: "normal",
  //       wif: "T5Pf23vjphynCvdAJtXomGaGcYtWsoaPTghhvEEjQAsWGW7QVvM4",
  //       utxo: [
  //         {
  //           txid: blockhash,
  //           index: 1,
  //           amount: 100000, // unspent amount
  //         },
  //       ],
  //       output: [
  //         {
  //           address: "MNBpp4FsCF5vnogd8dhL9xRgKeqMWB8Xh3",
  //           amount: 10000,
  //         },
  //       ],
  //       fee: 1000, // transaction fee
  //     })
  //     .then((result) => {
  //       console.log(result);
  //     });
  // } catch (error) {
  //   console.error(`ERROR: ${error}`);
  // }
  // console.log(blockhash);
  // const keyPair = litecoinjs.ECPair.fromWIF(
  //   "T5Pf23vjphynCvdAJtXomGaGcYtWsoaPTghhvEEjQAsWGW7QVvM4",
  //   litecoinjs.networks.litecoin
  // );
  // const p2pkh = bitcoinjs.payments.p2pkh({
  //   pubkey: keyPair.publicKey,
  //   network: litecoinjs.networks.litecoin,
  // });
  // const tx = new bitcoinjs.TransactionBuilder(litecoinjs.networks.litecoin);
  // tx.addInput(blockhash, 0); // Previous transaction hash and output index
  // tx.addOutput("MNBpp4FsCF5vnogd8dhL9xRgKeqMWB8Xh3", 50000); // Sending 0.5 LTC
  // tx.sign(0, keyPair, p2pkh.redeemScript);
  // const hex = tx.build().toHex();
  // console.log(hex);
  // const rate = acontractwait getRate();
};
module.exports = {
  get,
  getRate,
  confirm,
};
