import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPersonBySupabaseId } from "@/lib/cognodb/person";
import { getJobById } from "@/lib/cognodb/jobs";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const person = await getPersonBySupabaseId(user.id);

    if (!person) {
      return NextResponse.json(
        { error: "Career profile not found" },
        { status: 404 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    const job = await getJobById(id, user.id);

    if (!job) {
      return NextResponse.json(
        { error: "Job opportunity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Job API error:", error);

    return NextResponse.json(
      { error: "Unable to load job opportunity" },
      { status: 500 }
    );
  }
}