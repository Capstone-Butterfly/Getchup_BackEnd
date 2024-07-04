const Survey = require("../models/Survey.js");

// Create a new survey
const saveSurvey = async (req, res) => {
  try {
    const survey = new Survey(req.body);
    const result = await survey.save();
    const urlStr = `/api/v1/survey/${result.id}`;

    // Set content-location header
    res.set("content-location", urlStr);
    res.status(201).json({
      url: urlStr,
      data: result,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

const evaluateADHDLevel = (answers) => {
  const pointValues = {
    "Almost Always": 4,
    Frequently: 3,
    Occasionally: 2,
    Rarely: 1,
  };

  // Calculate total score
  let totalScore = 0;
  let count = 0;
  for (const question in answers) {
    count++;
    
    if (answers.hasOwnProperty(question)) {
      const answer = answers[question][0].options; 
      totalScore += pointValues[answer];
    }
  }

  // Determine ADHD category
  let category;
  let user_type;
  if (totalScore >= 12 ) {
    category = "Hyperactive ADHD";
    user_type = 1;
  } else if (totalScore >= 8 && totalScore <= 11) {
    category = "Mixed Presentation";
    user_type = 2;
  } else if (totalScore >= 4 && totalScore <= 7) {
    category = "Non-Hyperactive (Inattentive) ADHD";
    user_type = 3;
  } else {
    category = "Invalid Score";
    user_type = null;
  }

  return { totalScore, category, user_type };
};

const getSurveyResult = async (req, res) => {
    try {
        const answers = req.body;
        const evaluation = evaluateADHDLevel(answers);
        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ error: "Error evaluating ADHD level" });
    }
};

// Get all surveys or a survey by ID
const getSurvey = async (req, res) => {
  const id = req.params.id;

  try {
    if (typeof id === "undefined") {
      const results = await Survey.find({}).exec();
      res.status(200).json(results);
    } else {
      const result = await Survey.findOne({ _id: id }).exec();
      if (result == null) {
        res.status(404).json({ error: "Survey not found" });
      } else {
        res.status(200).json(result);
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// Update a survey
const updateSurvey = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "question_1",
    "question_2",
    "question_3",
    "question_4",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const survey = await Survey.findById(req.params.id);
    if (!survey) {
      return res.status(404).send();
    }

    updates.forEach((update) => (survey[update] = req.body[update]));
    await survey.save();
    res.status(200).send(survey);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a survey
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findByIdAndDelete(req.params.id);
    if (!survey) {
      return res.status(404).send();
    }
    res.status(200).send(survey);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { saveSurvey, getSurvey, getSurveyResult, updateSurvey, deleteSurvey };
