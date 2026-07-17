import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Resume Analyzer AI" },
      {
        name: "description",
        content: "Create a free Resume Analyzer AI account and save every scorecard.",
      },
    ],
  }),
  component: () => <AuthShell mode="signup" />,
});
