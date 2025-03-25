const mongoose = require("mongoose");
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
  return await Question.find({ topicId })
};

exports.getQuestionsBySubtopic = async (subtopicId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subtopicId)) {
      throw new Error("Invalid subtopic ID format");
    }

    return await Question.find({ subtopicId: new mongoose.Types.ObjectId(subtopicId) });
      
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.getQuestionsBySubject = async (subjectId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(subjectId)) {
      throw new Error("Invalid subjectId ID format");
    }

    const data = await Question.find({ subjectId: new mongoose.Types.ObjectId(subjectId) })
      
      console.log("asfasfasd", data);
      return data;
  } catch (error) {
    throw new Error(error.message);
  }
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


