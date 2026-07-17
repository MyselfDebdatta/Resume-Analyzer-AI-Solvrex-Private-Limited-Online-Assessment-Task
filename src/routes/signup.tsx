import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — ResumePilot" },
      {
        name: "description",
        content: "Create a free ResumePilot account and save every scorecard.",
      },
    ],
  }),
  component: () => <AuthShell mode="signup" />,
});
