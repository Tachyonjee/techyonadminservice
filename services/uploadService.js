const xlsx = require("xlsx");
const fs = require("fs");
const ClassModel = require("../models/classModel");
const SubjectModel = require("../models/subjectModel");
const TopicModel = require("../models/topicModel");
const SubtopicModel = require("../models/subtopicModel");

exports.processExcel = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const item of data) {
        console.log("items", data, item)
      if (!item.Class || !item.Subject || !item.Topic || !item.Subtopic) {
        console.warn(`⚠️ Skipping row due to missing data:`, item);
        return " Error processing Excel file"
      }

      // Insert Class (if not exists)
      let classData = await ClassModel.findOne({ name: item.Class });
      if (!classData) {
        classData = await ClassModel.create({ name: item.Class });
      }

      // Insert Subject (if not exists)
      let subjectData = await SubjectModel.findOne({ 
        name: item.Subject, 
      });
      if (!subjectData) {
        subjectData = await SubjectModel.create({
          name: item.Subject,
          classId: classData._id
        });
      }

      // Insert Topic (if not exists)
      let topicData = await TopicModel.findOne({
        name: item.Topic,
        subjectId: subjectData._id
      });
      if (!topicData) {
        topicData = await TopicModel.create({
          name: item.Topic,
          subjectId: subjectData._id
        });
      }

      // Insert Subtopic (if not exists)
      let subtopicData = await SubtopicModel.findOne({
        name: item.Subtopic,
        topicId: topicData._id
      });
      if (!subtopicData) {
        subtopicData = await SubtopicModel.create({
          name: item.Subtopic,
          topicId: topicData._id
        });
      }
    }

    // Remove the uploaded file after processing
    fs.unlinkSync(filePath);
    console.log("✅ Data inserted successfully!");

  } catch (error) {
    console.error("❌ Error processing Excel file:", error);
    throw error;
  }
};

// Fetch Classes
exports.getClasses = async () => {
    return await ClassModel.find();
  };
  
  // Fetch Subjects by Class
  exports.getSubjectsByClass = async (classId) => {
    return await SubjectModel.find();
  };
  
  // Fetch Topics by Subject
  exports.getTopicsBySubject = async (subjectId) => {
    return await TopicModel.find({ subjectId });
  };
  
  // Fetch Subtopics by Topic
  exports.getSubtopicsByTopic = async (topicId) => {
    return await SubtopicModel.find({ topicId });
  };
