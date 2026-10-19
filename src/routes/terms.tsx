import { createFileRoute } from "@tanstack/react-router";
import { LegalDocumentPage } from "@/components/legal-document-page";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions | Pick For Us" }] }),
  component: () => <LegalDocumentPage documentId="terms" />,
});
