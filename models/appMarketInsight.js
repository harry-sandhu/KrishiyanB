const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  state: { type: String },
  district: { type: String },
  market: { type: String },
  commodity: { type: String, required: true },
  todays_price: { type: Number },
  yesterdays_price: { type: Number },
  day_before_yesterday_price: { type: Number },
  todays_price_change: { type: Number, default: 0 },
  yesterdays_price_change: { type: Number, default: 0 },
  primarykey: { type: String },
});

priceSchema.pre("save", function (next) {
  this.todays_price_change = this.todays_price - this.yesterdays_price;

  this.yesterdays_price_change =
    this.yesterdays_price - this.day_before_yesterday_price;

  next();
});

module.exports = mongoose.model("Price", priceSchema);
