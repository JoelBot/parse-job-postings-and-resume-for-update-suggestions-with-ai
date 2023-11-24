const express = require('express');
const axios = require('axios');
require ('dotenv').config();

const app = express();
const port = 3000;

// Replace 'your-api-key' with your OpenAI API key
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiApiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

app.use(express.json());

app.post('/generate-response', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const response = await axios.post(
      openaiApiUrl,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
      }
    );

    const responseData = response.data.choices[0].text;
    res.json({ response: responseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Internal Server Error'});
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
