const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  bankName: {
    type: String,
  },
  accountName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  ifscCode: {
    type: String,
    required: true,
  },
  URL: {
    type: String,
    default: " ",
  },
});

module.exports = mongoose.model("BankDetails", BankDetailsSchema);
