import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/test2")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ url: request.url, method: request.method }));
      },
    },
  },
});
