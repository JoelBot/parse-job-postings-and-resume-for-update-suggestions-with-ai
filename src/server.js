const express = require('express');
const OpenAIAPI = require('openai');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const openai = new OpenAIAPI({ key: process.env.OPENAI_API_KEY });

app.post('/generate-completion', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
        role: "system",
        content: "you are a helpful assistant designed to output JSON.",
    },
    {
      role: "user", content: prompt,
    }
  ],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      //engine: 'completions',

    });
    console.log(response.choices[0].message.content);

    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
