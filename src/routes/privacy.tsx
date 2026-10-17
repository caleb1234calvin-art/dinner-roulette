import { createFileRoute } from "@tanstack/react-router";
import { LegalDocumentPage } from "@/components/legal-document-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy | Pick For Us" }] }),
  component: () => <LegalDocumentPage documentId="privacy" />,
});
