import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK with User-Agent and key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route first: Diagnostic Dental Advisor endpoint using Gemini API
  app.post("/api/gemini/advisor", async (req, res) => {
    try {
      const { concern } = req.body;
      if (!concern || typeof concern !== "string" || concern.trim().length === 0) {
        return res.status(400).json({ error: "Dental concern is required." });
      }

      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
        // Graceful local fallback if Gemini key is not configured yet
        return res.json({
          analysis: `Hello! I am your Dental Square virtual assistant. To get a customized AI assessment from Dr. Prabhjot Kaur's practice, please add your GEMINI_API_KEY in the Secrets panel. Here's a quick general tip: For pain or queries, we strongly advise scheduling a clinical examination.`,
          assessmentPoints: [
            "Maintain daily dental hygiene by brushing and flossing twice.",
            "Avoid direct biting on any sore dental structures.",
            "Consider scheduling a diagnostic intraoral scan for precise examination."
          ],
          matchedService: "Professional Cleaning",
          careTips: "Drink room-temperature water and avoid extreme temperatures until you consult our team.",
          isFallback: true
        });
      }

      const systemPrompt = `You are the Virtual Dental Advisor at Dental Square (New Amritsar) led by Dr. Prabhjot Kaur. 
Assess the user's dental concern. Ensure your assessment is highly empathetic, comforting, professional, and clear.
Structure your assessment points and match the concern to EXACTLY one of these available clinical treatments:
- 'Professional Cleaning'
- 'Pediatric (kids) Dentistry'
- 'Micro-Fillings'
- 'Digital Teeth Scanning'
- 'Root Canal Treatment'
- 'Crowns & Bridges'
- 'Gum Surgery'
- 'Dental Implants'
- 'Teeth Whitening'
- 'Braces & Orthodontics'

Always highlight that this is an educational mock planner and not a final medical diagnosis. Always recommend a direct clinical checkup at our Amritsar clinic. Keep text concise, warm, and highly professional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Patient's Dental Concern/Symptoms: "${concern}"`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: {
                type: Type.STRING,
                description: "A compassionate, patient-friendly diagnostic discussion of the possible factors."
              },
              assessmentPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "2-3 short, clean bullet points detailing immediate advice or possible causes."
              },
              matchedService: {
                type: Type.STRING,
                description: "The exact matching service name from our clinic's approved list."
              },
              careTips: {
                type: Type.STRING,
                description: "Short practical advice or care tips for the patient to follow before they visit."
              }
            },
            required: ["analysis", "assessmentPoints", "matchedService", "careTips"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        const parsedData = JSON.parse(resultText);
        return res.json(parsedData);
      } else {
        throw new Error("No response text from Gemini API.");
      }

    } catch (error: any) {
      console.error("Gemini Advisor Endpoint Error:", error);
      res.status(500).json({
        error: "Unable to process dental advice. Please try again soon.",
        details: error?.message || ""
      });
    }
  });

  // Vite middleware for development (or fallback if production build is missing/incomplete)
  const distPath = path.join(process.cwd(), 'dist');
  const hasBuild = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV !== "production" || !hasBuild) {
    console.log("Starting server with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production build from:", distPath);
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        } else if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
        } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
          res.setHeader('Content-Type', 'image/jpeg');
        } else if (filePath.endsWith('.svg')) {
          res.setHeader('Content-Type', 'image/svg+xml');
        } else if (filePath.endsWith('.webp')) {
          res.setHeader('Content-Type', 'image/webp');
        } else if (filePath.endsWith('.json')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dental Square Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start fullstack server:", error);
});
