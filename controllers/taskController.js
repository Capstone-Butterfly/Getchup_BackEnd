const Task = require("../models/Task.js");
const getSubTasksFromOpenAI = require("../services/openAIService.js")

// Create a new task 
const saveTask = async (req, res) => {
    try {
        
        const { title, ...taskData } = req.body;
        
        // Get subtasks from OpenAI
        const subTaskResponse = await getSubTasksFromOpenAI(title);
        const subTasks = JSON.parse(subTaskResponse).subtasks;
    
        // Create new task with subtasks
        const task = new Task({
          title,
          ...taskData,
          subtask: subTasks.map(st => ({
            sub_title: st.task,
            time: st.time,
            movement: st.movement,
            status: 'new'  // Default status
          }))
        });

        const result = await task.save();
        const urlStr = `/api/v1/task/${result.id}`;
        
        // Set content-location header
        res.set("content-location", urlStr);
        res.status(201).json({
            url: urlStr,
            data: result,
        });
    } catch (error) {
      res.status(500).json(error);
    }
  };

//get all Tasks or a task by ID
const getTask = async (req, res) => {
    const id = req.params.id;
  
    try {
      if (typeof id === "undefined") {
        const results = await Task.find({}).exec();
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

// Update a task
const updateTask =  async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'notes', 'start_date', 'completed_date', 
                            'subtask', 'user_estimate_duration', 'start_time', 
                            'end_time', 'actual_duration', 'task_urgency'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send();
      }
  
      updates.forEach(update => task[update] = req.body[update]);
      await task.save();
      res.status(200).send(task);
    } catch (error) {
      res.status(400).send(error);
    }
  };

// Delete a task
const deleteTask = async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
        return res.status(404).send();
      }
      res.status(200).send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  };

module.exports = { saveTask, getTask, updateTask, deleteTask };