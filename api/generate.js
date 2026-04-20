export default async function handler(req, res) {
  // Only POST allowed
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { prompt } = req.body;

    // Validate input
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Please enter a prompt",
      });
    }

    // Call OpenRouter AI
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a creative startup idea generator.",
            },
            {
              role: "user",
              content: `
 
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
`

             
            },
          ],
        }),
      },
    );

    const data = await response.json();

    // Extract AI response
    const idea = data.choices?.[0]?.message?.content;

    if (!idea) {
      return res.status(500).json({
        success: false,
        error: "No response from AI",
      });
    }

    // Send back to frontend
    return res.status(200).json({
      success: true,
      idea,
    });
  } catch (error) {
    console.error("ERROR:", error);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
}
