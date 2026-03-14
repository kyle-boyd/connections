import { NextResponse } from "next/server";
import data from "./survey_questions.json";

export async function GET() {
  return NextResponse.json(data);
}

