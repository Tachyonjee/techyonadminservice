const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Class 11, Class 12
});

const ClassModel = mongoose.model("Standard", classSchema);
module.exports = ClassModel;