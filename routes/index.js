const express = require('express');
const router = express.Router({mergeParams:true});

const taskRouter = require('./task');
const authRouter = require('./auth');

router.use(taskRouter);
router.use(authRouter);


module.exports = router;