const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const authRouter = require('./user');
const commonTaskRouter = require('./commonTask');
const surveyRouter = require('./survey')
const progressRouter = require('./progress')

router.use(taskRouter);
router.use(authRouter);
router.use(commonTaskRouter);
router.use(surveyRouter);
router.use(progressRouter);

module.exports = router;