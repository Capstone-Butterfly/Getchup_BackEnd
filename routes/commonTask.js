const express = require('express');
const router = express.Router({mergeParams:true});

const commonTaskCtrl= require('../controllers/commonTaskController');

router.post("/commonTasks", commonTaskCtrl.saveCommonTask);

module.exports = router;