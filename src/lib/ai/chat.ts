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
      let response;
      try {
        response = await client.models.generateContent({
          model: AI_CONFIG.modelName,
          contents: fullPrompt,
        });
      } catch (primaryErr) {
        console.warn(`Primary model ${AI_CONFIG.modelName} failed, attempting fallback to ${AI_CONFIG.fallbackModelName}:`, primaryErr);
        response = await client.models.generateContent({
          model: AI_CONFIG.fallbackModelName || "gemini-3.5-flash",
          contents: fullPrompt,
        });
      }

      const text = response.text || "";
      if (text.trim().length > 0) {
        // Robustly parse into Carter Grounding vs Additional Scientific Explanation
        const { fromCarter, additionalExplanation } = parseGroundedResponse(text);

        return {
          answer: text,
          fromCarter: fromCarter || (additionalExplanation ? "" : text),
          additionalExplanation: additionalExplanation,
          citations: ragResult.sources,
          mode,
          isLiveAi: true,
          provider: AI_CONFIG.provider,
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

import { parseGroundedResponse } from "./chat-parser";
export { parseGroundedResponse };

function buildGroundedDemoResponse(
  query: string,
  mode: ChatMode,
  examSubtype: string | undefined,
  ragResult: ReturnType<typeof retrieveCarterKnowledge>
): ChatResponse {
  const match = ragResult.bestMatch;
  const chapter = match ? `Chapter ${match.chapterNumber}: "${match.chapterTitle}"` : "Williams & Carter Foundations";
  const section = match ? `Section ${match.sectionNumber} ("${match.sectionTitle}", pp. ${match.page}-${match.pageEnd})` : "General Optics";

  // Build topic-specific technical details based on retrieved chunk
  const topic = getTopicSynthesis(match, query);

  let fromCarter = "";
  let additional = "";
  let fullAnswer = "";

  if (mode === "TUTOR") {
    fromCarter = `In Carter ${chapter}, ${section}:\n\n` +
      `- Core Physical Principle: ${match?.summary || "Electrons undergo coherent and incoherent interactions governed by atomic potentials."}\n` +
      `- Textbook Excerpt: "${match?.excerpt.slice(0, 320)}..."`;

    additional = `Let's break this down into three logical steps to master the concept:\n\n` +
      `Step 1: Physical Foundation\n${topic.tutorStep1}\n\n` +
      `Step 2: Observation on the Phosphor Screen / Detector\n${topic.tutorStep2}\n\n` +
      `Step 3: Experimental Control & Column Operation\n${topic.tutorStep3}\n\n` +
      `* Micro-Check Question:\n` +
      `"${topic.tutorQuestion}"`;

    fullAnswer = `### FROM CARTER (Williams & Carter, ${chapter})\n${fromCarter}\n\n### TUTOR STEP-BY-STEP GUIDANCE\n${additional}`;
  } else if (mode === "EXAM") {
    const marks = examSubtype || "5mark";
    fromCarter = `Key Examination Points from Williams & Carter (${chapter}, ${section}):\n` +
      (match?.pedagogicalKeyPoints.map((p) => `* ${p}`).join("\n") || "* Fundamental relationship to relativistic wavelength and scattering cross-section.");

    additional = `MODEL EXAMINATION ANSWER [${marks.toUpperCase()}]\n\n`;
    if (marks === "2mark") {
      additional += `1. Definition:\n${match?.summary}\n\n` +
        `2. Governing Formula:\n${match?.formulas?.[0] || "\\lambda = h/p"}\n\n` +
        `3. Essential Criterion:\n${topic.examCriterion}`;
    } else if (marks === "viva") {
      additional += `Viva Voce Defence:\n\n` +
        `Examiner's Question: "How does ${match?.sectionTitle || "this TEM principle"} govern real microstructural characterization?"\n\n` +
        `Candidate's Structured Response:\n` +
        `1. Theoretical Grounding: ${match?.summary}\n\n` +
        `2. Quantitative Physics: The phenomenon is governed by ${match?.formulas?.[0] || "relativistic kinematics"}. In practice, ${topic.labRelevance}\n\n` +
        `3. Experimental Trap to Watch Out For: ${topic.examPitfall}`;
    } else {
      // 5mark or 10mark
      additional += `1. Physical Principle & Mechanism:\n${topic.physicalMechanism}\n\n` +
        `2. Analytical Expression & Quantities:\n${match?.formulas?.map((f) => `$$${f}$$`).join("\n") || "$$R \\cdot d = \\lambda \\cdot L$$"}\n\n` +
        `3. Practical Laboratory Implementation:\n${topic.labRelevance}\n\n` +
        `4. Examination Pitfall to Avoid:\n${topic.examPitfall}`;
    }

    fullAnswer = `### FROM CARTER (Exam Grounding: ${chapter})\n${fromCarter}\n\n### MODEL EXAMINATION ANSWER\n${additional}`;
  } else if (mode === "EXPERIMENT") {
    fromCarter = `According to Carter (${chapter}, ${section}), experimental issues regarding this phenomenon typically originate from specimen thickness, column alignment, or aperture placement.`;

    additional = `LABORATORY DIAGNOSTIC & TROUBLESHOOTING PROTOCOL:\n\n` +
      `1. Immediate Column Alignment & Setup:\n` +
      `   - ${topic.diagStep1}\n\n` +
      `2. Specimen & Diffraction Verification:\n` +
      `   - ${topic.diagStep2}\n\n` +
      `3. Contrast Optimization & Stigmation:\n` +
      `   - ${topic.diagStep3}`;

    fullAnswer = `### FROM CARTER (${chapter}, ${section})\n${fromCarter}\n\n### LABORATORY DIAGNOSTIC PROCEDURE\n${additional}`;
  } else {
    // Standard ASK mode
    fromCarter = `In Carter & Williams (${chapter}, ${section}):\n\n${match?.excerpt || "Transmission electron microscopy exploits the wave-particle duality of relativistic electrons to probe atomic structure and chemistry."}`;

    additional = `Detailed Physical Mechanism:\n\n` +
      `1. Fundamental Physics:\n${topic.physicalMechanism}\n\n` +
      `2. Practical Laboratory Relevance:\n${topic.labRelevance}\n\n` +
      `3. Governing Formulas:\n${match?.formulas?.map((f) => `- $$${f}$$`).join("\n") || "- $$\\lambda = h/p$$"}\n\n` +
      `4. Key Takeaways from Williams & Carter:\n${match?.pedagogicalKeyPoints?.map((p) => `- ${p}`).join("\n") || "- Precise alignment required."}`;

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

interface TopicDetails {
  physicalMechanism: string;
  labRelevance: string;
  tutorStep1: string;
  tutorStep2: string;
  tutorStep3: string;
  tutorQuestion: string;
  examCriterion: string;
  examPitfall: string;
  diagStep1: string;
  diagStep2: string;
  diagStep3: string;
}

function getTopicSynthesis(match: RetrievedSource | null, query: string): TopicDetails {
  const qLower = query.toLowerCase();
  const ch = match?.chapterNumber || 1;
  const sec = match?.sectionNumber || "1.1";

  // Topic 1: Kikuchi Lines (Ch 19)
  if (ch === 19 || qLower.includes("kikuchi")) {
    return {
      physicalMechanism: "Kikuchi lines originate in moderately thick regions (>30-50 nm) through a two-step process: diffuse inelastic scattering generates an isotropic cloud of electrons, which subsequently undergo coherent Bragg diffraction off lattice planes (hkl). The angular separation between the excess (bright) and deficiency (dark) lines is exactly 2*theta_B = lambda / d.",
      labRelevance: "Unlike Bragg diffraction spots which remain fixed in reciprocal space, Kikuchi lines are rigidly anchored to the crystal lattice. When the specimen is tilted by angle delta_theta, the Kikuchi pattern shifts on the screen by delta_R = L * delta_theta. Microscopists use Kikuchi maps as an exact navigational roadmap to tilt into zone axes and achieve exact two-beam conditions (where the Kikuchi line passes directly through diffracted spot g, setting excitation error s = 0).",
      tutorStep1: "Inelastic scattering creates divergent electrons in all directions within the specimen.",
      tutorStep2: "These divergent electrons satisfy Bragg's law on crystal planes, generating Kossel cones that intersect the detector as pairs of parallel lines.",
      tutorStep3: "Tilting the goniometer translates the Kikuchi lines linearly across the phosphor screen, allowing precise crystal orientation navigation.",
      tutorQuestion: "When you tilt the crystal goniometer toward a zone axis, why do the Kikuchi lines shift across the screen while the Bragg diffraction spots stay virtually stationary?",
      examCriterion: "Specimen thickness must exceed 30 nm to generate sufficient diffuse inelastic scattering background.",
      examPitfall: "Do not confuse Kikuchi lines with HOLZ lines; Kikuchi lines originate from diffuse inelastic background in the Zero-Order Laue Zone, whereas HOLZ lines originate from coherent diffraction into higher reciprocal lattice layers (n > 0).",
      diagStep1: "Move the beam to a slightly thicker wedge of the sample (>40 nm); in ultra-thin edges (<10 nm), Kikuchi lines fade because inelastic scattering is too weak.",
      diagStep2: "Switch to diffraction mode (SAED) with a small camera length (L = 600-800 mm) to see a wide field of Kikuchi bands.",
      diagStep3: "Use the alpha and beta goniometer tilt controls to center the Kikuchi intersection pole on the direct beam to align with the desired crystal zone axis.",
    };
  }

  // Topic 2: TEM vs SEM (Ch 1, Sec 1.4)
  if ((ch === 1 && sec === "1.4") || qLower.includes("sem") || qLower.includes("tem vs sem") || qLower.includes("difference")) {
    return {
      physicalMechanism: "TEM transmits relativistic electrons (80-300 kV) through an electron-transparent foil (<100 nm) to capture transmitted, diffracted, and phase-contrast waves with sub-angstrom resolution (<0.1 nm). In contrast, conventional SEM rasters lower-energy electrons (0.5-30 kV) across a bulk specimen, collecting secondary electrons (SE, 0-50 eV) for 3D topography and backscattered electrons (BSE) for atomic-number contrast, with typical resolution of 1-5 nm.",
      labRelevance: "Choose TEM when atomic lattice fringe resolution, internal defect identification (Burgers vector), or crystallographic diffraction (SAED/CBED) is required. Choose SEM when large-area 3D surface topography, fracture surfaces, or rapid inspection of bulk conductive/coated samples is needed without destructive ultra-thin foil preparation.",
      tutorStep1: "TEM measures transmitted electrons penetrating through a foil; SEM measures secondary and backscattered electrons escaping from the specimen surface.",
      tutorStep2: "TEM achieves <0.1 nm sub-angstrom resolution; SEM typically achieves 1 to 5 nm resolution but with immense depth of field.",
      tutorStep3: "Sample preparation is radically different: TEM requires foils thinned to <100 nm (electropolishing, FIB, or ion milling), while SEM accommodates bulk samples up to several centimeters.",
      tutorQuestion: "If you need to analyze the internal dislocation density and Burgers vector of a deformed titanium alloy, why can SEM secondary electron imaging not perform this task?",
      examCriterion: "Specimen must be electron-transparent (<100 nm) for TEM, whereas SEM accommodates bulk solid specimens.",
      examPitfall: "Do not state that SEM has lower resolution solely due to its lens quality; the primary limit in SEM is the beam-specimen interaction volume (several micrometers deep in bulk samples for BSE/X-rays).",
      diagStep1: "Verify whether the specimen is thin enough for transmission (<100 nm). If the beam cannot penetrate, switch to SEM mode or thin the sample further.",
      diagStep2: "Select accelerating voltage: 200 kV for TEM internal penetration versus 5-15 kV in SEM to minimize beam damage and charging on non-conductive surfaces.",
      diagStep3: "In TEM, center the objective aperture around the transmitted direct beam; in SEM, adjust the Everhart-Thornley detector bias for secondary electron collection.",
    };
  }

  // Topic 3: Centered Dark-Field vs Bright-Field (Ch 13 & Ch 22)
  if (ch === 13 || qLower.includes("centered dark") || qLower.includes("cdf") || qLower.includes("dark-field") || qLower.includes("dark field")) {
    return {
      physicalMechanism: "In Bright-Field (BF), the objective aperture in the Back Focal Plane transmits only the unscattered direct beam (000), causing strongly diffracting crystals to appear dark. In Dark-Field (DF), a diffracted beam (g) is selected. Centered Dark-Field (CDF) deflects the incident beam by angle 2*theta_B using beam tilt coils above the specimen so the diffracted beam g travels straight down the optical axis through the centered objective aperture, eliminating severe off-axis spherical aberration (Cs * alpha^3) and astigmatism.",
      labRelevance: "Always use Centered Dark-Field (CDF) instead of physically displacing the objective aperture. CDF provides sharp, aberration-free imaging of nanoparticles, precipitate habit planes, and dislocation cores because electrons stay paraxial through the magnetic lens pole piece.",
      tutorStep1: "BF imaging places the objective aperture on the central (000) spot.",
      tutorStep2: "Displaced-aperture DF shifts the aperture off-axis, introducing spherical aberration that severely blurs the image.",
      tutorStep3: "CDF tilts the incoming beam using deflection coils so beam g travels directly down the optical center, maintaining maximum image sharpness.",
      tutorQuestion: "Why does shifting the objective aperture off-axis in displaced-aperture DF degrade resolution far more than tilting the incident illumination in Centered Dark-Field?",
      examCriterion: "Incident illumination must be tilted by 2*theta_B = lambda / d to direct diffracted beam g along the lens optical axis.",
      examPitfall: "Do not confuse Displaced-Aperture Dark-Field with Centered Dark-Field; displaced aperture violates paraxial ray conditions and suffers from severe off-axis Cs and astigmatism.",
      diagStep1: "In diffraction mode, center the objective aperture accurately on the direct beam (000).",
      diagStep2: "Activate 'Dark-Field / Beam Tilt' on the TEM console; deflect the beam until the desired diffracted spot g is centered in the aperture.",
      diagStep3: "Switch to imaging mode and fine-tune objective focus and objective stigmation to maximize resolution.",
    };
  }

  // Topic 4: Dislocation Burgers Vector g.b = 0 (Ch 23)
  if (ch === 23 || qLower.includes("burgers") || qLower.includes("g.b") || qLower.includes("dislocation") || qLower.includes("invisibility")) {
    return {
      physicalMechanism: "Under a two-beam condition where only the direct beam and one Bragg reflection g are excited, crystal defect contrast is governed by the phase shift alpha = 2*pi * g * R(r). For a dislocation with Burgers vector b, the atomic displacements R around the core are perpendicular to planes when g * b = 0. Under this condition, lattice planes containing the dislocation remain unbent with respect to diffraction vector g, and the dislocation contrast disappears (invisibility criterion).",
      labRelevance: "To unambiguously determine a dislocation's Burgers vector b, the microscopist tilts the specimen to find two independent non-parallel reflections g1 and g2 where the dislocation becomes completely invisible (g1 * b = 0 and g2 * b = 0). The Burgers vector is then parallel to the cross product: b || (g1 x g2).",
      tutorStep1: "Tilt into a clean two-beam condition where one diffracted spot g is strongly excited with excitation error s slightly positive.",
      tutorStep2: "Observe the dislocation line contrast in Bright-Field; lattice distortions bend planes into the Bragg condition, creating dark strain contrast.",
      tutorStep3: "Tilt through different reflection vectors g until the dislocation contrast vanishes; this confirms g * b = 0.",
      tutorQuestion: "Why does a pure edge dislocation sometimes show weak residual contrast even when g . b = 0, whereas a pure screw dislocation is completely invisible?",
      examCriterion: "Pure screw dislocation vanishes when g * b = 0; pure edge dislocation requires both g * b = 0 and g * (b x u) = 0 for complete invisibility.",
      examPitfall: "Assuming g * b = 0 guarantees zero contrast for edge dislocations; residual contrast often remains due to radial displacements along b x u.",
      diagStep1: "Check diffraction mode to ensure a strict two-beam condition: only (000) and spot g should be brightly excited.",
      diagStep2: "Ensure excitation error s is slightly positive (s > 0); at exact s = 0, dislocation image width is wider due to dynamic scattering.",
      diagStep3: "If contrast is too faint, verify that the objective aperture is properly inserted around the (000) beam for BF or spot g for CDF.",
    };
  }

  // Topic 5: HRTEM, Phase Contrast & Scherzer Defocus (Ch 28)
  if (ch === 28 || qLower.includes("scherzer") || qLower.includes("hrtem") || qLower.includes("ctf") || qLower.includes("phase contrast") || qLower.includes("lattice fringe")) {
    return {
      physicalMechanism: "High-Resolution TEM (HRTEM) forms lattice images by coherent phase interference between the transmitted beam and multiple diffracted beams admitted through a wide objective aperture. The Contrast Transfer Function (CTF) sin(chi(u)) modulates spatial frequencies according to lens spherical aberration Cs and objective defocus Delta f. At Scherzer defocus Delta f_Sch = -1.2 * sqrt(Cs * lambda), the CTF achieves a broad, flat negative passband out to point resolution d_Sch = 0.64 * (Cs * lambda^3)^(1/4), allowing direct interpretation of atomic columns as dark spots without contrast reversals.",
      labRelevance: "When operating at 200 kV or 300 kV, the operator sets the objective focus to Scherzer defocus by monitoring the Thon rings on an amorphous carbon edge in the live Fast Fourier Transform (FFT). Under Scherzer conditions, the first zero cross-over is maximized, preventing false artifactual lattice fringes.",
      tutorStep1: "Unlike amplitude contrast, HRTEM relies on phase shifts accumulated by electron waves passing through the atomic electrostatic potential.",
      tutorStep2: "Spherical aberration Cs advances phase with increasing angle, while objective underfocus retards phase.",
      tutorStep3: "Scherzer defocus precisely balances Cs and underfocus to maximize the continuous transfer passband before the first CTF zero cross-over.",
      tutorQuestion: "What happens to the contrast of atomic columns in HRTEM if you image spatial frequencies that lie beyond the first zero of the CTF?",
      examCriterion: "Defocus must equal Delta f = -1.2 * sqrt(Cs * lambda) to establish the maximum monotonic passband of the CTF.",
      examPitfall: "Confusing lattice fringes with true atomic columns; lattice fringes represent reciprocal interference spacing and only match atomic columns under Scherzer conditions in ultra-thin foils (<5 nm).",
      diagStep1: "Find an amorphous edge of the sample or carbon support film; enter live FFT (power spectrum) mode at >200,000x magnification.",
      diagStep2: "Correct objective astigmatism until Thon rings are perfectly circular across all azimuths.",
      diagStep3: "Adjust objective defocus until the first Thon ring zero cross-over reaches its widest radius, corresponding to Scherzer defocus.",
    };
  }

  // Topic 6: STEM & HAADF Z-Contrast (Ch 24)
  if (ch === 24 || qLower.includes("haadf") || qLower.includes("z-contrast") || qLower.includes("stem") || qLower.includes("annular dark")) {
    return {
      physicalMechanism: "In Scanning Transmission Electron Microscopy (STEM), an atomic-scale electron probe (<0.1 nm) rasters across the specimen. Transmitted electrons scattered to high angles (>50-100 mrad) are collected by a High-Angle Annular Dark-Field (HAADF) detector. At these extreme angles, coherent Bragg diffraction is quenched by thermal diffuse scattering (TDS), and the signal is dominated by incoherent Rutherford scattering off atomic nuclei. Consequently, HAADF image intensity scales monotonically as Z^(1.7-2.0), providing atomic-number 'Z-contrast' with zero phase contrast reversals.",
      labRelevance: "HAADF-STEM is the premier tool for identifying heavy dopant atoms, catalytic clusters (e.g. Pt, Au) on light carbon/oxide supports, and interface termination layers because heavier atomic columns glow significantly brighter without needing CTF defocus matching.",
      tutorStep1: "A field-emission gun and condenser lenses focus electrons into an ultra-fine sub-angstrom probe scanned across the foil.",
      tutorStep2: "The HAADF detector has a large central hole that excludes direct and Bragg diffracted beams, capturing only high-angle diffuse scattering.",
      tutorStep3: "Because scattering cross-section scales with Z^2, heavier elements appear intensely bright against a dark background.",
      tutorQuestion: "Why does HAADF-STEM imaging not exhibit contrast reversals with small changes in specimen thickness or defocus, unlike HRTEM phase contrast?",
      examCriterion: "Detector inner collection semi-angle must exceed 50 mrad to exclude coherent Bragg reflections and isolate incoherent Rutherford scattering.",
      examPitfall: "Confusing ADF (medium angle, mixed Bragg/diffuse) with HAADF (high angle, pure incoherent Z-contrast).",
      diagStep1: "Verify camera length in STEM mode: ensure camera length is short enough (e.g., 80-120 mm) so the HAADF inner detector angle exceeds 50 mrad.",
      diagStep2: "Optimize probe convergence semi-angle alpha and correct condenser probe astigmatism using the Ronchigram on an amorphous area.",
      diagStep3: "Ensure probe dwell time balances signal-to-noise ratio against specimen drift.",
    };
  }

  // Topic 7: CBED & HOLZ Lines (Ch 18)
  if (ch === 18 || qLower.includes("cbed") || qLower.includes("convergent beam") || qLower.includes("holz")) {
    return {
      physicalMechanism: "Convergent-Beam Electron Diffraction (CBED) uses a convergent electron probe focused to a small spot, expanding diffraction points into Kossel-Möllenstedt discs of diameter 2*alpha. Dynamic diffraction inside the discs generates intensity contours sensitive to local crystal thickness. At high angles, Higher-Order Laue Zone (HOLZ) lines intersect the Zero-Order discs due to intersections with 3D reciprocal lattice planes (n >= 1), providing sub-picometer strain sensitivity and full 3D point/space group determination.",
      labRelevance: "CBED allows microscopists to measure local foil thickness with +/-2% accuracy using Kelly's fringe method, determine lattice parameter changes <0.01% from HOLZ shifts, and establish non-centrosymmetric crystal symmetry.",
      tutorStep1: "Convergent illumination replaces parallel beams, transforming sharp diffraction spots into discs.",
      tutorStep2: "HOLZ lines arise from the Ewald sphere intersecting higher-layer reciprocal lattice planes (First Order Laue Zone, FOLZ).",
      tutorStep3: "Fringe spacings inside two-beam CBED discs provide a direct graphical measurement of specimen thickness t.",
      tutorQuestion: "How do HOLZ lines inside the central CBED disc provide three-dimensional crystallographic information that conventional 2D SAED spot patterns cannot?",
      examCriterion: "Disc semi-angle alpha must not exceed the Bragg angle theta_B to prevent disc overlap (Kossel-Möllenstedt condition).",
      examPitfall: "Operating with excessive convergence angle alpha causing overlapping discs; Kossel patterns overlap and obscure dynamic fringe positions.",
      diagStep1: "Insert a small C2 condenser aperture and focus the beam to a fine crossover in diffraction mode to form sharp CBED discs.",
      diagStep2: "Adjust camera length L so that HOLZ rings in the outer field of view are clearly visible.",
      diagStep3: "Tilt to a zone axis or two-beam condition to view symmetric internal disc fringes.",
    };
  }

  // Topic 8: EDS vs EELS Microanalysis (Ch 38, 33, 37)
  if (ch === 38 || ch === 33 || ch === 37 || qLower.includes("eds vs eels") || qLower.includes("eels vs eds") || qLower.includes("spectrometry") || qLower.includes("cliff-lorimer")) {
    return {
      physicalMechanism: "EDS detects characteristic X-ray photons emitted when core vacancies are filled by outer-shell electrons. It excels for elements Z >= 11 (Na to U) and uses the Cliff-Lorimer equation (C_A/C_B) = k_AB * (I_A/I_B) under the thin-film approximation. EELS detects primary electrons that lost energy during ionization. Because it captures forward-scattered primary electrons with 0.3-1.0 eV energy resolution (versus 130 eV for EDS), EELS is vastly superior for light elements (Li, B, C, N, O) and provides ELNES fine structure revealing oxidation states.",
      labRelevance: "Use EDS for rapid multi-element mapping across medium and heavy elements in slightly thicker foils. Use EELS for light elements, chemical bonding coordination (e.g. sp2 vs sp3 carbon, Fe2+ vs Fe3+), and measuring specimen thickness t/lambda from the low-loss plasmon spectrum.",
      tutorStep1: "EDS detects secondary emitted X-rays; EELS measures primary transmitted electrons that caused the ionization.",
      tutorStep2: "X-ray fluorescence yield drops precipitously for light elements (Z < 11), making EDS blind or inefficient for Li, B, and C.",
      tutorStep3: "EELS energy resolution is ~1 eV (100x sharper than EDS), enabling chemical valence and oxidation state determination via ELNES.",
      tutorQuestion: "If you are examining a 120 nm thick foil of steel, why will your EELS spectrum be severely degraded while your EDS spectrum remains easily quantifiable?",
      examCriterion: "In TEM-EDS, specimens satisfying the thin-film criterion neglect X-ray absorption and fluorescence, allowing quantification via Cliff-Lorimer factors: (C_A/C_B) = k_AB * (I_A/I_B).",
      examPitfall: "Assuming EDS can distinguish oxidation states; EDS only measures atomic concentration ratios, whereas EELS ELNES reveals valence states.",
      diagStep1: "Check specimen thickness using low-loss EELS (t/lambda): if t/lambda > 0.8, plural scattering will mask core edges; switch to EDS or find a thinner region.",
      diagStep2: "In EDS, tilt specimen toward the detector (typically 15-20 deg) to maximize take-off angle and line-of-sight to the Silicon Drift Detector (SDD).",
      diagStep3: "Calibrate spectrometer zero-loss peak position and energy dispersion before acquiring fine-structure ionization edges.",
    };
  }

  // Topic 9: Specimen Preparation (Ch 10)
  if (ch === 10 || qLower.includes("prep") || qLower.includes("fib") || qLower.includes("electropolish") || qLower.includes("ion mill")) {
    return {
      physicalMechanism: "TEM requires specimens thinned to electron transparency (<100 nm, ideally <20 nm for HRTEM). Thinning techniques depend on material class: conductive metals use twin-jet electropolishing; brittle ceramics and semiconductors use mechanical dimpling followed by low-angle Ar+ ion milling (2-5 keV at 4-6 degrees); microelectronic devices use Focused Ion Beam (FIB) in-situ lift-out with Ga+ ions; and nanomaterials are drop-cast onto holey carbon or graphene grids.",
      labRelevance: "To avoid misleading artifacts, FIB lamellae must receive a final low-voltage clean (1-2 kV) to strip the amorphous Ga+ damaged surface layer. Metallic foils must be thoroughly rinsed to avoid electrolyte oxidation, and all samples should undergo plasma cleaning to prevent hydrocarbon contamination.",
      tutorStep1: "Specimens must be <100 nm thick so electrons transmit without excessive multiple inelastic scattering.",
      tutorStep2: "Electropolishing uses electrochemical dissolution; ion milling uses sputtering by inert Ar+ gas ions.",
      tutorStep3: "FIB enables site-specific extraction of microelectronic devices, but leaves a 20-30 nm amorphous surface layer that must be polished away at low voltage.",
      tutorQuestion: "What causes the thick amorphous ring observed on the surface of a FIB-prepared silicon lamella, and how does the microscopist remove it before atomic-resolution imaging?",
      examCriterion: "Final specimen thickness must satisfy t < 100 nm for standard diffraction/imaging and t < 20 nm for Scherzer HRTEM.",
      examPitfall: "Attributing amorphous halo rings in SAED to the material itself rather than surface oxide or Ga+ ion beam damage from sample preparation.",
      diagStep1: "Inspect the thin foil edge in Bright-Field: if thickness fringes are spaced extremely closely, the foil is too steep or thick.",
      diagStep2: "If beam contamination deposits a black carbon square during viewing, plasma-clean the sample for 2-5 minutes in an Ar/O2 plasma cleaner.",
      diagStep3: "For FIB lamellae, perform final low-kV polishing (1-2 kV Ga+ or Ar+ Fischione Nanomill) to remove amorphous layers.",
    };
  }

  // Topic 10: Microscope Alignment & Astigmatism (Ch 4)
  if (ch === 4 || qLower.includes("alignment") || qLower.includes("eucentric") || qLower.includes("astigmatism") || qLower.includes("stigmator")) {
    return {
      physicalMechanism: "Accurate TEM alignment aligns the physical lens centers with the electron optical axis. Eucentric height places the specimen exactly on the goniometer tilt axis, eliminating translational drift during tilting. Gun tilt/shift centers the electron source on the condenser aperture. Voltage/current centering modulates high tension or lens current to identify the optical rotation center. Objective astigmatism correction uses octupole electromagnetic stigmators to balance asymmetric magnetic fields.",
      labRelevance: "Before any diffraction or high-magnification imaging, the operator must set eucentric height using the Z-wobbler and correct objective astigmatism on an amorphous carbon edge until Fresnel fringes remain isotropic across focus.",
      tutorStep1: "Eucentric height ensures the specimen stays in the field of view when tilted by +/- 15 degrees.",
      tutorStep2: "Current and voltage centering ensure chromatic and energy fluctuations expand concentrically without image translation.",
      tutorStep3: "Objective stigmators correct for non-circular lens pole piece fields, transforming elliptical Fresnel fringes into uniform circles.",
      tutorQuestion: "If a hole in an amorphous carbon film shows a bright fringe on the top-right and a dark fringe on the bottom-left at slight underfocus, what defect is present and how do you rectify it?",
      examCriterion: "Objective astigmatism produces directional blurring r_astig = Delta f_astig * alpha that reverses orientation by 90 degrees across focus.",
      examPitfall: "Attempting to focus an image before correcting objective astigmatism; minimum contrast cannot be reached while astigmatism is present.",
      diagStep1: "Activate the Z-axis wobbler (+/- 15 deg tilt) and adjust specimen Z-height until lateral parallax motion stops (true eucentric height).",
      diagStep2: "At 100,000x-200,000x magnification on an amorphous carbon edge, defocus slightly to reveal the Fresnel fringe.",
      diagStep3: "Adjust X and Y objective stigmators until the Fresnel fringe is completely uniform in width and intensity around the entire circumference of the hole.",
    };
  }

  // Topic 11: SAED & Camera Constant (Ch 12 & Ch 11)
  if (ch === 12 || ch === 11 || qLower.includes("camera constant") || qLower.includes("saed") || qLower.includes("reciprocal") || qLower.includes("ewald")) {
    return {
      physicalMechanism: "In Selected-Area Electron Diffraction (SAED), a field-limiting aperture in the first intermediate image plane isolates a specimen region. Diffracted beams focus in the back focal plane and are projected onto the detector with effective optical camera length L. Crystalline interplanar spacings d_hkl relate to measured spot distances R from the (000) beam via the Camera Constant equation: R * d = lambda * L. Because the Ewald sphere radius k = 1/lambda is vast (~400 nm^-1), the sphere behaves like a flat planar slice cutting reciprocal space.",
      labRelevance: "To index an unknown single-crystal SAED pattern: measure spot distances R1, R2 and inter-spot angle phi; calculate ratio R1/R2 (equal to d2/d1); cross-reference against known crystal d-spacing ratios; and verify zone axis [uvw] = g1 x g2.",
      tutorStep1: "The direct beam passes straight through to form the (000) spot on the phosphor screen.",
      tutorStep2: "Lattice planes (hkl) scatter electrons by angle 2*theta_B = lambda / d, producing spots at distance R = L * 2*theta_B = lambda * L / d.",
      tutorStep3: "The product R * d is a constant (lambda * L) determined by accelerating voltage and intermediate lens magnification.",
      tutorQuestion: "If you change the microscope accelerating voltage from 100 kV to 200 kV while keeping the camera length L constant, what happens to the distance R between diffraction spots on the screen?",
      examCriterion: "The camera constant equation R * d = lambda * L establishes that measured spot distance R is inversely proportional to interplanar d-spacing.",
      examPitfall: "Neglecting specimen height: if the specimen is not at the true eucentric height, the objective lens current shifts to achieve focus, altering the effective camera length L and distorting d-spacing calibration.",
      diagStep1: "Switch to diffraction mode; center the intermediate aperture around the region of interest in image mode first.",
      diagStep2: "Focus the diffraction spots to sharp points using the diffraction focus control.",
      diagStep3: "Insert the beam stop over the intense (000) direct beam to protect the digital detector from saturation and blooming.",
    };
  }

  // Topic 12: Amplitude & Mass-Thickness Contrast (Ch 22)
  if (ch === 22 || qLower.includes("amplitude") || qLower.includes("mass-thickness") || qLower.includes("diffraction contrast")) {
    return {
      physicalMechanism: "Amplitude contrast is generated by inserting an objective aperture into the back focal plane of the objective lens to physically block scattered electrons. In amorphous materials, contrast is governed by Mass-Thickness contrast (Rutherford scattering cross-section sigma_t proportional to Z^(4/3)), where thicker or higher-Z regions scatter electrons outside the aperture and appear dark. In crystalline materials, contrast is governed by Diffraction contrast, where planes satisfying Bragg's law deflect electrons into discrete Bragg beams intercepted by the aperture.",
      labRelevance: "In Bright-Field imaging, crystalline defects, grain boundaries, and dislocations scatter electrons out of the objective aperture and appear dark. Decreasing the objective aperture diameter increases image contrast by blocking smaller scattering angles, but slightly reduces spatial resolution due to diffraction broadening.",
      tutorStep1: "In the back focal plane, electrons are sorted into diffraction spots according to their scattering angles.",
      tutorStep2: "An objective aperture centered on the (000) beam lets only direct electrons pass into the image plane.",
      tutorStep3: "Regions that scatter strongly (dense atoms, thick areas, or diffracting crystal planes) lose electrons and appear dark on the detector.",
      tutorQuestion: "If you observe dark bands running across a crystalline grain in Bright-Field, how can you experimentally verify whether they are bend contours or composition variations?",
      examCriterion: "Mass-thickness transmitted intensity follows the Beer-Lambert form: I_BF = I_0 * exp(-N * sigma_t * t), where total cross-section sigma_t scales with Z^(4/3).",
      examPitfall: "Confusing mass-thickness contrast with diffraction contrast; mass-thickness operates via incoherent Rutherford scattering in amorphous materials, while diffraction contrast requires coherent Bragg reflections.",
      diagStep1: "In diffraction mode, check that the objective aperture is precisely concentric with the central (000) spot.",
      diagStep2: "Select a smaller objective aperture size (e.g. 20 um or 30 um) to boost amplitude contrast in low-Z or biological samples.",
      diagStep3: "Tilt the sample slightly: if dark bands move rapidly across the grain, they are diffraction bend contours; if they remain static, they are mass-thickness variations.",
    };
  }

  // Default Fallback (General Foundations: Ch 1, 2, 5, 6)
  return {
    physicalMechanism: `According to Williams & Carter (Chapter ${ch}, Section ${sec}), electron optics in the TEM exploits the de Broglie wavelength of relativistic electrons. At 200 kV accelerating voltage, relativistic contraction yields an electron wavelength lambda = 0.00251 nm (2.51 pm), five orders of magnitude smaller than visible light, overcoming the optical Abbe diffraction limit.`,
    labRelevance: "Understanding this foundational electron optical relationship allows the operator to select optimal accelerating voltages, choose suitable objective aperture semi-angles, and balance spherical aberration against diffraction broadening.",
    tutorStep1: "Electrons accelerated through high potential V acquire relativistic momentum p = sqrt(2 m0 e V (1 + e V / 2 m0 c^2)).",
    tutorStep2: "The corresponding de Broglie wavelength lambda = h / p is in the picometer range, enabling sub-angstrom resolution.",
    tutorStep3: "Apertures and magnetic lenses must be carefully centered to control spherical and chromatic aberration disks.",
    tutorQuestion: "Why does increasing accelerating voltage reduce electron wavelength, and how does this affect the radius of the Ewald sphere?",
    examCriterion: "Relativistic momentum dictates de Broglie wavelength: lambda = h / sqrt(2 m0 e V (1 + e V / (2 m0 c^2))).",
    examPitfall: "Using the non-relativistic formula for electron wavelength at TEM voltages (>80 kV), which underestimates momentum and overestimates wavelength.",
    diagStep1: "Verify high tension stability: ensure the accelerating voltage is fully conditioned and stable at the operating setpoint.",
    diagStep2: "Check beam illumination tilt and shift alignment coils to ensure concentric illumination.",
    diagStep3: "Inspect the specimen at low magnification to check for mechanical drift or thermal charging before advancing to high magnification.",
  };
}

function generateSuggestedQuestions(query: string, match: RetrievedSource | null): string[] {
  const qLower = query.toLowerCase();
  const ch = match?.chapterNumber || 1;

  if (ch === 19 || qLower.includes("kikuchi")) {
    return [
      "Why do Kikuchi lines move with crystal tilt while Bragg spots stay stationary?",
      "How do you achieve an exact two-beam condition (s = 0) using Kikuchi lines?",
      "What is the difference between excess and deficiency Kikuchi lines?",
    ];
  }
  if (ch === 1 && (match?.sectionNumber === "1.4" || qLower.includes("sem"))) {
    return [
      "How does the interaction volume in bulk SEM compare to a thin TEM foil?",
      "Why does SEM secondary electron imaging provide superior depth of field?",
      "When is STEM-HAADF preferred over high-resolution SEM?",
    ];
  }
  if (ch === 13 || qLower.includes("dark-field") || qLower.includes("cdf")) {
    return [
      "Why does Centered Dark-Field (CDF) eliminate off-axis spherical aberration?",
      "How are beam tilt coils adjusted to produce a two-beam CDF image?",
      "When should you use weak-beam dark-field (WBDF) for dislocation imaging?",
    ];
  }
  if (ch === 23 || qLower.includes("burgers") || qLower.includes("dislocation")) {
    return [
      "How do you determine a dislocation's Burgers vector using g.b = 0?",
      "Why do edge dislocations show residual contrast when g.b = 0?",
      "What is a two-beam condition and why is it essential for defect imaging?",
    ];
  }
  if (ch === 28 || qLower.includes("scherzer") || qLower.includes("hrtem")) {
    return [
      "What is the Contrast Transfer Function (CTF) in HRTEM?",
      "Why does Scherzer defocus Delta f = -1.2*sqrt(Cs*lambda) prevent contrast reversals?",
      "How do Thon rings in live FFT power spectra reveal objective astigmatism?",
    ];
  }
  if (ch === 24 || qLower.includes("haadf") || qLower.includes("stem")) {
    return [
      "Why does HAADF-STEM intensity scale with Z^(1.7-2.0)?",
      "What is the Kossel-Mollenstedt condition for non-overlapping CBED discs?",
      "How does an annular dark-field detector suppress coherent Bragg scattering?",
    ];
  }
  if (ch === 38 || ch === 33 || ch === 37 || qLower.includes("eels") || qLower.includes("eds")) {
    return [
      "Why is EELS superior to EDS for detecting light elements like Li, B, and C?",
      "How does the Cliff-Lorimer equation quantify thin-film TEM-EDS compositions?",
      "How does low-loss EELS plasmon spectroscopy measure local foil thickness?",
    ];
  }
  if (ch === 10 || qLower.includes("prep") || qLower.includes("fib")) {
    return [
      "How does low-kV polishing remove Ga+ ion damage from FIB lamellae?",
      "What are the advantages of twin-jet electropolishing for metallic TEM specimens?",
      "Why is plasma cleaning essential before high-resolution TEM inspection?",
    ];
  }
  if (ch === 4 || qLower.includes("alignment") || qLower.includes("astigmatism")) {
    return [
      "How do you set true eucentric height using the Z-axis wobbler?",
      "How do Fresnel fringes on amorphous carbon edges reveal objective astigmatism?",
      "What is the difference between current centering and voltage centering?",
    ];
  }
  if (ch === 11 || ch === 12) {
    return [
      "Explain the Camera Constant equation R*d = lambda*L in SAED.",
      "Why does the large Ewald sphere radius allow simultaneous zone-axis diffraction?",
      "How do you index a single-crystal spot pattern using inter-spot ratios and angles?",
    ];
  }

  return [
    "Why does diffraction contrast occur in TEM?",
    "How does the Ewald sphere relate to SAED patterns?",
    "What is Scherzer defocus in HRTEM?",
  ];
}

