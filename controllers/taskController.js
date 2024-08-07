const Task = require("../models/Task.js");
const Notification = require("../models/Notification.js");
const mongoose = require("mongoose");
const getSubTasksFromOpenAI = require("../services/openAIService.js");

// Create a new task
const getAISubTasks = async (req, res) => {
  try {
    const { title, ...taskData } = req.body;
    //console.log(title);
    // Get subtasks from OpenAI
    const subTaskResponse = await getSubTasksFromOpenAI(title);
    const subTasks = JSON.parse(subTaskResponse).subtasks;

    // Create new task with subtasks
    const task = new Task({
      title,
      ...taskData,
      subtask: subTasks.map((st) => ({
        sub_title: st.task,
        time: st.time,
        movement: st.movement,
        status: "new", // Default status
      })),
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

const saveTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const result = await task.save();
    const urlStr = `/api/v1/tasks/${result.id}`;

    // Calculate the sent_at field
    const estimateStartDate = new Date(req.body.estimate_start_date);
    const estimateStartTime = parseInt(req.body.estimate_start_time, 10);
    const estimateDateTime = new Date(estimateStartDate.getTime() + estimateStartTime);

    let sentAt;
    const now = new Date();
    const diff = (estimateDateTime - now) / 1000; // Difference in seconds

    if (diff >= 45 * 60) {
      sentAt = new Date(estimateDateTime.getTime() - 45 * 60 * 1000); // 45 minutes before estimateDateTime
    } else {
      sentAt = new Date(now.getTime() + 10 * 1000); // 10 seconds from now
    }

    res.set("content-location", urlStr);

    if (result.notification_id) {
      const notification = new Notification({
        identifier: result.notification_id,
        user_id: result.user_id,
        task_id: result.id,
        message: result.title,
        sent_at: sentAt,
      });

      await notification.save();
    }

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

// Function to get tasks by user ID
const getTasksByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.find({ user_id: userId }).exec();
    if (tasks.length === 0) {
      res.status(404).json({ message: "No tasks found for this user." });
    } else {
      res.status(200).json(tasks);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a task
const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "notes",
    "due_date",
    "start_date",
    "completed_date",
    "subtask",
    "user_estimate_duration",
    "start_time",
    "end_time",
    "actual_duration",
    "task_urgency",
    "is_repeated",
    "main_status",
    "movement_tracking",
    "task_reminder",
    "notification_id",
    "estimate_start_date",
    "estimate_start_time",
    "estimate_end_time",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      if (update === "subtask") {
        const subtaskUpdates = req.body.subtask;
        if (Array.isArray(subtaskUpdates) && subtaskUpdates.length > 0) {
          subtaskUpdates.forEach((subtaskUpdate) => {
            const subtaskIndex = subtaskUpdate.index;
            if (task.subtask[subtaskIndex]) {
              Object.keys(subtaskUpdate).forEach((key) => {
                if (key !== "index") {
                  task.subtask[subtaskIndex][key] = subtaskUpdate[key];
                }
              });
            }
          });
        }
      } else {
        task[update] = req.body[update];
      }
    });

    if (req.body.main_status) {
      task.main_status = req.body.main_status;
    }

    if (req.body.end_date) {
      task.end_date = req.body.end_date;
    }
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
};

// change Task status to Complete manually
const manualCompleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update main_status to "complete"
    task.main_status = 'complete';

    // Update all subtasks' status to "complete"
    task.subtask.forEach(subtask => {
      subtask.status = 'complete';
    });

    // Save the updated task
    const updatedTask = await task.save();

    res.status(200).json({
      message: 'Task and subtasks updated to complete',
      data: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Filter repeated tasks
const filterRepeatedTasks = async (req, res) => {
  const { userId } = req.params;
  const objectId = new mongoose.Types.ObjectId(userId);
  try {
    const repeatedTasks = await Task.aggregate([
      {
        $match: {
          user_id: objectId,
          main_status: "complete",
        },
      },
      {
        $group: {
          _id: { $toLower: "$title" },
          task: { $last: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$task",
        },
      },
    ]);

    res.status(200).json(repeatedTasks);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getAISubTasks,
  saveTask,
  getTask,
  getTasksByUser,
  updateTask,
  manualCompleteTask,
  deleteTask,
  filterRepeatedTasks,
};
