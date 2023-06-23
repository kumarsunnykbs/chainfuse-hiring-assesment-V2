const mongoose = require("mongoose");
const schema = mongoose.Schema({
  walletAddress: {type: String, required: true, unique: true},
  userName: String,
  userAvatar: String,
  email: String,
  signed: {type: Boolean, default: false},
  usd_balance: { type: Number, default: 0},
  native_balance: { type: Number, default: 0},
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  role: {type: String, default: "user"},
  jwt_token: String,
  socket_id: String,
});

module.exports = mongoose.model("User", schema);
