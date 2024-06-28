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
            created_datetime: { $gte: start, $lte: end }
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

module.exports = { getTasksbyDate, getTasksByUserId };
