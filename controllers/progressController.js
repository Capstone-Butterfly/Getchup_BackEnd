const Task = require("../models/Task.js");
const moment = require("moment-timezone");

const getWeeklyProgressChart = async (req, res) => {
  try {
    //const { startDate, endDate } = req.query;
    const { startDate, endDate, userId } = req.params;

    if (!startDate || !endDate || !userId) {
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });
    }

    const start = new Date(startDate);
    let end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    // Fetch tasks within the date range with userId
    const tasks = await Task.find({
      user_id: userId,
      estimate_start_date: { $gte: start, $lte: end },
    });

    const sortedTasksByDay = {
      Sunday: { completeCount: 0, incompleteCount: 0 },
      Monday: { completeCount: 0, incompleteCount: 0 },
      Tuesday: { completeCount: 0, incompleteCount: 0 },
      Wednesday: { completeCount: 0, incompleteCount: 0 },
      Thursday: { completeCount: 0, incompleteCount: 0 },
      Friday: { completeCount: 0, incompleteCount: 0 },
      Saturday: { completeCount: 0, incompleteCount: 0 },
    };

    tasks.forEach((task) => {
      const dayOfWeek = moment.utc(task.estimate_start_date)
        // .tz("America/Los_Angeles")
        .format("dddd"); // Get day of week in local timezone
      //sortedTasksByDay[dayOfWeek].tasks.push(task);
      // sortedTasksByDay[dayOfWeek].totalTasks += 1;
      // if (task.main_status === 'complete') {
      //     sortedTasksByDay[dayOfWeek].completedTasks += 1;
      // }
      if (task.main_status === "complete") {
        sortedTasksByDay[dayOfWeek].completeCount++;
      } else {
        sortedTasksByDay[dayOfWeek].incompleteCount++;
      }
    });

    let perfectDaysCount = 0;
    for (const day in sortedTasksByDay) {
      const dayData = sortedTasksByDay[day];
      const totalTasks = dayData.completeCount + dayData.incompleteCount;
      if (totalTasks > 0 && totalTasks === dayData.completeCount) {
        perfectDaysCount += 1;
      }
    }

    res.json({
      sortedTasksByDay,
      perfectDaysCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodayProgressChart = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.params;

    // Get today's date in UTC
    const dayStart = new Date(startDate);
    dayStart.setUTCHours(0, 0, 0, 0);

    const dayEnd = new Date(endDate);
    dayEnd.setUTCHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user_id: userId,
      estimate_start_date: {
        $gte: dayStart,
        $lte: dayEnd,
      },
    });

    const groupedTask = {
      morning: { completeCount: 0, incompleteCount: 0 },
      afternoon: { completeCount: 0, incompleteCount: 0 },
      evening: { completeCount: 0, incompleteCount: 0 },
      night: { completeCount: 0, incompleteCount: 0 },
    };

    tasks.forEach((task) => {
      const startTime = task.estimate_start_time;
      const date = new Date(startTime);
      const hours = date.getUTCHours();

      if (hours >= 6 && hours < 12) {
        // groupedTask.morning.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.morning.completeCount++;
        } else {
          groupedTask.morning.incompleteCount++;
        }
      } else if (hours >= 12 && hours < 17) {
        // groupedTask.afternoon.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.afternoon.completeCount++;
        } else {
          groupedTask.afternoon.incompleteCount++;
        }
      } else if (hours >= 17 && hours < 21) {
        // groupedTask.evening.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.evening.completeCount++;
        } else {
          groupedTask.evening.incompleteCount++;
        }
      } else {
        // groupedTask.night.tasks.push(task);
        if (task.main_status === "complete") {
          groupedTask.night.completeCount++;
        } else {
          groupedTask.night.incompleteCount++;
        }
      }
    });

    const productivity = [
      { time: "morning", count: groupedTask.morning.completeCount },
      { time: "afternoon", count: groupedTask.afternoon.completeCount },
      { time: "evening", count: groupedTask.evening.completeCount },
      { time: "night", count: groupedTask.night.completeCount },
    ];

    // Sort by complete count in descending order
    productivity.sort((a, b) => b.count - a.count);

    const mostProductiveTime =
      productivity[0].count > 0 ? productivity[0].time : "No tasks completed";
    const leastProductiveTime = productivity[productivity.length - 1].time;

    const totalTasks = tasks.length;
    const totalCompletedTasks = tasks.filter(
      (task) => task.main_status === "complete"
    ).length;
    const totalIncompleteTasks = totalTasks - totalCompletedTasks;
    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round((totalCompletedTasks / totalTasks) * 100);

    res.status(200).json({
      groupedTask,
      totalTasks,
      totalCompletedTasks,
      totalIncompleteTasks,
      completionPercentage,
      mostProductiveTime,
      leastProductiveTime,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMonthlyProgressChart = async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.params;

    if (!startDate || !endDate || !userId) {
      return res
        .status(400)
        .json({ message: "startDate, endDate, and userId are required" });
    }

    const start = moment(startDate).startOf('day');
    let end = moment(endDate).endOf('day');

    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid startDate or endDate" });
    }

    end = end
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

    const tasks = await Task.find({
      user_id: userId,
      estimate_start_date: { $gte: start.toDate(), $lte: end.toDate() },
    });

    const daysInMonth = start.daysInMonth();
    console.log("daysInMonth: " + daysInMonth);
    const sortedTasksByDay = {};

    for (let day = 1; day <= daysInMonth; day++) {
      sortedTasksByDay[day] = { completeCount: 0, incompleteCount: 0 };
    }

    tasks.forEach((task) => {
      const dayOfMonth = moment.utc(task.estimate_start_date).date();
        // .tz("America/Los_Angeles")
        // .date();

      if (task.main_status === "complete") {
        sortedTasksByDay[dayOfMonth].completeCount++;
      } else {
        sortedTasksByDay[dayOfMonth].incompleteCount++;
      }
    });

    let perfectDaysCount = 0;
    for (const day in sortedTasksByDay) {
      const dayData = sortedTasksByDay[day];
      const totalTasks = dayData.completeCount + dayData.incompleteCount;
      if (totalTasks > 0 && totalTasks === dayData.completeCount) {
        perfectDaysCount += 1;
      }
    }

    res.json({
      sortedTasksByDay,
      perfectDaysCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWeeklyProgressChart,
  getTodayProgressChart,
  getMonthlyProgressChart,
};
