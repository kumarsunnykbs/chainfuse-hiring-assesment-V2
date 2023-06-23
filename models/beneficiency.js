const mongoose = require("mongoose");

const schema = mongoose.Schema({
  bank_account_holdername: String,
  bank_country: {type: String, default: "pending"},
  currency: String,
  name: String,
  bicswift: {type: Number, default: 0},
  iban: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Beneficiency", schema);
