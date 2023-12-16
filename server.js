import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { safetySettings, generationConfig } from "./settings.js";

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());

// Converting all requests to JSON
app.use(express.json());

const MODEL_NAME = process.env.MODEL_NAME;
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Define a route for the GET request
app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/geminiapi", async (req, res) => {
  const text = req.body.text;
  const parts = [{ text }];
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });
  const response = result.response;

  res.json({ response: response.text() });
});

// Define the port to listen on
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
