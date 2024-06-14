const express = require('express');
const router = express.Router({mergeParams:true});

const commonTaskCtrl= require('../controllers/commonTaskController');

router.post("/commonTasks", commonTaskCtrl.saveCommonTask);
router.get("/commonTasks", commonTaskCtrl.getCommonTask);
router.delete('/commonTasks/:id', commonTaskCtrl.deleteCommonTask);

module.exports = router;