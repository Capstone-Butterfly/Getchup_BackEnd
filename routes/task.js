const express = require('express');
const router = express.Router({mergeParams:true});

const taskCtrl= require('../controllers/taskController');

router.get("/tasks", taskCtrl.getTask);
router.get("/tasks/:id", taskCtrl.getTask);
router.post("/tasks", taskCtrl.saveTask);
router.patch('/tasks/:id', taskCtrl.updateTask);
router.delete('/tasks/:id', taskCtrl.deleteTask);


module.exports = router;