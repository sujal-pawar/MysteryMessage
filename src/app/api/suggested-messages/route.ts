import OpenAI from "openai";
import { streamText } from "ai";
import { Stream } from "openai/streaming.mjs";

// Initialize OpenAI with API key from env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Allow response to stream up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: prompt }],
        stream: true,
      });
  
      // Convert the OpenAI stream to a readable stream
      const stream = OpenAIStream(response);

  } catch (err: any) {
    // If it's an OpenAI API error
    if (err.name === "APIError" && err.status) {
      return new Response(JSON.stringify({
        error: err.message,
      }), {
        status: err.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Any other error
    console.error("Unexpected error in /api/chat:", err);
    return new Response(JSON.stringify({
      error: "Internal server error",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
function OpenAIStream(response: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> & { _request_id?: string | null; }) {
    throw new Error("Function not implemented.");
}

