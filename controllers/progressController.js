const Task = require("../models/Task.js");

const getTasksbyDate = async (req, res) => {
    try {
        //const { startDate, endDate } = req.query;
        const { startDate, endDate, userId } = req.params;
        // console.log("startDate", startDate);
        // console.log("endDate", endDate);

        if (!startDate || !endDate || !userId) {
          return res.status(400).json({ message: 'startDate and endDate are required' });
        }

        const start = new Date(startDate);
        let end = new Date(endDate);
       
        // console.log("start", start);
        // console.log("end", end);

         if (start.toDateString() === end.toDateString()) {
            end = new Date(); 
        } 
        else {
            end = new Date(end.getTime() + end.getTimezoneOffset() * 60000); // Convert to UTC
            //end.setUTCHours(23, 59, 59, 999); // End of the day in UTC
            end.setHours(23, 59, 59, 999);
        }
           
        // console.log("start 2 ", start);
        // console.log("end 2 ", end);


        // Fetch tasks within the date range
        const tasks = await Task.find({
            user_id: userId,
            estimate_start_date: { $gte: start, $lte: end }
        });
    
        // Calculate stats
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.main_status === 'complete').length;
        const incompleteTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
        res.json({
            // created_datetime: tasks.map(task => ({
            //     created_datetime: task.created_datetime
            // })),
          totalTasks,
          completedTasks,
          incompleteTasks,
          completionPercentage
        });
      } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasksByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
  
      // Fetch tasks by user_id
      const tasks = await Task.find({
        user_id: userId
      });
  
      // Calculate stats
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.main_status === 'complete').length;
      const incompleteTasks = totalTasks - completedTasks;
      const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
      res.status(200).json({
        totalTasks,
        completedTasks,
        incompleteTasks,
        completionPercentage
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getTodayProgressChart = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get today's date in UTC
    const today = new Date();
    const sample = new Date();
    console.log("sample" + sample);
    today.setHours(today.getHours() - 7);
    console.log(today.toISOString());
    today.setUTCHours(0, 0, 0, 0); 
    console.log("todayStart:", today.toISOString());


    const todayEnd = new Date(today);
    todayEnd.setUTCHours(23, 59, 59, 999);
    console.log("todayEnd:", todayEnd.toISOString());

    const tasks = await Task.find({
      user_id: userId,
      estimate_start_date: {
        $gte: today,
        $lte: todayEnd,
      },
    });
    console.log("tasks" + tasks);

    const groupedTask = {
      morning: { tasks: [], completeCount: 0, incompleteCount: 0 },
      afternoon: { tasks: [], completeCount: 0, incompleteCount: 0 },
      evening: { tasks: [], completeCount: 0, incompleteCount: 0 },
      night: { tasks: [], completeCount: 0, incompleteCount: 0 },
    };

    tasks.forEach((task) => {
      const startTime = task.estimate_start_time;
      const date = new Date(startTime);
      const hours = date.getUTCHours();
      console.log("hours" + hours);

      if (hours >= 6 && hours < 12) {
        groupedTask.morning.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.morning.completeCount++;
        } else {
          groupedTask.morning.incompleteCount++;
        }
      } else if (hours >= 12 && hours < 17) {
        groupedTask.afternoon.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.afternoon.completeCount++;
        } else {
          groupedTask.afternoon.incompleteCount++;
        }
      } else if (hours >= 17 && hours < 21) {
        groupedTask.evening.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.evening.completeCount++;
        } else {
          groupedTask.evening.incompleteCount++;
        }
      } else {
        groupedTask.night.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.night.completeCount++;
        } else {
          groupedTask.night.incompleteCount++;
        }
      }
    });

    const productivity = [
      { time: 'morning', count: groupedTask.morning.completeCount },
      { time: 'afternoon', count: groupedTask.afternoon.completeCount },
      { time: 'evening', count: groupedTask.evening.completeCount },
      { time: 'night', count: groupedTask.night.completeCount }
    ];

    // Sort by complete count in descending order
    productivity.sort((a, b) => b.count - a.count);

    const mostProductiveTime = productivity[0].count > 0 ? productivity[0].time : "No tasks completed";
    const leastProductiveTime = productivity[productivity.length - 1].time;

    const totalTasks = tasks.length;
    const totalCompletedTasks = tasks.filter(
      (task) => task.main_status === "complete"
    ).length;
    const totalIncompleteTasks = totalTasks - totalCompletedTasks;

    res.status(200).json({
      groupedTask,
      totalTasks,
      totalCompletedTasks,
      totalIncompleteTasks,
      mostProductiveTime,
      leastProductiveTime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { getTasksbyDate, getTasksByUserId, getTodayProgressChart };
