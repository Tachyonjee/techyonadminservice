const questionService = require("../services/questionService");

exports.insertQuestion = async (req, res) => {
  try {
    const { classId, subjectId, topicId, subtopicId, difficulty, questionType, questionText, questionImage, options, correctAnswerOption, correctAnswerText, answerExplanation } = req.body;

    if (!classId || !subjectId || !topicId || !subtopicId || !difficulty || !questionType || !questionText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (questionType === "mcq") {
      if (!options || !options.a || !options.b || !options.c || !options.d) {
        return res.status(400).json({ message: "MCQ questions must have all four options (a, b, c, d)." });
      }
      if (!correctAnswerOption) {
        return res.status(400).json({ message: "MCQ questions must have a correctAnswerOption." });
      }
    } else {
      if (!correctAnswerText) {
        return res.status(400).json({ message: "Numerical/Descriptive questions must have correctAnswerText." });
      }
    }

    const questionData = { classId, subjectId, topicId, subtopicId, difficulty, questionType, questionText, questionImage, options, correctAnswerOption, correctAnswerText, answerExplanation };

    const newQuestion = await questionService.insertQuestion(questionData);
    res.status(201).json({ message: "Question inserted successfully", question: newQuestion });
  } catch (error) {
    res.status(500).json({ message: "Error inserting question", error: error.message });
  }
};

exports.getQuestionsByTopic = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByTopic(req.params.topicId);
    return res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions by topic", error });
  }
};

exports.getQuestionsBySubTopic = async (req, res) => {
  try {
    const subtopicId = req.params.subtopicId;
    if (!subtopicId) {
      return res.status(400).json({
        success: false,
        message: "SubTopic ID is required"
      });
    }

    const questions = await questionService.getQuestionsBySubtopic(subtopicId);
    return res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error("Error in getQuestionsBySubTopic:", error);
    if (error.message === "Invalid subtopic ID format") {
      return res.status(400).json({
        success: false,
        message: "Invalid SubTopic ID format",
        error: error.message
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Error fetching questions by subTopic",
      error: error.message 
    });
  }
};

exports.getQuestionsBySubject = async (req, res) => {
  try {
    const questions = await questionService.getQuestionsBySubject(req.params.subjectId);
   res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions by subTopic", error });
  }
}

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Call service to update question
    const updatedQuestion = await questionService.updateQuestion(id, updateData);

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Server error" });
  }
}