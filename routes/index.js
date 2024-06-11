const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');

router.use(taskRouter);


module.exports = router;