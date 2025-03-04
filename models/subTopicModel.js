const mongoose = require("mongoose");

const subtopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
});

const SubtopicModel = mongoose.model("Subtopic", subtopicSchema);
module.exports = SubtopicModel;
