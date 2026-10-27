/**
 * Robust response parser for Carter-grounded responses
 */

export interface ParsedGroundedResponse {
  fromCarter: string;
  additionalExplanation: string;
}

export function parseGroundedResponse(text: string): ParsedGroundedResponse {
  if (!text) return { fromCarter: "", additionalExplanation: "" };

  // Look for boundary delimiter where additional explanation, scientific mechanism, or guidance starts
  const splitPattern = /(?:^|\n)#{1,4}\s*(?:ADDITIONAL\s+(?:SCIENTIFIC\s+)?EXPLANATION|SCIENTIFIC\s+MECHANISM[^\n]*|MECHANISM\s+&[^\n]*|ADDITIONAL\s+ANALYSIS|TUTOR\s+STEP-BY-STEP[^\n]*|MODEL\s+EXAMINATION[^\n]*|LABORATORY\s+DIAGNOSTIC[^\n]*|LAB\s+PROTOCOL[^\n]*|STEP-BY-STEP\s+GUIDANCE|EXPLANATION\s+&[^\n]*|PRACTICAL\s+MICROSCOPY[^\n]*)/i;

  const matchIndex = text.search(splitPattern);
  if (matchIndex !== -1) {
    let fromCarterPart = text.slice(0, matchIndex).trim();
    let additionalPart = text.slice(matchIndex).trim();

    // Strip redundant leading heading markers from fromCarterPart
    fromCarterPart = fromCarterPart.replace(/^#{1,4}\s*FROM\s+CARTER[^\n]*\n?/i, "").trim();
    fromCarterPart = fromCarterPart.replace(/^#{1,4}\s*EXECUTIVE\s+SUMMARY[^\n]*\n?/i, "").trim();
    additionalPart = additionalPart.replace(/^#{1,4}\s*(?:ADDITIONAL\s+(?:SCIENTIFIC\s+)?EXPLANATION|SCIENTIFIC\s+MECHANISM[^\n]*|MECHANISM\s+&[^\n]*|TUTOR\s+STEP-BY-STEP[^\n]*|MODEL\s+EXAMINATION[^\n]*|LABORATORY\s+DIAGNOSTIC[^\n]*)[^\n]*\n?/i, "").trim();

    return {
      fromCarter: fromCarterPart,
      additionalExplanation: additionalPart,
    };
  }

  // If text has an explicit "### FROM CARTER" heading anywhere
  const carterMatch = text.match(/(?:^|\n)#{1,4}\s*FROM\s+CARTER[^\n]*\n([\s\S]*)/i);
  if (carterMatch) {
    let carterPart = carterMatch[1].trim();
    carterPart = carterPart.replace(/^#{1,4}\s*FROM\s+CARTER[^\n]*\n?/i, "").trim();
    return {
      fromCarter: carterPart,
      additionalExplanation: "",
    };
  }

  return {
    fromCarter: "",
    additionalExplanation: text.trim(),
  };
}
