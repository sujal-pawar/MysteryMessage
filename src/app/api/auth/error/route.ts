import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get("error");
  
  console.error("Authentication error:", error);
  
  return NextResponse.json({ 
    error: error || "Unknown authentication error",
    message: "Authentication failed. Please check error details.",
    url: request.url
  }, { status: 400 });
}
