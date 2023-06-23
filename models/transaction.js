const mongoose = require("mongoose");

const schema = mongoose.Schema({
  mode: String,
  status: {type: String, default: "pending"},
  country: String,
  currency: String,
  amount: {type: Number, default: 0},
  userID: {type: mongoose.Schema.Types.ObjectId, ref: "User"},

  created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Transaction", schema);
