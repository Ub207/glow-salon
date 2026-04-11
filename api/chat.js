export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please provide a message" });
  }

  try {
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
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
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "API request failed");
    }

    return res.status(200).json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      reply: `Sorry, something went wrong: ${error.message}`
    });
  }
}
