import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch, { Headers } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Gemini AI-related interesting content
const geminiContent = [
  "Welcome to the Gemini AI server! 🤖 Where intelligence meets innovation.",
  "Did you know? Gemini AI is designed to handle multimodal data, enabling it to process both text and images simultaneously! 🧠",
  "Fun fact: Gemini AI can analyze billions of data points in seconds, providing insights faster than ever before. ⚡",
  "Motivational Quote: 'The future of AI isn't just automation; it's augmentation, and Gemini AI leads the way.' 🚀",
  "Hello there! Gemini AI is your partner in creating smarter, more human-centric technology. 💡",
];

// Home route
app.get("/", (req, res) => {
  // Randomly select a Gemini AI-related message to display
  const randomMessage =
    geminiContent[Math.floor(Math.random() * geminiContent.length)];
  res.send(`
    <html>
      <head>
        <title>Welcome to Gemini AI</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 20%;
            background-color: #f9f9f9;
            color: #333;
          }
          h1 {
            color: #4caf50;
          }
          p {
            color: #555;
          }
        </style>
      </head>
      <body>
        <h1>${randomMessage}</h1>
        <p>Thank you for exploring the world of Gemini AI! 🌟</p>
      </body>
    </html>
  `);
});

// Chat route
app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt; // Get the prompt from the request body

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    // Call Gemini API to generate the content based on the provided prompt
    console.log("Prompt received:", prompt); // Debugging
    const result = await model.generateContent(prompt);
    console.log("AI Response:", result.response.text()); // Debugging

    // Send the response text back to the client
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("Error while calling Gemini API:", error.message); // More descriptive error
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
