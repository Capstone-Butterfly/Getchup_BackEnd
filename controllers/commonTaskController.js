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