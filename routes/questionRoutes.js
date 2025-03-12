const express = require("express");
const questionController = require("../controllers/questionController");

const router = express.Router();

router.post("/", questionController.insertQuestion);
router.get("/topic/:topicId", questionController.getQuestionsByTopic);
router.get("/subtopic/:subtopicId", questionController.getQuestionsBySubTopic);
router.put("/questions/:id", questionController.updateQuestion);

module.exports = router;
