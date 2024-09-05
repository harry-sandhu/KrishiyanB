const mongoose = require("mongoose");

const FpoOrganizationSchema = new mongoose.Schema({
  typeOfOrganization: {
    type: String,
    required: true,
  },
  nameOfFpo: {
    type: String,
    required: true,
  },
  typeOfFpo: {
    type: String,
    required: true,
  },
  dateOfFpo: {
    type: Date,
    default: Date.now,
  },
  organizationalEmail: {
    type: String,
  },
  contactNumber: {
    type: String,

    unique: true,
  },
  yourDesignation: {
    type: String,
  },
  promoterName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  RegistrationNumber: {
    type: String,
  },
  CBBOName: {
    type: String,
  },
});

module.exports = mongoose.model("FpoOrganization", FpoOrganizationSchema);
