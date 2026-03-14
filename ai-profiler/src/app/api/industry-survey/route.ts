import { NextResponse } from "next/server";
import { promises as fs } from "fs";

const SURVEY_JSON_PATH =
  "/Users/coe-kboyd/Downloads/survey_questions.json";

export async function GET() {
  try {
    const file = await fs.readFile(SURVEY_JSON_PATH, "utf-8");
    const data = JSON.parse(file);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to read survey_questions.json", error);
    return NextResponse.json(
      { error: "Failed to load survey configuration" },
      { status: 500 }
    );
  }
}

