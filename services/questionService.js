const Question = require("../models/questionModel");

exports.insertQuestion = async (questionData) => {
  try {
    const question = new Question(questionData);
    return await question.save();
  } catch (error) {
    throw new Error(`Error inserting question: ${error.message}`);
  }
};

exports.getQuestionsByTopic = async (topicId) => {
  return await Question.find({ topicId }).populate("classId subjectId topicId subtopicId");
};

exports.getQuestionsBySubtopic = async (subtopicId) => {
  return await Question.find({ subtopicId }).populate("classId subjectId topicId subtopicId");
};

exports.updateQuestion = async (id, updateData) => {
  try {
    return await Question.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};


