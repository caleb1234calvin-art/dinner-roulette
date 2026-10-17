export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: { label: string; url: string }[];
};
export type LegalDocument = {
  title: string;
  version: string;
  status: string;
  effectiveDate: string | null;
  proposedPublicationDate?: string | null;
  publicationTimeZone?: string | null;
  sections: LegalSection[];
};
export type LegalRelease = {
  version: string;
  status: string;
  effectiveDate: string | null;
  proposedPublicationDate?: string | null;
  publicationTimeZone?: string | null;
  changeType: string;
  summary: string[];
  requiresPrivacyConsent: boolean;
  requiresTermsAgreement: boolean;
};
export type ArchivedLegalRelease = LegalRelease & {
  documents: { privacy: LegalDocument; terms: LegalDocument };
};
export const LEGAL_NOTICE_STORAGE_KEY = "pick-for-us-legal-notice-dismissed";

// Deliberately not a consent/acceptance record. No clock-based activation.
export function materialNotice(release: LegalRelease, dismissedVersion: string | null) {
  return (
    release.status === "published" &&
    release.effectiveDate !== null &&
    release.changeType === "material" &&
    release.version !== dismissedVersion
  );
}
export function publicationLabel(release: {
  status: string;
  effectiveDate: string | null;
  proposedPublicationDate?: string | null;
  publicationTimeZone?: string | null;
}) {
  return release.status === "published" && release.effectiveDate
    ? `Effective date: ${release.effectiveDate}` + (release.publicationTimeZone ? ` (${release.publicationTimeZone})` : "")
    : "Not yet published or effective. The effective date will be set for the authorized publication." +
        (release.proposedPublicationDate
          ? ` Proposed publication date: ${release.proposedPublicationDate}, subject to readiness and separate release approval.`
          : "");
}
