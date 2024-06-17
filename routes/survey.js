const express = require('express');
const router = express.Router({mergeParams:true});

const surveyCtrl = require('../controllers/surveyController');

router.get("/surveys", surveyCtrl.getSurvey);
router.get("/surveys/:id", surveyCtrl.getSurvey);
router.post("/surveys", surveyCtrl.saveSurvey);
router.patch('/surveys/:id', surveyCtrl.updateSurvey);
router.delete('/surveys/:id', surveyCtrl.deleteSurvey);

module.exports = router;