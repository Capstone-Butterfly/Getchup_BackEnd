const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const authRouter = require('./auth');
const commonTaskRouter = require('./commonTask');
const surveyRouter = require('./survey')

router.use(taskRouter);
router.use(authRouter);
router.use(commonTaskRouter);
router.use(surveyRouter);

module.exports = router;