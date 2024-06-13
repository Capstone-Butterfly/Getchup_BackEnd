<<<<<<< HEAD
const CommonTask = require("../models/commonTask.js");
const getSubTasksFromOpenAI = require("../services/openAIService.js");

const saveCommonTask = async (req, res) => {
  try {
    const { title, category } = req.body;

    // // Get subtasks from OpenAI
    const subTaskResponse = await getSubTasksFromOpenAI(title);
    const subTasks = JSON.parse(subTaskResponse).subtasks;

    const commonTask = new CommonTask({
      category,
      title,
      subtask: subTasks.map((st) => ({
        sub_title: st.task,
        time: st.time,
        movement: st.movement,
      })),
    });

    const result = await commonTask.save();
    const urlStr = `/api/v1/commonTask/${result.id}`;

    res.set("content-location", urlStr);
    res.status(201).json({
      url: urlStr,
      data: result,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const getCommonTask = async (req, res) => {
  const id = req.params.id;
  try {
    if (typeof id === "undefined") {
        const results = await CommonTask.aggregate([
            {
              $group: {
                _id: "$category",
                tasks: { $push: "$$ROOT" } 
              }
            }
          ]).exec();
      res.status(200).json(results);
    } else {
      const result = await Task.findOne({ _id: id }).exec();
      if (result == null) {
        res.status(404).json(result);
      } else {
        res.status(200).json(result);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};


const deleteCommonTask = async (req, res) => {
    try {
      const commonTask = await CommonTask.findByIdAndDelete(req.params.id);
      if (!commonTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully", data: commonTask });
    } catch (error) {
      res.status(500).send(error);
    }
  };

module.exports = { saveCommonTask, getCommonTask, deleteCommonTask };
=======
const CommonTask = require("../models/CommonTask.js");
const getSubTasksFromOpenAI = require("../services/openAIService.js");

const saveCommonTask = async (req, res) => {
    try {
        const { title, category } = req.body;
        
        // // Get subtasks from OpenAI
        const subTaskResponse = await getSubTasksFromOpenAI(title);
        const subTasks = JSON.parse(subTaskResponse).subtasks;

        const commonTask = new CommonTask({
            category,
            title,
            subtask: subTasks.map(st => ({
                sub_title: st.task,
                time: st.time,
                movement: st.movement,
          }))
        });
        console.log("after save");

        const result = await commonTask.save();
        const urlStr = `/api/v1/commonTask/${result.id}`;
        
        res.set("content-location", urlStr);
        res.status(201).json({
            url: urlStr,
            data: result,
        });
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  module.exports = { saveCommonTask };
>>>>>>> f8d318b (feat: BC-124 add common task controller, model, routes)
