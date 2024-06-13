const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const commonTaskRouter = require('./commonTask');

router.use(taskRouter);
router.use(commonTaskRouter);

module.exports = router;