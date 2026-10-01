declare module "virtual:grok-og-identity" {
  export const grokOgIdentity: {
    manifest: Record<string, unknown>;
    site: {
      title?: string;
      description?: string;
      type?: string;
      card?: string;
      image?: string;
      banner?: string;
      color?: string;
      canonicalOrigin?: string;
    };
  };
}
