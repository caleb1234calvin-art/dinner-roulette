import { Link } from "@tanstack/react-router";
import documents from "@/lib/legal/documents.json";
import { SUPPORT_EMAIL } from "@/lib/legal/support";

import history from "@/lib/legal/history.json";
import {
  publicationLabel,
  type LegalDocument,
  type ArchivedLegalRelease,
} from "@/lib/legal/releases";

export function LegalDocumentPage({ documentId }: { documentId: "privacy" | "terms" }) {
  const document: LegalDocument = documents[documentId];
  return (
    <main className="px-4 pt-6 pb-8 break-words">
      <Link
        to="/settings"
        className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
      >
        Back to Settings
      </Link>
      <h1 className="font-display mt-3 text-3xl text-fg">{document.title}</h1>
      <p className="mt-3 text-sm text-muted">Version {document.version}</p>
      <p className="mt-1 text-sm text-muted">{publicationLabel(document)}</p>
      <nav
        aria-label={`${document.title} contents`}
        className="mt-6 rounded-xl bg-surface p-4 shadow-border"
      >
        <h2 className="text-sm font-medium text-fg">In this document</h2>
        <ul className="mt-2 space-y-1">
          {document.sections.map((section) => (
            <li key={section.id}>
              <a
                className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
                href={`#${section.id}`}
              >
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <a
              className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
              href="#version-history"
            >
              Version history
            </a>
          </li>
        </ul>
      </nav>
      {document.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mt-8 scroll-mt-6"
          aria-labelledby={`${section.id}-heading`}
        >
          <h2 id={`${section.id}-heading`} className="font-display text-xl text-fg">
            {section.title}
          </h2>
          {section.paragraphs.map((paragraph, index) => (
            <p key={index} className="mt-3 text-sm leading-7 text-muted">
              {paragraph}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
              {section.bullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.links ? (
            <ul className="mt-3 space-y-1">
              {section.links.map((link) => (
                <li key={link.url}>
                  <a
                    className="inline-flex min-h-11 items-center rounded-md text-sm text-fg underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent"
                    href={link.url}
                    rel="noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
      <section
        id="version-history"
        className="mt-8 scroll-mt-6"
        aria-labelledby="version-history-heading"
      >
        <h2 id="version-history-heading" className="font-display text-xl text-fg">
          Version history
        </h2>
        <h3 className="mt-3 text-sm font-medium">
          Version {history.current.version} ·{" "}
          {history.current.status === "published" ? "Published" : "Prepared for publication"}
        </h3>
        <p className="mt-2 text-sm text-muted">{publicationLabel(history.current)}</p>
        <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-muted">
          {history.current.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {history.previous.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No previous published versions.</p>
        ) : (
          (history.previous as ArchivedLegalRelease[]).map((release) => (
            <details key={release.version} className="mt-4 rounded-xl border border-border p-4">
              <summary className="min-h-11 cursor-pointer text-sm">
                Version {release.version} · Effective {release.effectiveDate}
              </summary>
              <ul className="list-disc pl-5 text-sm leading-7 text-muted">
                {release.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {release.documents[documentId].sections.map((section) => (
                <section key={section.id} className="mt-4">
                  <h3 className="text-sm font-medium">{section.title}</h3>
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i} className="mt-2 text-sm leading-7 text-muted">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets?.map((item, i) => (
                    <p key={i} className="mt-2 text-sm text-muted">
                      {item}
                    </p>
                  ))}
                  {section.links?.map((link) => (
                    <p key={link.url}>
                      <a
                        className="inline-flex min-h-11 items-center text-sm underline"
                        href={link.url}
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    </p>
                  ))}
                </section>
              ))}
            </details>
          ))
        )}
      </section>
      <footer className="mt-8 border-t border-border pt-4 text-sm leading-7 text-muted">
        <p>
          Support and privacy:{" "}
          <a className="break-all text-fg underline" href={`mailto:${SUPPORT_EMAIL}`}>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p>Caustic Relay / Pick For Us</p>
      </footer>
    </main>
  );
}
