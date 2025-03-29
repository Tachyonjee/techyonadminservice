const express = require("express");
const questionController = require("../controllers/questionController");

const router = express.Router();

router.post("/", questionController.insertQuestion);
router.get("/subject/:subjectId", questionController.getQuestionsBySubject);
router.get("/topic/:topicId", questionController.getQuestionsByTopic);
router.get("/subtopic/:subtopicId", questionController.getQuestionsBySubTopic);
router.put("/:id", questionController.updateQuestion);

module.exports = router;
