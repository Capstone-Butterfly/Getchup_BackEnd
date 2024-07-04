const express = require('express');
const router = express.Router({mergeParams:true});

const progressCtrl= require('../controllers/progressController');

//router.get("/tasks/stats", progressCtrl.getTasksbyDate); // with query GET http://localhost:8080/tasks/stats/2024-06-19/2024-06-27

router.get("/weeklyprogresschart/:userId/:startDate/:endDate", progressCtrl.getWeeklyProgressChart); // with param GET http://localhost:8080/tasks/stats?startDate=2024-06-26&endDate=2024-06-27
router.get("/todayChartDetails/:userId/:startDate/:endDate", progressCtrl.getTodayProgressChart);



module.exports = router;
