const OpenAI = require('openai');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const getSubTasksFromOpenAI = async (mainTask) => {
    try {
      // Construct prompt including main task
      const prompt = `Here is the main task: ${mainTask} , along with estimated times and will it involve the movement for each task . 
      Please generate subtasks based on it without explanation. The JSON structure should follow this pattern:
      {
      "main_task": "main task title",
      "estimated_time": "15 minutes",
      "will_involve_movement": "true or false",
      "subtasks": { [
        "task": "subtask description"
        "time": "5 minutes"
        "movement": "true" or "false"
      ]
      }
      `;
  
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
        max_tokens: 1500,
      });

      const aiResponse = completion.choices[0].message.content;
      return aiResponse;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Request failed with status code:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up the request:', error.message);
      }
      throw error;
    }
  };
  
  module.exports = getSubTasksFromOpenAI;

