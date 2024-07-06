const express = require('express');
const router = express.Router({mergeParams:true});

const taskCtrl= require('../controllers/taskController');

router.get("/tasks", taskCtrl.getTask);
router.get("/tasks/:id", taskCtrl.getTask);
router.get("/tasks/user/:userId", taskCtrl.getTasksByUser);
router.post("/tasks/aisubtasks", taskCtrl.getAISubTasks)
router.post("/tasks", taskCtrl.saveTask);
router.patch('/tasks/:id', taskCtrl.updateTask);
router.patch('/tasks/manualcomplete/:id', taskCtrl.manualCompleteTask);
router.delete('/tasks/:id', taskCtrl.deleteTask);
router.get('/repeatedTasks/:userId', taskCtrl.filterRepeatedTasks);


module.exports = router;