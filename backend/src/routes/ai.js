// routes/ai.js
const express = require('express');
const Groq = require("groq-sdk");
const Fertilizer = require("../models/Fertilizer.js");
const About = require("../models/About.js");

const router = express.Router();

// Initialize Groq lazily to prevent crash if key is missing
let groq;
const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      console.warn("WARNING: GROQ_API_KEY is missing. AI Chat will not work.");
      return null;
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
};


// ====================== MAIN AI CHAT ROUTE ======================
const aiChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ reply: "Please send a valid message." });
    }

    const lastUserMessage =
      messages.filter((m) => m.role === "user").pop()?.content || "";

    // ==================== FETCH ABOUT ====================
    let aboutDoc = await About.findOne().lean();
    if (!aboutDoc) {
      aboutDoc = {
        content:
          "FertilizerHub is a platform dedicated to Ethiopian farmers, providing access to essential fertilizers, real-time news, and support. Farmers can register, browse available fertilizers, and place orders directly through the platform.",
      };
    }

    const aboutText = aboutDoc.content || "Ethiopian fertilizer distribution platform.";

    // ==================== IMPROVED FERTILIZER SEARCH ====================
    let relevantFertilizers = [];

    if (lastUserMessage) {
      // Extract keywords from user message for better matching
      const keywords = lastUserMessage.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      
      // Build search conditions for each keyword
      const searchConditions = keywords.map(keyword => ({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { type: { $regex: keyword, $options: "i" } }
        ]
      }));

      // Search with multiple keyword matching
      if (searchConditions.length > 0) {
        relevantFertilizers = await Fertilizer.find({
          $and: searchConditions
        })
        .limit(5)
        .lean();
      }

      // Fallback: if no fertilizers found with all keywords, try any keyword match
      if (relevantFertilizers.length === 0 && keywords.length > 0) {
        relevantFertilizers = await Fertilizer.find({
          $or: [
            { name: { $regex: lastUserMessage, $options: "i" } },
            { type: { $regex: lastUserMessage, $options: "i" } }
          ],
        })
        .limit(5)
        .lean();
      }
    }

    // Final fallback: get recent fertilizers if nothing found
    if (relevantFertilizers.length === 0) {
      relevantFertilizers = await Fertilizer.find({ status: 'available' }).sort({ createdAt: -1 }).limit(5).lean();
    }

    // ==================== BUILD CONTEXT ====================
    const context = `
ABOUT THE WEBSITE:
${aboutText}

AVAILABLE FERTILIZERS:
${relevantFertilizers
  .map(
    (f) =>
      `- ${f.name} (${f.type || "General"}) - Price: ${f.pricePerQuintal} ETB per Quintal - Quantity Available: ${f.quantity} Quintals - Status: ${f.status} - Posted on: ${new Date(f.createdAt).toLocaleDateString()}`
  )
  .join("\n")}

HOW TO ORDER/REGISTER:
- To register: Click the 'Get Started' or 'Sign up' button on the navigation bar.
- To order: Once registered and logged in, you can see available fertilizers in your dashboard or notifications. Click on a fertilizer to see details and order.
    `.trim();

    // ==================== SYSTEM PROMPT ====================
    const systemPrompt = `You are a friendly, helpful, and enthusiastic AI assistant for FertilizerHub.
Use ONLY the provided context to answer accurately.
Please give short and concise answers. Avoid long explanations.
If the user asks about fertilizers, prices, or availability, use the AVAILABLE FERTILIZERS section.
If the user asks about the website or how to use it, use the ABOUT THE WEBSITE and HOW TO ORDER/REGISTER sections.
Never answer general questions unrelated to fertilizers or this website. If asked, politely state that you are a FertilizerHub assistant and can only help with site-related inquiries.
Be concise, polite, and natural. Suggest relevant fertilizers when it makes sense.
After every response, end with a short invitation to visit our Support page at /support for any questions. Use the exact route /support in the reply.`;

    // ==================== GROQ GENERATION ====================
    const client = getGroqClient();
    if (!client) {
      return res.json({ reply: "AI Chat is currently unavailable. Please contact the administrator." });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nContext:\n${context}`,
        },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      reply:
        "Sorry, I am having trouble responding right now. Please try again in a moment!",
    });
  }
};

router.post('/', aiChat);

module.exports = router;