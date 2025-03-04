const express = require("express");
const multer = require("multer");
const uploadController = require("../controllers/uploadController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadController.uploadExcel);
router.get("/classes", uploadController.getClasses);
router.get("/subjects/:classId", uploadController.getSubjectsByClass);
router.get("/topics/:subjectId", uploadController.getTopicsBySubject);
router.get("/subtopics/:topicId", uploadController.getSubtopicsByTopic);

module.exports = router;
