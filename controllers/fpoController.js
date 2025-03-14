const FpoOrganization = require("../models/appFPOUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

// Create a new FPO
exports.createFpo = async (req, res) => {
  try {
    const {
      typeOfOrganization,
      nameOfFpo,
      typeOfFpo,
      password,
      contactNumber,
      ...otherDetails
    } = req.body;

    console.log("Received request body:", req.body);

    if (!typeOfOrganization || !nameOfFpo || !typeOfFpo) {
      return res.status(400).send({
        success: false,
        message: "Missing required fields",
        error: {
          code: "MISSING_REQUIRED_FIELDS",
          description:
            "Please provide typeOfOrganization, nameOfFpo, and typeOfFpo.",
        },
      });
    }

    if (!contactNumber) {
      return res.status(400).send({
        success: false,
        message: "Contact number is required",
        error: {
          code: "CONTACT_NUMBER_REQUIRED",
          description: "The contact number field is missing in the request.",
        },
      });
    }

    const existingFpo = await FpoOrganization.findOne({ contactNumber });
    if (existingFpo) {
      return res.status(400).send({
        success: false,
        message: "Contact number already in use",
        error: {
          code: "DUPLICATE_CONTACT_NUMBER",
          description:
            "The contact number provided is already associated with another FPO.",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const fpoOrganization = new FpoOrganization({
      typeOfOrganization,
      nameOfFpo,
      typeOfFpo,
      contactNumber,
      password: hashedPassword,
      ...otherDetails,
    });

    await fpoOrganization.save();

    const token = jwt.sign(
      { contactNumber: fpoOrganization.contactNumber },
      JWT_SECRET
    );

    res.status(201).send({
      success: true,
      message: "FPO organization created successfully",
      data: { fpoOrganization, token },
    });
  } catch (error) {
    console.error("Error creating FPO:", error);
    res.status(400).send({
      success: false,
      message: "Error creating FPO",
      error: {
        code: "FPO_CREATION_ERROR",
        description: error.message,
      },
    });
  }
};

// Sign in

exports.signIn = async (req, res) => {
  const { contactNumber, password } = req.body;
  console.log("inside sign up");
  try {
    const fpoOrganization = await FpoOrganization.findOne({ contactNumber });

    if (!fpoOrganization) {
      return res.status(401).send({
        success: false,
        message: "Invalid login credentials",
        error: {
          code: "INVALID_CREDENTIALS",
          description: "The provided contact number is not registered.",
        },
      });
    }

    const isMatch = await bcrypt.compare(password, fpoOrganization.password);

    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid login credentials",
        error: {
          code: "INVALID_CREDENTIALS",
          description: "The provided password is incorrect.",
        },
      });
    }

    const token = jwt.sign(
      {
        contactNumber: fpoOrganization.contactNumber,
        password: fpoOrganization.password,
      },
      JWT_SECRET
    );

    res.send({
      success: true,
      message: "Login successful",
      data: { fpoOrganization, token },
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error during sign in",
      error: {
        code: "SIGNIN_ERROR",
        description: error.message,
      },
    });
  }
};

// Get all FPOs
exports.getAllFpos = async (req, res) => {
  try {
    const fpos = await FpoOrganization.find();
    res.status(200).send(fpos);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a specific FPO by ID
exports.getFpoById = async (req, res) => {
  try {
    const fpo = await FpoOrganization.findById(req.params.id);
    if (!fpo) {
      return res.status(404).send();
    }
    res.status(200).send(fpo);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a specific FPO by ID
exports.updateFpoById = async (req, res) => {
  try {
    const fpo = await FpoOrganization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!fpo) {
      return res.status(404).send();
    }
    res.status(200).send(fpo);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a specific FPO by ID
exports.deleteFpoById = async (req, res) => {
  try {
    const fpo = await FpoOrganization.findByIdAndDelete(req.params.id);
    if (!fpo) {
      return res.status(404).send();
    }
    res.status(200).send(fpo);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.resetPassword = async (req, res) => {
  const { contactNumber, newPassword } = req.body;

  try {
    const fpoOrganization = await FpoOrganization.findOne({ contactNumber });

    if (!fpoOrganization) {
      return res.status(404).send({
        success: false,
        message: "FPO organization not found",
        error: {
          code: "FPO_NOT_FOUND",
          description:
            "The contact number is not associated with any FPO organization.",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    fpoOrganization.password = hashedPassword;
    await fpoOrganization.save();

    res.send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error resetting password",
      error: {
        code: "PASSWORD_RESET_ERROR",
        description: error.message,
      },
    });
  }
};

exports.checkContactNumber = async (req, res) => {
  try {
    const { contactNumber } = req.params;

    const fpoOrganization = await FpoOrganization.findOne({ contactNumber });

    if (fpoOrganization) {
      return res.status(200).send({
        success: true,
        message: "Contact number exists",
        data: fpoOrganization.contactNumber,
      });
    } else {
      return res.status(404).send({
        success: false,
        message: "Contact number does not exist",
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error checking contact number",
      error: {
        code: "CONTACT_CHECK_ERROR",
        description: error.message,
      },
    });
  }
};
