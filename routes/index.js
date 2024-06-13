const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const commonTaskRouter = require('./commonTask');
const authRouter = require('./auth');
const commonTaskRouter = require('./commonTask');

router.use(taskRouter);
router.use(commonTaskRouter);
router.use(authRouter);

router.use(commonTaskRouter);

module.exports = router;