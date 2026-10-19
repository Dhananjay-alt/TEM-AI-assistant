/**
 * TEM Examination Question Bank with Carter-Grounded Marking Rubrics
 */

export interface ExamQuestion {
  id: string;
  topic: "Electron Optics" | "Diffraction" | "Imaging & Contrast" | "Defects & Dislocations" | "Spectrometry";
  type: "MCQ" | "2 MARK" | "5 MARK" | "10 MARK" | "VIVA";
  difficulty: "Easy" | "Medium" | "Hard";
  marks: number;
  questionText: string;
  options?: string[]; // for MCQ
  correctOptionIndex?: number; // for MCQ
  modelAnswer: string;
  gradingCriteria: {
    goodPoints: string[];
    missingPenalties: string[];
    carterCitation: string;
  };
}

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // MCQs
  {
    id: "q-mcq-1",
    topic: "Electron Optics",
    type: "MCQ",
    difficulty: "Easy",
    marks: 1,
    questionText:
      "What is the approximate relativistic de Broglie electron wavelength at an accelerating voltage of 200 kV in a TEM?",
    options: [
      "0.00251 nm (2.51 pm)",
      "0.0370 nm (37.0 pm)",
      "0.251 nm (2.51 Å)",
      "0.000197 nm (0.197 pm)",
    ],
    correctOptionIndex: 0,
    modelAnswer:
      "At 200 kV, relativistic momentum p = sqrt(2*m0*e*V*(1 + eV/(2*m0*c^2))). Solving lambda = h / p yields lambda = 0.00251 nm (2.51 pm).",
    gradingCriteria: {
      goodPoints: ["Correctly identified 0.00251 nm", "Understands relativistic contraction effect"],
      missingPenalties: ["Confusing 200 kV with 100 kV (0.0037 nm)"],
      carterCitation: "Williams & Carter, Chapter 1, Section 1.2, p. 5",
    },
  },
  {
    id: "q-mcq-2",
    topic: "Diffraction",
    type: "MCQ",
    difficulty: "Medium",
    marks: 1,
    questionText:
      "In Selected-Area Electron Diffraction (SAED), how does the distance R of a diffraction spot from the center change if the camera length L is doubled?",
    options: [
      "R is halved",
      "R is doubled",
      "R remains unchanged",
      "R increases by a factor of 4",
    ],
    correctOptionIndex: 1,
    modelAnswer:
      "From the Camera Constant equation R * d = lambda * L, spot distance R is directly proportional to camera length L (R = lambda * L / d). Doubling L doubles R.",
    gradingCriteria: {
      goodPoints: ["Applied camera constant equation R*d = lambda*L", "Recognized direct linear proportionality"],
      missingPenalties: ["Inverting relationship between R and L"],
      carterCitation: "Williams & Carter, Chapter 12, Section 12.2, p. 203",
    },
  },
  {
    id: "q-mcq-3",
    topic: "Imaging & Contrast",
    type: "MCQ",
    difficulty: "Medium",
    marks: 1,
    questionText:
      "Under what condition does a screw dislocation become completely invisible in Bright-Field / Dark-Field TEM?",
    options: [
      "g · b = 0",
      "g · b = 1",
      "g · (b × u) = 0",
      "g parallel to b",
    ],
    correctOptionIndex: 0,
    modelAnswer:
      "For a screw dislocation, the atomic displacement field is purely parallel to Burgers vector b. When the diffraction vector g is perpendicular to b (g · b = 0), the displacement does not tilt the diffracting planes, causing the dislocation to vanish.",
    gradingCriteria: {
      goodPoints: ["Selected g · b = 0", "Understands screw dislocation displacement geometry"],
      missingPenalties: ["Confusing edge and screw invisibility criteria"],
      carterCitation: "Williams & Carter, Chapter 23, Section 23.2, p. 379",
    },
  },

  // 2 MARK QUESTIONS
  {
    id: "q-2m-1",
    topic: "Electron Optics",
    type: "2 MARK",
    difficulty: "Easy",
    marks: 2,
    questionText: "State the de Broglie hypothesis and explain why relativistic corrections are mandatory in TEM.",
    modelAnswer:
      "The de Broglie hypothesis states that any moving particle has an associated wave with wavelength lambda = h / p. In a 200 kV TEM, electrons travel at roughly 70% the speed of light (0.695 c). The relativistic mass increase increases momentum p, reducing the actual wavelength from the non-relativistic 0.00274 nm down to 0.00251 nm—an ~8.5% error that would invalidate lattice and diffraction indexing if ignored.",
    gradingCriteria: {
      goodPoints: [
        "Mentioned lambda = h / p",
        "Pointed out high electron speed (~0.7 c at 200 kV)",
        "Explained relativistic momentum increase reducing wavelength",
      ],
      missingPenalties: [
        "Omitting formula lambda = h/p (-0.5)",
        "Failing to explain momentum or mass increase (-0.5)",
      ],
      carterCitation: "Williams & Carter, Chapter 1, Section 1.2, pp. 4-6",
    },
  },
  {
    id: "q-2m-2",
    topic: "Imaging & Contrast",
    type: "2 MARK",
    difficulty: "Easy",
    marks: 2,
    questionText: "Distinguish between Bright-Field (BF) and Dark-Field (DF) imaging in terms of the objective aperture position.",
    modelAnswer:
      "In Bright-Field (BF) imaging, the objective aperture is centered on the optical axis to transmit only the direct (unscattered) beam (000), while blocking diffracted beams. In Dark-Field (DF) imaging, the aperture selects a specific diffracted beam (g), so only regions satisfying the Bragg condition appear bright against a dark background.",
    gradingCriteria: {
      goodPoints: [
        "BF selects direct unscattered beam (000)",
        "DF selects diffracted Bragg beam (g)",
        "Objective aperture is placed in back focal plane",
      ],
      missingPenalties: [
        "Confusing selected-area aperture with objective aperture (-1.0)",
      ],
      carterCitation: "Williams & Carter, Chapter 22, Section 22.1, p. 352",
    },
  },

  // 5 MARK QUESTIONS
  {
    id: "q-5m-1",
    topic: "Diffraction",
    type: "5 MARK",
    difficulty: "Medium",
    marks: 5,
    questionText:
      "Derive the fundamental TEM Camera Constant equation R · d = λ · L from Bragg's Law and diffraction geometry.",
    modelAnswer:
      "1. Bragg's Law states: lambda = 2 * d * sin(theta_B). Because electron wavelength lambda is very small in TEM, theta_B is very small (few mrad), allowing the small-angle approximation: sin(theta_B) ~ theta_B. Thus 2*theta_B ~ lambda / d.\n\n" +
      "2. From the diffraction ray diagram, the diffracted beam is deflected by angle 2*theta_B from the optical axis onto a detector located at effective camera length L. The radial distance R on the detector is: tan(2*theta_B) = R / L.\n\n" +
      "3. Applying the small-angle approximation again: tan(2*theta_B) ~ 2*theta_B ~ R / L.\n\n" +
      "4. Equating the two expressions for 2*theta_B:\n   lambda / d = R / L\n   Rearranging yields:\n   R * d = lambda * L\n\n" +
      "Here lambda * L is the Camera Constant (in mm * nm), which directly links measured spot radius R to real-space interplanar spacing d.",
    gradingCriteria: {
      goodPoints: [
        "Stated Bragg's law: lambda = 2*d*sin(theta)",
        "Used small-angle approximation 2*theta ~ lambda/d",
        "Set up geometric deflection tan(2*theta) = R/L",
        "Correctly arrived at R * d = lambda * L",
        "Identified lambda * L as the Camera Constant",
      ],
      missingPenalties: [
        "Missing small-angle approximation justification (-1.0)",
        "Algebraic mistake in equating deflection angle (-1.5)",
      ],
      carterCitation: "Williams & Carter, Chapter 12, Section 12.2, pp. 201-204",
    },
  },
  {
    id: "q-5m-2",
    topic: "Defects & Dislocations",
    type: "5 MARK",
    difficulty: "Medium",
    marks: 5,
    questionText:
      "Explain the g · b = 0 invisibility criterion for determining the Burgers vector of dislocations under a two-beam condition.",
    modelAnswer:
      "1. Principle: Under a two-beam condition (only 000 and one strong Bragg reflection g excited), contrast arises from local atomic displacements R(r) around the defect that tilt crystal planes, introducing a phase shift alpha = 2*pi * g · R.\n\n" +
      "2. Dislocation Displacement Field: A dislocation with Burgers vector b displaces atoms predominantly in the direction of b.\n\n" +
      "3. Invisibility Criterion: When the operating diffraction vector g is perpendicular to b, their dot product vanishes: g · b = 0. When g · b = 0, atomic displacements lie within the diffracting planes, meaning the planes are not distorted with respect to g. Consequently, no extra phase shift or Bragg tilt occurs, and the dislocation becomes invisible.\n\n" +
      "4. Experimental Method: The sample is tilted across two non-parallel operating reflections g1 and g2 where the dislocation vanishes (g1 · b = 0 and g2 · b = 0). The Burgers vector is then parallel to the cross product: b || (g1 × g2).\n\n" +
      "5. Note for Edge Dislocations: Full invisibility also requires g · (b × u) = 0, where u is the dislocation line vector.",
    gradingCriteria: {
      goodPoints: [
        "Explained phase shift alpha = 2*pi * g · R",
        "Stated g · b = 0 condition clearly",
        "Described planes remaining unbent",
        "Explained Burgers vector determination via b || g1 x g2",
        "Distinguished edge vs screw dislocation behavior",
      ],
      missingPenalties: [
        "Failing to mention how b is determined from two reflections (-1.5)",
        "Missing phase shift explanation (-1.0)",
      ],
      carterCitation: "Williams & Carter, Chapter 23, Section 23.2, pp. 375-381",
    },
  },

  // 10 MARK QUESTION
  {
    id: "q-10m-1",
    topic: "Imaging & Contrast",
    type: "10 MARK",
    difficulty: "Hard",
    marks: 10,
    questionText:
      "Compare and contrast the three primary contrast mechanisms in TEM: Mass-Thickness Contrast, Diffraction Contrast, and Phase Contrast. Discuss aperture conditions, ray formation, specimen criteria, and physical origins.",
    modelAnswer:
      "1. Mass-Thickness Contrast (Incoherent Amplitude Contrast):\n" +
      "• Origin: Incoherent elastic Rutherford scattering to high angles by atomic nuclei.\n" +
      "• Aperture: Small objective aperture centered on the optical axis.\n" +
      "• Mechanism: Heavy elements (high Z) and thicker areas scatter electrons outside the aperture and appear dark in Bright-Field.\n" +
      "• Specimens: Dominates in amorphous polymers, carbon grids, biological samples stained with uranyl acetate/lead citrate.\n\n" +
      "2. Diffraction Contrast (Coherent Amplitude Contrast):\n" +
      "• Origin: Coherent elastic Bragg scattering from crystalline atomic planes satisfying 2*d*sin(theta) = lambda.\n" +
      "• Aperture: Small objective aperture positioned to select either direct beam (Bright-Field) or one diffracted beam g (Dark-Field).\n" +
      "• Mechanism: Diffracting crystallites divert intensity away from the optical axis into Bragg spots. In BF they appear dark; in DF they appear bright.\n" +
      "• Specimens: Crystalline metals, semiconductors, ceramics; used for dislocation analysis (g·b=0), grain boundaries, twins, and thickness fringes.\n\n" +
      "3. Phase Contrast (Coherent Wave Interference):\n" +
      "• Origin: Coherent interference between the transmitted beam and multiple Bragg diffracted beams at the image plane.\n" +
      "• Aperture: Wide objective aperture or no aperture.\n" +
      "• Mechanism: Modulated by the Contrast Transfer Function (CTF: sin(chi(u))) influenced by spherical aberration Cs and defocus Delta f. At Scherzer defocus (-1.2*sqrt(Cs*lambda)), a broad passband allows direct atomic column imaging.\n" +
      "• Specimens: Ultra-thin crystalline foils (<10 nm); used in HRTEM for lattice fringe measurements, stacking faults, and atomic interfaces.",
    gradingCriteria: {
      goodPoints: [
        "Addressed all 3 mechanisms comprehensively",
        "Clearly identified aperture differences (small vs wide/none)",
        "Distinguished coherent Bragg vs incoherent Rutherford vs wave interference",
        "Mentioned Scherzer defocus and CTF for phase contrast",
        "Provided relevant material examples for each",
      ],
      missingPenalties: [
        "Failing to mention CTF / Scherzer defocus in phase contrast (-2.0)",
        "Omitting aperture roles (-2.0)",
        "Conflating mass-thickness with diffraction contrast (-1.5)",
      ],
      carterCitation: "Williams & Carter, Chapters 22, 23, and 28",
    },
  },

  // VIVA QUESTION
  {
    id: "q-viva-1",
    topic: "Electron Optics",
    type: "VIVA",
    difficulty: "Hard",
    marks: 5,
    questionText:
      "Viva Voce: Why is the Ewald sphere in TEM commonly approximated as a flat plane, and what is the experimental consequence for electron diffraction?",
    modelAnswer:
      "Examiner Response:\n" +
      "'Because the relativistic electron wavelength in TEM is extraordinarily short (0.0025 nm at 200 kV), the radius of the Ewald sphere (k = 1/lambda = 400 nm^-1) is immense compared to typical reciprocal lattice interplanar spacings (1/d ~ 2 to 10 nm^-1).\n\n" +
      "Consequently, over the small angular range collected by the TEM (theta < 2 degrees), the spherical surface has virtually zero curvature—it acts as a flat plane cutting through reciprocal space.\n\n" +
      "The major experimental consequence is that the Ewald sphere intersects an entire plane of reciprocal lattice points simultaneously. This is why a TEM captures a complete, 2D symmetrical zone-axis diffraction spot pattern in a single static exposure without needing to rotate the crystal, unlike X-ray diffraction where the sphere is small and the crystal must be continuously rocked.'",
    gradingCriteria: {
      goodPoints: [
        "Calculated or noted large radius 1/lambda (~400 nm^-1)",
        "Compared radius to reciprocal lattice spacing",
        "Concluded simultaneous multi-spot zone axis pattern in single exposure",
        "Contrasted with X-ray diffraction rocking",
      ],
      missingPenalties: [
        "Giving vague answer without mentioning 1/lambda or curvature (-2.0)",
      ],
      carterCitation: "Williams & Carter, Chapter 11, Section 11.3, pp. 187-190",
    },
  },
];
