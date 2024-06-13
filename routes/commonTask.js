const express = require('express');
const router = express.Router({mergeParams:true});

const commonTaskCtrl= require('../controllers/commonTaskController');

router.post("/commonTasks", commonTaskCtrl.saveCommonTask);
<<<<<<< HEAD
router.get("/commonTasks", commonTaskCtrl.getCommonTask);
router.delete('/commonTasks/:id', commonTaskCtrl.deleteCommonTask);
=======
>>>>>>> f8d318b (feat: BC-124 add common task controller, model, routes)

module.exports = router;