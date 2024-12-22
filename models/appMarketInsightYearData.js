const mongoose = require("mongoose");

const priceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, required: true },
});

const marketPriceSchema = new mongoose.Schema({
  state: { type: String, required: true },
  district: { type: String, required: true },
  market: { type: String, required: true },
  commodity: { type: String, required: true },
  prices: { type: [priceSchema], default: [] },
});

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);

module.exports = MarketPrice;
