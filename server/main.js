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
