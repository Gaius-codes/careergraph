import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPersonBySupabaseId } from "@/lib/cognodb/person";
import { getNodeConnections } from "@/lib/cognodb/explorer";
import { runQuery } from "@/lib/cognodb/client";

export async function GET(request, { params }) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { nodeId } = await params;

    if (!nodeId) {
      return NextResponse.json(
        { error: "Node ID is required" },
        { status: 400 }
      );
    }

    // Make sure this user has a Person in the graph.
    const person = await getPersonBySupabaseId(user.id);

    if (!person) {
      return NextResponse.json(
        { error: "Career profile not found" },
        { status: 404 }
      );
    }

    // Check reachability across up to 3 hops if target is not the user's Person node
    const isPerson = nodeId === person.id;

    if (!isPerson) {
      const query = `
        MATCH (p:Person {id: $personId})
        MATCH (target {id: $nodeId})

        MATCH path = (p)-[*1..3]-(target)

        RETURN count(path) > 0 AS reachable
        LIMIT 1
      `;

      const result = await runQuery(query, {
        personId: person.id,
        nodeId,
      });

      const reachable = result[0]?.get("reachable");

      if (!reachable) {
        return NextResponse.json(
          { error: "Node is outside your graph" },
          { status: 403 }
        );
      }
    }

    // Target node is authorized; fetch connections
    const connections = await getNodeConnections(nodeId);

    return NextResponse.json(
      isPerson
        ? { node: person, connections }
        : { nodeId, connections }
    );
  } catch (error) {
    console.error("Graph API error:", error);

    return NextResponse.json(
      { error: "Unable to explore the graph" },
      { status: 500 }
    );
  }
}