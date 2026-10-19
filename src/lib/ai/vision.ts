/**
 * TEM-AI Vision Analysis Engine
 * Analyzes micrographs, SAED patterns, lattice fringes, and particle morphology.
 * Follows strict scientific safety rules: OBSERVED vs INTERPRETED vs UNCERTAIN.
 */

import { getGenAIClient, IS_LIVE_AI_AVAILABLE, AI_CONFIG } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";

export interface VisionAnalysisResult {
  observed: string[];
  interpreted: string[];
  uncertain: string[];
  contrastMechanism: string;
  recommendedTechniques: string[];
  fullReport: string;
  isLiveAi: boolean;
  provider: string;
}

export async function analyzeMicrographAI(
  imageBase64: string,
  userQuestion: string = "Analyze this TEM micrograph: identify contrast mechanisms, morphology, and visible features.",
  mimeType: string = "image/png"
): Promise<VisionAnalysisResult> {
  const client = getGenAIClient();

  if (client && IS_LIVE_AI_AVAILABLE) {
    try {
      // Clean base64 prefix if present
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");

      const response = await client.models.generateContent({
        model: AI_CONFIG.visionModelName,
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType: mimeType || "image/png",
                },
              },
              {
                text: `${SYSTEM_PROMPTS.BASE_CARTER}\n\n${SYSTEM_PROMPTS.VISION_MODE}\n\nUser Question: ${userQuestion}`,
              },
            ],
          },
        ],
      });

      const reportText = response.text || "";
      if (reportText.trim().length > 0) {
        return parseVisionReport(reportText, true, "Google Gemini 1.5 Pro Vision");
      }
    } catch (err) {
      console.warn("Live Gemini vision call failed, using Carter vision fallback:", err);
    }
  }

  // Grounded Demo Fallback
  return buildDemoVisionReport(userQuestion);
}

function parseVisionReport(text: string, isLive: boolean, provider: string): VisionAnalysisResult {
  const observedMatches = text.match(/### 1\. OBSERVED([\s\S]*?)(?=### 2\. INTERPRETED|$)/i);
  const interpretedMatches = text.match(/### 2\. INTERPRETED([\s\S]*?)(?=### 3\. UNCERTAIN|$)/i);
  const uncertainMatches = text.match(/### 3\. UNCERTAIN([\s\S]*?)(?=$)/i);

  const cleanList = (raw: string | undefined): string[] => {
    if (!raw) return [];
    return raw
      .split("\n")
      .map((l) => l.replace(/^[-*•\d.]\s*/, "").trim())
      .filter((l) => l.length > 5);
  };

  return {
    observed: cleanList(observedMatches?.[1]) || [
      "Discrete high-contrast nanostructures against a lighter substrate background.",
      "Clear boundaries between distinct particle phases.",
    ],
    interpreted: cleanList(interpretedMatches?.[1]) || [
      "Mass-thickness contrast consistent with high-atomic-number nanoparticles (e.g. Au or Pt).",
      "Quasi-spherical colloidal particle distribution with moderate polydispersity.",
    ],
    uncertain: cleanList(uncertainMatches?.[1]) || [
      "Exact elemental composition requires complementary TEM-EDS or EELS validation.",
      "3D thickness and facet geometry cannot be inferred without tilt series.",
    ],
    contrastMechanism: "Mass-Thickness & Diffraction Contrast",
    recommendedTechniques: [
      "SAED to verify if particles are single-crystal or polycrystalline",
      "HRTEM lattice imaging at Scherzer defocus for d-spacing verification",
      "TEM-EDS line scan to confirm elemental purity",
    ],
    fullReport: text,
    isLiveAi: isLive,
    provider,
  };
}

function buildDemoVisionReport(question: string): VisionAnalysisResult {
  const isDiffraction =
    question.toLowerCase().includes("diffraction") ||
    question.toLowerCase().includes("ring") ||
    question.toLowerCase().includes("spot");

  if (isDiffraction) {
    return {
      observed: [
        "Concentric Debye-Scherrer rings with sharp intensity maxima surrounding a saturated central transmitted spot (000).",
        "Multiple discrete diffraction radii corresponding to discrete Bragg interplanar spacings.",
        "Spotty ring character indicating nanoscale polycrystalline grains with slight preferred orientation.",
      ],
      interpreted: [
        "Diffraction pattern originates from a face-centered cubic (FCC) polycrystalline structure.",
        "Ring radii follow characteristic FCC sequence proportional to sqrt(h^2 + k^2 + l^2): (111), (200), (220), (311).",
        "Grain sizes are likely in the 5 nm to 50 nm regime, causing modest broadening of diffraction rings.",
      ],
      uncertain: [
        "Precise lattice parameter cannot be calibrated without camera length calibration or a known standard (e.g., Al or TlCl standard).",
        "Local strain and defect density require Convergent Beam Electron Diffraction (CBED) or Dark-Field analysis.",
      ],
      contrastMechanism: "Coherent Bragg Elastic Electron Scattering",
      recommendedTechniques: [
        "Measure ring diameters (2*R) to compute ratios R2/R1 and index reflections",
        "Dark-field imaging using the first intense ring to isolate crystalline grain sizes",
        "STEM-HAADF imaging to correlate diffraction with local atomic number Z",
      ],
      fullReport:
        "### 1. OBSERVED\n" +
        "- Concentric Debye-Scherrer rings centered on the direct beam (000).\n" +
        "- Multiple ring orders exhibiting spotty continuity characteristic of nanocrystalline grains.\n\n" +
        "### 2. INTERPRETED\n" +
        "- Polycrystalline thin-film or nanoparticle assembly with FCC crystallographic symmetry.\n" +
        "- Interplanar spacings match standard metals (e.g. Gold Au or Aluminum Al).\n\n" +
        "### 3. UNCERTAIN\n" +
        "- Exact unit cell dimensions require camera constant (lambda * L) verification.\n" +
        "- Trace impurity phases below ~1-2 vol% may not produce visible diffraction rings.",
      isLiveAi: false,
      provider: "Carter Grounded Vision (Demo Engine)",
    };
  }

  return {
    observed: [
      "Dispersed nanoscale features exhibiting high electron attenuation against an amorphous carbon support substrate.",
      "Variable particle morphologies ranging from quasi-spherical to faceted polygonal geometries.",
      "Clear intensity gradient towards nanoparticle edges consistent with projected spherical thickness.",
    ],
    interpreted: [
      "Strong mass-thickness contrast indicates high atomic number Z (e.g., Au, Ag, or Pt) or significant local thickness.",
      "Localized dark/bright internal streaks represent diffraction contrast from internal planar twins or bend contours.",
      "Inter-particle separation suggests adequate surfactant stabilization or low surface agglomeration.",
    ],
    uncertain: [
      "Chemical composition cannot be definitively identified from 2D contrast alone; EDS or EELS is mandatory.",
      "Core-shell architecture or organic ligand shells are invisible without high-angle annular dark-field (HAADF) or cryo-TEM.",
      "True 3D morphology cannot be resolved without electron tomography tilt series.",
    ],
    contrastMechanism: "Mass-Thickness & Diffraction Contrast (Amplitude Contrast)",
    recommendedTechniques: [
      "SAED to verify crystallinity and extract unit-cell d-spacings",
      "HRTEM lattice imaging at Scherzer defocus to confirm crystalline lattice fringes",
      "TEM-EDS or EELS to verify elemental identity and rule out surface oxidation",
    ],
    fullReport:
      "### 1. OBSERVED\n" +
      "- High-contrast nanoparticles on a light, uniform amorphous carbon support.\n" +
      "- Visible internal contrast variations across individual larger grains.\n\n" +
      "### 2. INTERPRETED\n" +
      "- Mass-thickness attenuation dominates, indicating heavy metal nanoparticles.\n" +
      "- Internal contrast variations represent Bragg diffraction from favorable crystal orientations.\n\n" +
      "### 3. UNCERTAIN\n" +
      "- Exact elemental stoichiometry requires EDS.\n" +
      "- Particle heights in the Z-direction require tilt tomography or AFM.",
    isLiveAi: false,
    provider: "Carter Grounded Vision (Demo Engine)",
  };
}
