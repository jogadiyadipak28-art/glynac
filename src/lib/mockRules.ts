import type { ComplianceRule } from "./types";

export const mockRules: ComplianceRule[] = [
  {
    id: "r-01",
    code: "FINRA-2210",
    name: "Communications with the Public",
    description:
      "Retail communications must be fair, balanced, and reviewed before distribution.",
    severity: "Critical",
    active: true,
    lastUpdated: "2026-09-18",
    owner: "Marcus Chen",
  },
  {
    id: "r-02",
    code: "SEC-17a-4",
    name: "Books and Records Retention",
    description:
      "Electronic communications and records must be retained in non-rewriteable storage.",
    severity: "High",
    active: true,
    lastUpdated: "2026-08-02",
    owner: "Elena Vasquez",
  },
  {
    id: "r-03",
    code: "DISC-09",
    name: "Disclosure Timing",
    description:
      "Material conflicts and fee disclosures must be delivered before account opening.",
    severity: "High",
    active: true,
    lastUpdated: "2026-09-29",
    owner: "Amina Haddad",
  },
  {
    id: "r-04",
    code: "FINRA-3110",
    name: "Supervisory Procedures",
    description:
      "Firms must establish written supervisory procedures covering advisor activity.",
    severity: "Critical",
    active: true,
    lastUpdated: "2026-07-11",
    owner: "Kenji Watanabe",
  },
  {
    id: "r-05",
    code: "SEC-206-4",
    name: "Advertising Rule",
    description:
      "Prohibits testimonials, guaranteed returns, and misleading performance claims.",
    severity: "Critical",
    active: true,
    lastUpdated: "2026-10-01",
    owner: "Marcus Chen",
  },
  {
    id: "r-06",
    code: "AML-03",
    name: "Suspicious Activity Escalation",
    description:
      "Unusual wire patterns and third-party deposits must be escalated within 24 hours.",
    severity: "High",
    active: true,
    lastUpdated: "2026-06-21",
    owner: "Hannah Park",
  },
  {
    id: "r-07",
    code: "PII-12",
    name: "Client PII Masking",
    description:
      "SSN, account numbers, and DOB must be masked outside of authorized review contexts.",
    severity: "Medium",
    active: true,
    lastUpdated: "2026-09-04",
    owner: "Hannah Park",
  },
  {
    id: "r-08",
    code: "SUIT-04",
    name: "Investment Suitability",
    description:
      "Recommendations must map to documented risk tolerance and investment objectives.",
    severity: "High",
    active: false,
    lastUpdated: "2026-05-16",
    owner: "Priya Nair",
  },
  {
    id: "r-09",
    code: "ARCH-21",
    name: "Message Archive Completeness",
    description:
      "Chat, email, and SMS channels must archive with immutable audit identifiers.",
    severity: "Medium",
    active: true,
    lastUpdated: "2026-08-28",
    owner: "James Okafor",
  },
  {
    id: "r-10",
    code: "GIFT-02",
    name: "Gift and Entertainment Limits",
    description:
      "Client gifts above $100 require pre-approval and dual-control logging.",
    severity: "Low",
    active: false,
    lastUpdated: "2026-04-09",
    owner: "Claire Bennett",
  },
];
