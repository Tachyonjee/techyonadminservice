const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
});

const TopicModel = mongoose.model("Topic", topicSchema);
module.exports = TopicModel;
