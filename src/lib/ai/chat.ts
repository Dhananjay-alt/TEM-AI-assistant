/**
 * TEM-AI Chat Engine with Carter RAG & Gemini Pro
 */

import { getGenAIClient, IS_LIVE_AI_AVAILABLE, AI_CONFIG } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";
import { retrieveCarterKnowledge, RetrievedSource } from "@/lib/rag/vector-search";

export type ChatMode = "ASK" | "TUTOR" | "EXAM" | "EXPERIMENT";

export interface ChatResponse {
  answer: string;
  fromCarter: string;
  additionalExplanation: string;
  citations: RetrievedSource[];
  mode: ChatMode;
  isLiveAi: boolean;
  provider: string;
  suggestedQuestions?: string[];
}

export async function generateCarterChatResponse(
  query: string,
  mode: ChatMode = "ASK",
  examSubtype?: "2mark" | "5mark" | "10mark" | "viva" | "mcq"
): Promise<ChatResponse> {
  // 1. Retrieve grounded Carter knowledge
  const ragResult = retrieveCarterKnowledge(query, 3);
  const bestMatch = ragResult.bestMatch;

  // 2. Build system instruction based on mode
  let modeInstruction = SYSTEM_PROMPTS.ASK_MODE;
  if (mode === "TUTOR") modeInstruction = SYSTEM_PROMPTS.TUTOR_MODE;
  if (mode === "EXAM") modeInstruction = `${SYSTEM_PROMPTS.EXAM_MODE}\nSpecific Exam Subtype: ${examSubtype || "5mark"}`;
  if (mode === "EXPERIMENT") modeInstruction = SYSTEM_PROMPTS.EXPERIMENT_MODE;

  const fullPrompt = `${SYSTEM_PROMPTS.BASE_CARTER}\n\n${modeInstruction}\n\n--- RETRIEVED CARTER TEXTBOOK GROUND TRUTH ---\n${ragResult.carterContextText}\n-----------------------------------------------\n\nStudent Query: "${query}"\n\nPlease formulate your answer now. Distinguish explicitly between "### FROM CARTER" (grounded in the textbook context) and "### ADDITIONAL SCIENTIFIC EXPLANATION".`;

  // 3. If Live Gemini Pro is available, attempt API call
  const client = getGenAIClient();
  if (client && IS_LIVE_AI_AVAILABLE) {
    try {
      const response = await client.models.generateContent({
        model: AI_CONFIG.modelName,
        contents: fullPrompt,
      });

      const text = response.text || "";
      if (text.trim().length > 0) {
        // Parse into Carter vs Additional if formatted
        const carterSplit = text.split(/### ADDITIONAL SCIENTIFIC EXPLANATION/i);
        const fromCarterPart = carterSplit[0] || text;
        const additionalPart = carterSplit[1] || "";

        return {
          answer: text,
          fromCarter: fromCarterPart.replace(/### FROM CARTER/i, "").trim(),
          additionalExplanation: additionalPart.trim(),
          citations: ragResult.sources,
          mode,
          isLiveAi: true,
          provider: "Google Gemini 1.5 Pro",
          suggestedQuestions: generateSuggestedQuestions(query, bestMatch),
        };
      }
    } catch (apiError) {
      console.warn("Live Gemini API call failed, falling back to grounded Carter simulation:", apiError);
    }
  }

  // 4. Grounded Carter Fallback Engine (Demo Mode)
  return buildGroundedDemoResponse(query, mode, examSubtype, ragResult);
}

function buildGroundedDemoResponse(
  query: string,
  mode: ChatMode,
  examSubtype: string | undefined,
  ragResult: ReturnType<typeof retrieveCarterKnowledge>
): ChatResponse {
  const match = ragResult.bestMatch;
  const chapter = match ? `Chapter ${match.chapterNumber}: "${match.chapterTitle}"` : "Williams & Carter Foundations";
  const section = match ? `Section ${match.sectionNumber} ("${match.sectionTitle}", pp. ${match.page}-${match.pageEnd})` : "General Optics";

  let fromCarter = "";
  let additional = "";
  let fullAnswer = "";

  if (mode === "TUTOR") {
    fromCarter = `In Carter ${chapter}, ${section}, electron scattering is taught by examining the phase and amplitude of the electron wave:\n\n` +
      `• Fundamental Principle: ${match?.summary || "Electrons undergo coherent and incoherent interactions governed by atomic potentials."}\n` +
      `• Primary Reference: ${match?.excerpt.slice(0, 300)}...`;

    additional = `Let's break this down into three logical steps to master the concept:\n\n` +
      `Step 1: Real Space to Reciprocal Space\n` +
      `Think of the crystal as a periodic potential grating. When the electron beam passes through, each plane (hkl) redirects a fraction of amplitude by angle 2*theta_B.\n\n` +
      `Step 2: Aperture Selection\n` +
      `When we insert the objective aperture around the direct beam, any electrons scattered into Bragg angles are blocked. That is why diffracting crystals turn dark in Bright-Field.\n\n` +
      `🧠 Micro-Check Question:\n` +
      `"If you tilt the specimen so the crystal planes are rotated OFF the exact Bragg condition (s >> 0), will the specimen look brighter or darker in Bright-Field?" (Hint: Think about whether more or fewer electrons reach the aperture!)`;

    fullAnswer = `### FROM CARTER (Williams & Carter, ${chapter})\n${fromCarter}\n\n### TUTOR STEP-BY-STEP GUIDANCE\n${additional}`;
  } else if (mode === "EXAM") {
    const marks = examSubtype || "5mark";
    fromCarter = `Key Examination Points from Williams & Carter (${chapter}, ${section}):\n` +
      (match?.pedagogicalKeyPoints.map((p) => `✓ ${p}`).join("\n") || "✓ Direct relationship to wavelength and Bragg condition.");

    additional = `MODEL ANSWER [${marks.toUpperCase()}]`;
    if (marks === "2mark") {
      additional += `\nDefinition: ${match?.summary}\nKey Equation: ${match?.formulas?.[0] || "\\lambda = h/p"}\nEssential Condition: Specimen must be sufficiently thin to avoid multiple inelastic scattering events.`;
    } else {
      additional += `\n1. Physical Principle:\n${match?.excerpt.slice(0, 250)}...\n\n2. Analytical Expression:\n${match?.formulas?.join("\n") || "R * d = lambda * L"}\n\n3. Experimental Verification:\nUnder standard 200 kV operating conditions (lambda = 0.00251 nm), the large Ewald sphere radius cuts through reciprocal lattice rods, yielding the observed pattern.\n\n4. Examination Pitfall to Avoid:\nDo not confuse mass-thickness contrast with diffraction contrast; the former operates via high-angle incoherent Rutherford scattering, while the latter requires coherent crystalline Bragg diffraction.`;
    }

    fullAnswer = `### FROM CARTER (Exam Grounding: ${chapter})\n${fromCarter}\n\n### MODEL EXAMINATION ANSWER\n${additional}`;
  } else if (mode === "EXPERIMENT") {
    fromCarter = `According to Carter (${chapter}), experimental issues with contrast and resolution typically originate from specimen thickness, objective aperture misalignment, or beam astigmatism.`;

    additional = `LABORATORY TROUBLESHOOTING PROTOCOL:\n\n` +
      `1. Immediate Column Checks:\n` +
      `   • Check specimen height: Ensure the sample is at the true eucentric height (Z-axis wobbler).\n` +
      `   • Objective aperture check: Switch to diffraction mode to confirm whether the aperture is centered cleanly around the (000) beam.\n\n` +
      `2. Specimen Thickness Check:\n` +
      `   • If the image looks muddy and washed out, estimate t/lambda via EELS low-loss or thickness fringes. If t > 100 nm, chromatic aberration Cc*deltaE/E0 will severely degrade spatial resolution.\n\n` +
      `3. Astigmatism Correction:\n` +
      `   • Look at the amorphous carbon edge at high magnification (100kX-400kX). Adjust objective stigmators until Fresnel fringes are uniform in all azimuths across minimum contrast.`;

    fullAnswer = `### FROM CARTER (${chapter}, ${section})\n${fromCarter}\n\n### LABORATORY DIAGNOSTIC PROCEDURE\n${additional}`;
  } else {
    // Standard ASK mode
    fromCarter = `In Carter & Williams (${chapter}, ${section}):\n\n${match?.excerpt || "Transmission electron microscopy exploits the wave-particle duality of relativistic electrons to probe atomic structure and chemistry."}`;

    additional = `Detailed Physical Mechanism:\n\n` +
      `1. Relativistic Wavelength:\nAt standard 200 kV accelerating voltage, relativistic contraction reduces the electron wavelength to lambda = 0.00251 nm (2.51 pm), enabling sub-angstrom resolution.\n\n` +
      `2. Practical Laboratory Relevance:\nWhen operating the TEM, understanding this principle allows the microscopist to choose optimal aperture sizes and tilt conditions (e.g. two-beam g.b extinction for dislocations or Scherzer defocus for HRTEM lattice fringes).\n\n` +
      `3. Key Formulas:\n${match?.formulas?.map((f) => `• $$${f}$$`).join("\n") || "• $$R \\cdot d = \\lambda \\cdot L$$"}`;

    fullAnswer = `### EXECUTIVE SUMMARY\n${match?.summary || "Overview of transmission electron microscopy principles grounded in Barry Carter's textbook."}\n\n### FROM CARTER (${chapter})\n${fromCarter}\n\n### ADDITIONAL SCIENTIFIC EXPLANATION\n${additional}`;
  }

  return {
    answer: fullAnswer,
    fromCarter,
    additionalExplanation: additional,
    citations: ragResult.sources,
    mode,
    isLiveAi: false,
    provider: "Carter Grounded AI (Demo Engine)",
    suggestedQuestions: generateSuggestedQuestions(query, match),
  };
}

function generateSuggestedQuestions(query: string, match: RetrievedSource | null): string[] {
  if (!match) {
    return [
      "Why does diffraction contrast occur in TEM?",
      "How does the Ewald sphere relate to SAED patterns?",
      "What is Scherzer defocus in HRTEM?",
    ];
  }
  if (match.chapterNumber === 1 || match.chapterNumber === 2) {
    return [
      "How is the relativistic electron wavelength calculated?",
      "What is the difference between elastic and inelastic scattering?",
      "Why is chromatic aberration so severe in thick samples?",
    ];
  }
  if (match.chapterNumber === 11 || match.chapterNumber === 12) {
    return [
      "How does camera length affect spot spacing on the phosphor screen?",
      "Explain the Camera Constant equation R*d = lambda*L.",
      "How do Kikuchi lines help in precise crystal tilting?",
    ];
  }
  if (match.chapterNumber === 22 || match.chapterNumber === 23) {
    return [
      "How do you determine a dislocation's Burgers vector using g.b = 0?",
      "What is a two-beam condition and why is it used?",
      "What causes thickness fringes and bend contours in thin foils?",
    ];
  }
  if (match.chapterNumber === 28) {
    return [
      "What is the Contrast Transfer Function (CTF) in HRTEM?",
      "Why does Scherzer defocus avoid contrast reversals?",
      "How do you calibrate lattice fringes using a known gold standard?",
    ];
  }
  return [
    "What is the Cliff-Lorimer equation in TEM-EDS?",
    "How does low-loss EELS measure specimen thickness?",
    "When should I use Dark-Field instead of Bright-Field?",
  ];
}
