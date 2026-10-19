/**
 * TEM Technique Recommendation Matrix
 * Educational decision tree grounded in Williams & Carter
 */

export interface TemTechnique {
  id: string;
  name: string;
  abbreviation: string;
  category: "Imaging" | "Diffraction" | "Spectrometry" | "Advanced";
  stars: number; // 1 to 5
  primaryUse: string;
  detailedRationale: string;
  pros: string[];
  cons: string[];
  specimenRequirements: string;
  carterReference: string;
  targetTags: string[];
  scaleCompatibility: ("<10nm" | "10-100nm" | ">100nm")[];
  crystallinityCompatibility: ("crystalline" | "amorphous" | "both")[];
}

export const TEM_TECHNIQUES: TemTechnique[] = [
  {
    id: "saed",
    name: "Selected-Area Electron Diffraction",
    abbreviation: "SAED",
    category: "Diffraction",
    stars: 5,
    primaryUse: "Determine crystal structure, space group, zone axis, and preferred orientation",
    detailedRationale:
      "Uses a field-limiting aperture in the image plane to isolate a 0.5 to 2 micron area. Yields spot patterns for single crystals and sharp Debye-Scherrer concentric rings for polycrystalline films. Provides direct access to reciprocal lattice interplanar spacings via R*d = lambda*L.",
    pros: [
      "Immediate distinction between amorphous, polycrystalline, and single-crystal phases",
      "Direct measurement of crystallographic d-spacings",
      "Enables precise zone-axis tilt alignment for subsequent HRTEM or defect imaging",
    ],
    cons: [
      "Spatial resolution limited to ~0.5 um due to spherical aberration of the objective lens",
      "Dynamic multi-beam scattering distorts kinematical intensity calculations",
    ],
    specimenRequirements: "Thin crystalline foil (<50 nm for low dynamic scattering)",
    carterReference: "Williams & Carter, Chapter 12: 'Selected-Area Diffraction'",
    targetTags: ["crystal-structure", "lattice-spacing", "orientation", "crystallinity"],
    scaleCompatibility: ["10-100nm", ">100nm"],
    crystallinityCompatibility: ["crystalline"],
  },
  {
    id: "hrtem",
    name: "High-Resolution Transmission Electron Microscopy",
    abbreviation: "HRTEM",
    category: "Imaging",
    stars: 5,
    primaryUse: "Atomic-scale lattice fringe imaging, interface matching, and planar defect structure",
    detailedRationale:
      "Employs coherent phase contrast through an open objective aperture. Transmitted and diffracted beams interfere in the image plane. When tuned to Scherzer defocus (-1.2*sqrt(Cs*lambda)), atomic columns project as dark features across the optimal CTF passband.",
    pros: [
      "Sub-angstrom spatial resolution for lattice fringe visualization",
      "Direct observation of atomic interfaces, stacking faults, and anti-phase boundaries",
      "Enables local Fast Fourier Transform (FFT) nanodiffraction from selected atomic regions",
    ],
    cons: [
      "Lattice fringes do not directly represent atomic columns away from Scherzer defocus due to CTF phase reversals",
      "Severe specimen thickness constraints (<10 nm required)",
      "High electron dose induces beam damage in delicate samples",
    ],
    specimenRequirements: "Ultra-thin foil (<10 nm) oriented precisely down a low-index zone axis",
    carterReference: "Williams & Carter, Chapters 28 & 29: 'Phase-Contrast Imaging & HRTEM'",
    targetTags: ["crystal-structure", "lattice-spacing", "interfaces", "defects"],
    scaleCompatibility: ["<10nm", "10-100nm"],
    crystallinityCompatibility: ["crystalline"],
  },
  {
    id: "bf-df",
    name: "Bright-Field & Dark-Field TEM",
    abbreviation: "BF / DF",
    category: "Imaging",
    stars: 5,
    primaryUse: "Particle morphology, grain size distribution, and dislocation Burgers vector analysis",
    detailedRationale:
      "Classic amplitude contrast using an objective aperture. In Bright-Field, the transmitted beam is selected to reveal mass-thickness and overall morphology. In Dark-Field, a specific Bragg diffracted beam is selected, illuminating only grains or defects satisfying the Bragg condition.",
    pros: [
      "Intuitive contrast and low operational complexity",
      "Enables g·b = 0 dislocation Burgers vector extinction criteria",
      "High contrast for heavy metal nanoparticles on light carbon supports",
    ],
    cons: [
      "Limited spatial resolution (~1-2 nm) compared to HRTEM",
      "Cannot resolve internal atomic structure directly",
    ],
    specimenRequirements: "Standard thin specimen (<80 nm)",
    carterReference: "Williams & Carter, Chapters 22 & 23: 'Amplitude Contrast & Diffraction Contrast'",
    targetTags: ["morphology", "defects", "grain-size", "nanoparticles"],
    scaleCompatibility: ["<10nm", "10-100nm", ">100nm"],
    crystallinityCompatibility: ["both"],
  },
  {
    id: "stem-haadf",
    name: "High-Angle Annular Dark-Field STEM",
    abbreviation: "STEM-HAADF",
    category: "Imaging",
    stars: 5,
    primaryUse: "Z-contrast chemical imaging and atomic column mass profiling without phase contrast artifacts",
    detailedRationale:
      "A finely focused electron probe is rastered over the sample. Scattered electrons at high angles (>50 mrad) are collected by an annular dark-field detector. High-angle thermal diffuse scattering scales roughly with Z^1.7 - Z^2, creating direct atomic-number contrast without CTF phase reversals.",
    pros: [
      "Directly interpretable atomic images: heavier atomic columns glow brighter",
      "No contrast reversals with thickness or defocus variations",
      "Simultaneous collection of EDS and EELS spectral signals",
    ],
    cons: [
      "Requires high-brightness FEG source and scanning coils (STEM)",
      "Sample drift distorts scanning raster lines",
    ],
    specimenRequirements: "Thin foil (<30 nm), atomically clean surface",
    carterReference: "Williams & Carter, Chapter 27: 'Scanning Transmission Electron Microscopy'",
    targetTags: ["composition", "interfaces", "atomic-structure", "morphology"],
    scaleCompatibility: ["<10nm", "10-100nm"],
    crystallinityCompatibility: ["both"],
  },
  {
    id: "eds",
    name: "Energy-Dispersive X-ray Spectroscopy",
    abbreviation: "TEM-EDS",
    category: "Spectrometry",
    stars: 4,
    primaryUse: "Elemental identification and quantitative chemical composition from Sodium (Na) to Uranium (U)",
    detailedRationale:
      "Detects characteristic X-rays emitted during electron beam de-excitation. Uses Silicon Drift Detectors (SDD) and Cliff-Lorimer ratio equations for thin-film quantification without complex bulk absorption corrections.",
    pros: [
      "Fast multielement detection across whole periodic table",
      "Thin-film approximation eliminates severe matrix corrections",
      "Chemical line profiles and 2D elemental maps",
    ],
    cons: [
      "Low fluorescence yield for light elements (Li, Be, B, C, N)",
      "Specimen holder stray X-rays and Bremsstrahlung background",
    ],
    specimenRequirements: "Thin specimen mounted in low-background holder (Be or Graphite)",
    carterReference: "Williams & Carter, Chapters 33-36: 'X-ray Spectrometry'",
    targetTags: ["composition", "elemental-mapping"],
    scaleCompatibility: ["<10nm", "10-100nm", ">100nm"],
    crystallinityCompatibility: ["both"],
  },
  {
    id: "eels",
    name: "Electron Energy-Loss Spectroscopy",
    abbreviation: "EELS",
    category: "Spectrometry",
    stars: 4,
    primaryUse: "Light element quantification (Li, C, N, O), local thickness measurement, and oxidation state ELNES",
    detailedRationale:
      "Measures energy lost by transmitted electrons. Zero-loss and plasmon peaks yield specimen thickness t/lambda. Core ionization edges reveal chemical elements, oxidation states (e.g. Fe2+ vs Fe3+), and local coordination bonding.",
    pros: [
      "Superb sensitivity to light elements (C, N, O, Li) where EDS fails",
      "High energy resolution (0.3 - 1.0 eV) revealing electronic bonding states",
      "Direct thickness measurement via log-ratio technique",
    ],
    cons: [
      "Extremely sensitive to specimen thickness (t < 50 nm mandatory to avoid multiple scattering)",
      "Complex background subtraction and plural scattering deconvolution",
    ],
    specimenRequirements: "Very thin foil (t/lambda < 0.5, ideally <30 nm)",
    carterReference: "Williams & Carter, Chapters 37-40: 'Electron Energy-Loss Spectroscopy'",
    targetTags: ["composition", "oxidation-state", "thickness", "bonding"],
    scaleCompatibility: ["<10nm", "10-100nm"],
    crystallinityCompatibility: ["both"],
  },
  {
    id: "cbed",
    name: "Convergent-Beam Electron Diffraction",
    abbreviation: "CBED",
    category: "Diffraction",
    stars: 4,
    primaryUse: "Point group & space group symmetry determination, local strain measurement, and foil thickness",
    detailedRationale:
      "Uses a convergent electron cone instead of parallel illumination. Diffraction spots expand into discs containing complex internal dynamical intensity fringes (Kossel-Möllenstedt lines) and Higher-Order Laue Zone (HOLZ) lines.",
    pros: [
      "Determines full 3D crystallographic point group and space group symmetry (including inversion center)",
      "Measures local lattice strain with 10^-4 sensitivity using HOLZ lines",
      "Precise local foil thickness determination from rocking curve fringes",
    ],
    cons: [
      "Demands thicker specimen than HRTEM to develop dynamic fringes (~50-150 nm)",
      "Highly convergent probe causes rapid carbon contamination buildup",
    ],
    specimenRequirements: "Clean crystalline specimen with moderate thickness (50-100 nm)",
    carterReference: "Williams & Carter, Chapters 18-21: 'Convergent-Beam Diffraction'",
    targetTags: ["crystal-structure", "strain-mapping", "symmetry", "thickness"],
    scaleCompatibility: ["10-100nm", ">100nm"],
    crystallinityCompatibility: ["crystalline"],
  },
];
