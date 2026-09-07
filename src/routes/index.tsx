import { createFileRoute } from "@tanstack/react-router";
import { ModeHome } from "@/components/mode-home";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ModeHome />;
}
