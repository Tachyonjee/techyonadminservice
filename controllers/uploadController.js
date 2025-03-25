const uploadService = require("../services/uploadService");

exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    await uploadService.processExcel(req.file.path);

    res.json({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await uploadService.getClasses();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes", error });
  }
};

exports.getSubjectsByClass = async (req, res) => {
  try {
    const subjects = await uploadService.getSubjectsByClass();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subjects", error });
  }
};

exports.getTopicsBySubject = async (req, res) => {
  try {
    const topics = await uploadService.getTopicsBySubject(req.params.subjectId);
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching topics", error });
  }
};

exports.getSubtopicsByTopic = async (req, res) => {
  try {
    const subtopics = await uploadService.getSubtopicsByTopic(req.params.topicId);
    res.status(200).json(subtopics);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subtopics", error });
  }
};