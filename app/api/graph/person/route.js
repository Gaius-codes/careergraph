import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPersonBySupabaseId } from "@/lib/cognodb/person";

export async function GET() {
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

    return NextResponse.json({ person });
  } catch (error) {
    console.error("Person API error:", error);

    return NextResponse.json(
      { error: "Unable to load career profile" },
      { status: 500 }
    );
  }
}