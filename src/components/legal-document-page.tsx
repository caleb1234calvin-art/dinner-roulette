import { Link } from "@tanstack/react-router";
import documents from "@/lib/legal/documents.json";
import { SUPPORT_EMAIL } from "@/lib/legal/support";

type LegalSection = { id: string; title: string; paragraphs: string[]; bullets?: string[]; links?: { label: string; url: string }[] };
type LegalDocument = { title: string; version: string; status: string; effectiveDate: string; sections: LegalSection[] };

export function LegalDocumentPage({ documentId }: { documentId: "privacy" | "terms" }) {
  const document: LegalDocument = documents[documentId];
  return <main className="px-4 pt-6 pb-8 break-words">
    <Link to="/settings" className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Back to Settings</Link>
    <h1 className="font-display mt-3 text-3xl text-fg">{document.title}</h1>
    <p className="mt-3 text-sm text-muted">Version {document.version}</p>
    <p className="mt-1 text-sm text-muted">Effective date: {document.effectiveDate}</p>
    <p className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-fg" role="note">{document.status}</p>
    <nav aria-label={`${document.title} contents`} className="mt-6 rounded-xl bg-surface p-4 shadow-border">
      <h2 className="text-sm font-medium text-fg">In this document</h2>
      <ul className="mt-2 space-y-1">{document.sections.map((section) => <li key={section.id}><a className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent" href={`#${section.id}`}>{section.title}</a></li>)}</ul>
    </nav>
    {document.sections.map((section) => <section key={section.id} id={section.id} className="mt-8 scroll-mt-6" aria-labelledby={`${section.id}-heading`}>
      <h2 id={`${section.id}-heading`} className="font-display text-xl text-fg">{section.title}</h2>
      {section.paragraphs.map((paragraph, index) => <p key={index} className="mt-3 text-sm leading-7 text-muted">{paragraph}</p>)}
      {section.bullets ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">{section.bullets.map((item, index) => <li key={index}>{item}</li>)}</ul> : null}
      {section.links ? <ul className="mt-3 space-y-1">{section.links.map((link) => <li key={link.url}><a className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent" href={link.url} rel="noreferrer">{link.label}</a></li>)}</ul> : null}
    </section>)}
    <footer className="mt-8 border-t border-border pt-4 text-sm leading-7 text-muted"><p>Support and privacy: <a className="break-all text-fg underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p><p>Caustic Relay / Pick For Us</p></footer>
  </main>;
}
