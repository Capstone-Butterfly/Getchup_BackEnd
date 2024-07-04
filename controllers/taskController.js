const Task = require("../models/Task.js");
const getSubTasksFromOpenAI = require("../services/openAIService.js");

// Create a new task
const getAISubTasks = async (req, res) => {
  try {
    const { title, ...taskData } = req.body;
    console.log(title);
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
  try {
    const repeatedTasks = await Task.find({
      user_id: userId,
      main_status: "complete",
    });
    res.status(200).json(repeatedTasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repeated tasks" });
  }
};

module.exports = {
  getAISubTasks,
  saveTask,
  getTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  filterRepeatedTasks,
};
