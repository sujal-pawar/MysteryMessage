import OpenAI from "openai";
import { streamText } from "ai";
import { Stream } from "openai/streaming.mjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

// Initialize OpenAI with API key from env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Allow response to stream up to 30 seconds
export const maxDuration = 30;

// Schema for username validation
const UsernameQuerySchema = z.object({
  username: z.string().min(1)
});

// Add GET method to check if user exists and is accepting messages
export async function GET(request: Request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username')
    };
    
    // Validate username
    const result = UsernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      return Response.json({
        success: false,
        message: "Invalid username"
      }, { status: 400 });
    }
    
    const { username } = result.data;
    
    // Find user
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      isAcceptingMessages: user.isAcceptingMessages
    }, { status: 200 });
  } catch (error) {
    console.error("Error checking user:", error);
    return Response.json({
      success: false,
      message: "Error checking user"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: prompt }],
      stream: false,
    });
    
    // Return the first choice's content
    return Response.json({
      success: true,
      suggestions: response.choices[0]?.message?.content || ''
    }, { status: 200 });

  } catch (err: any) {
    // If it's an OpenAI API error
    if (err.name === "APIError" && err.status) {
      return Response.json({
        success: false,
        error: err.message,
      }, {
        status: err.status,
      });
    }

    // Any other error
    console.error("Unexpected error in /api/suggested-messages:", err);
    return Response.json({
      success: false,
      error: "Internal server error",
    }, {
      status: 500,
    });
  }
}

