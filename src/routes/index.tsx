import { createFileRoute } from "@tanstack/react-router";
import { PickHome } from "@/components/pick-home";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PickHome />;
}
