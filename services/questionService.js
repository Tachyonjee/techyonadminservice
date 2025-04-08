const mongoose = require("mongoose");
const Question = require("../models/questionModel");
const Class = require("../models/classModel");
const Subject = require("../models/subjectModel");
const Topic = require("../models/topicModel");
const Subtopic = require("../models/subTopicModel");

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
    console.log("Received subtopicId:", subtopicId);
    
    if (!subtopicId) {
      throw new Error("SubTopic ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(subtopicId)) {
      console.error("Invalid ObjectId format:", subtopicId);
      throw new Error("Invalid subtopic ID format");
    }

    const objectId = new mongoose.Types.ObjectId(subtopicId);
    console.log("Converted to ObjectId:", objectId);

    const questions = await Question.find({ subtopicId: objectId })
      .populate({
        path: 'classId',
        model: 'Standard'
      })
      .populate({
        path: 'subjectId',
        model: 'Subject'
      })
      .populate({
        path: 'topicId',
        model: 'Topic'
      })
      .populate({
        path: 'subtopicId',
        model: 'Subtopic'
      });
      
    console.log("Found questions:", questions);

    if (!questions || questions.length === 0) {
      return [];
    }

    return questions;
  } catch (error) {
    console.error("Error in getQuestionsBySubtopic:", error);
    throw error;
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


