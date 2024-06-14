const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const authRouter = require('./auth');
const commonTaskRouter = require('./commonTask');

router.use(taskRouter);
router.use(authRouter);
router.use(commonTaskRouter);

module.exports = router;