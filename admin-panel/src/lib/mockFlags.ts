import type { FeatureFlag } from "./types";

export const mockFlags: FeatureFlag[] = [
  {
    id: "f-01",
    key: "ai_substring_validation",
    name: "Enable AI Substring Validation",
    description:
      "Highlights guaranteed-return and promissory language inside documents and chat attachments.",
    enabled: true,
    environment: "Production",
  },
  {
    id: "f-02",
    key: "presidio_pii_masking",
    name: "Enable Presidio PII Masking",
    description:
      "Masks SSN, account numbers, and dates of birth in previews and AI responses.",
    enabled: true,
    environment: "All",
  },
  {
    id: "f-03",
    key: "precedent_lookup",
    name: "Enable Precedent Lookup",
    description:
      "Surfaces similar historical reviews when a new violation is flagged.",
    enabled: false,
    environment: "Staging",
  },
  {
    id: "f-04",
    key: "realtime_surveillance",
    name: "Enable Real-Time Surveillance",
    description:
      "Streams advisor communications into Robert Surveillance with live risk scoring.",
    enabled: true,
    environment: "Production",
  },
  {
    id: "f-05",
    key: "auto_redaction",
    name: "Enable Auto-Redaction Export",
    description:
      "Applies redaction templates when exporting VDR packages for external counsel.",
    enabled: false,
    environment: "Staging",
  },
  {
    id: "f-06",
    key: "tree_auto_layout",
    name: "Enable Tree Auto-Layout",
    description:
      "Turns on hierarchical auto-layout and mini-map in the visual policy editor.",
    enabled: true,
    environment: "All",
  },
];
