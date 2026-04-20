

import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
// MAIN AI ROUTE
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Please enter a prompt",
      });
    }

 const fullPrompt = `
User Idea:
${prompt}

IMPORTANT FORMAT RULES:
- Keep sections clearly separated
- Add line breaks between sections
- No markdown symbols (** ###)
- Use simple clean headings

FORMAT:

App Name:
...

Description:
...

Target Audience:
- point 1
- point 2

Features:
- ...

Monetization:
...

Tech Stack:
...
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a creative startup idea generator.",
          },
          {
            role: "user",
            content: fullPrompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const idea = response.data?.choices[0]?.message?.content||"Sorry, no idea generated. Try again!";

    res.json({
      success: true,
      idea: idea,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

//! Start  the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});