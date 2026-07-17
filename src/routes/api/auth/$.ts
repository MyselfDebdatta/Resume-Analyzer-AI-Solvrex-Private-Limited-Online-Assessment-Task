import { createFileRoute } from "@tanstack/react-router";
import { auth } from "../../../lib/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log("AUTH GET Request:", request.url, "Origin:", request.headers.get("origin"), "Host:", request.headers.get("host"));
        try {
          return await auth.handler(request);
        } catch (e: any) {
          console.error("Auth handler error:", e);
          return new Response(JSON.stringify({ error: e.message || "Internal server error" }), { status: 500 });
        }
      },
      POST: async ({ request }) => {
        console.log("AUTH POST Request:", request.url, "Origin:", request.headers.get("origin"), "Host:", request.headers.get("host"));
        try {
          return await auth.handler(request);
        } catch (e: any) {
          console.error("Auth handler error:", e);
          return new Response(JSON.stringify({ error: e.message || "Internal server error" }), { status: 500 });
        }
      },
    },
  },
});
