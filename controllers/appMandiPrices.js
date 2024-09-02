const MandiPrice = require("../models/mandiPrices"); // Adjust the path as needed

exports.getLatestMandiPrices = async (req, res) => {
  const { state, district, market, commodity, variety, grade } = req.query;
  console.log("mandi price backend hit");
  console.log(
    "mandi price backend values",
    state,
    district,
    market,
    commodity,
    variety,
    grade
  );

  try {
    const query = {};

    if (state) query.state = state;
    if (district) query.district = district;
    if (market) query.market = market;
    if (commodity) query.commodity = commodity;
    if (variety) query.variety = variety;
    if (grade) query.grade = grade;

    // Find the latest arrival_date in the query
    const latestMandiPrices = await MandiPrice.aggregate([
      { $match: query },
      { $sort: { arrival_date: -1 } }, // Sort by arrival_date in descending order
      { $limit: 1 }, // Limit to the latest entry
    ]);

    console.log("this is backend mandi price result", latestMandiPrices);

    if (latestMandiPrices.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No mandi price data found for the given criteria",
        error: {
          code: "MANDI_PRICE_NOT_FOUND",
          description: "No records found for the specified filters.",
        },
      });
    }

    res.status(200).send({
      success: true,
      message: "Latest mandi price data retrieved successfully",
      data: latestMandiPrices,
    });
  } catch (error) {
    console.error("Error fetching MandiPrice data:", error);
    res.status(500).send({
      success: false,
      message: "Error retrieving mandi price data",
      error: {
        code: "MANDI_PRICE_DATA_RETRIEVAL_ERROR",
        description: error.message,
      },
    });
  }
};
