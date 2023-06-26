const cors = require("cors");
const express = require("express");
const router = require("./router");
const errors = require("./helpers/error");
const path = require("path");
const cookieParser = require("cookie-parser");
const { recoverPersonalSignature } = require("eth-sig-util");
const { bufferToHex } = require("ethereumjs-util");

require("dotenv").config();

const app = express();
app.use(cookieParser());
const nonceList = {};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/nonce", (req, res) => {
  const { walletAddress } = req.query;
  const nonce = String(Math.floor(Math.random() * 10000));
  // save the nonce on the server
  nonceList[walletAddress] = nonce;
  res.send({ nonce });
});

app.get("/verify", (req, res) => {
  const { walletAddress, signedNonce } = req.query;
  const nonce = nonceList[walletAddress];
  try {
    const hexNonce = bufferToHex(Buffer.from(nonce, "utf8"));
    const retrievedAddress = recoverPersonalSignature({
      data: hexNonce,
      sig: signedNonce,
    });

    if (walletAddress === retrievedAddress) {
      // logged in
      return res.cookie("walletAddress", walletAddress).send({ success: true });
    }
    throw false;
  } catch (err) {
    return res.send({ success: false });
  }
});

app.get("/check", (req, res) => {
  const { walletAddress } = req.cookies;
  if (walletAddress) {
    return res.send({ success: true, walletAddress });
  }
  return res.send({ success: false });
});

app.get("/logout", (req, res) => {
  res.clearCookie("walletAddress");
  res.send({ success: true });
});

app.use(express.json());
app.use(cors());

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});

app.use(errors);
