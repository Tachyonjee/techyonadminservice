const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
  subtopicId: { type: mongoose.Schema.Types.ObjectId, ref: "Subtopic", required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  questionType: { type: String, enum: ["mcq", "Numerical", "Descriptive"], required: true },
  questionText: { type: String, required: true }, // Supports LaTeX, MathML, plain text
  questionImage: { type: String }, // URL or file path (optional)
  options: {
    a: { type: String },
    b: { type: String },
    c: { type: String },
    d: { type: String }
  }, // Answer options for MCQs
  correctAnswerOption: { type: String, enum: ["a", "b", "c", "d"] }, // Required for MCQs
  correctAnswerText: { type: String }, // Required for Numerical/Descriptive
  answerExplanation: { type: String } // Explanation (supports equations)
});

// Add validation for MCQ fields
questionSchema.pre("save", function (next) {
  if (this.questionType === "mcq") {
    if (!this.options || !this.options.a || !this.options.b || !this.options.c || !this.options.d) {
      return next(new Error("MCQ questions must have all four options (a, b, c, d)."));
    }
    if (!this.correctAnswerOption) {
      return next(new Error("MCQ questions must have a correctAnswerOption."));
    }
  } else {
    if (!this.correctAnswerText) {
      return next(new Error("Numerical/Descriptive questions must have correctAnswerText."));
    }
  }
  next();
});

module.exports = mongoose.model("questions", questionSchema);
