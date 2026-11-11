/** Site navigation, shared by the assistant sidebar and the top bar of the tool pages. */
export const TOOL_LINKS: Array<{ href: string; label: string; description: string }> = [
  { href: "/learn", label: "Reader", description: "Browse the stored textbook summaries" },
  { href: "/anatomy", label: "Column anatomy", description: "The optical column, stage by stage" },
  { href: "/simulator", label: "Diffraction simulator", description: "SAED patterns and electron wavelength" },
  { href: "/image-analysis", label: "Micrograph analysis", description: "Particle sizing from an image" },
  { href: "/exam", label: "Exam practice", description: "Questions with marking rubrics" },
  { href: "/knowledge-map", label: "Concept map", description: "How the topics connect" },
  { href: "/technique-guide", label: "Technique guide", description: "Choosing the right technique" },
  { href: "/troubleshooter", label: "Troubleshooter", description: "Alignment and imaging faults" },
];
