const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    console.log("Received message:", userMessage);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful salon assistant."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    console.log("Groq API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Error details:", error.message);
    res.status(500).json({ 
      reply: `Sorry, something went wrong: ${error.message}` 
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});