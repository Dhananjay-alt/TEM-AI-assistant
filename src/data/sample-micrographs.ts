/**
 * Sample TEM Micrographs & Presets for Image Analysis & Vision
 */

export interface SampleMicrograph {
  id: string;
  title: string;
  type: "BF-TEM" | "DF-TEM" | "HRTEM" | "SAED";
  material: string;
  description: string;
  scaleBarNm: number;
  scaleBarPixels: number; // Pixels corresponding to scaleBarNm
  expectedParticleCount: number;
  expectedMeanDiameterNm: number;
  expectedStdDevNm: number;
  defaultPrompt: string;
  svgDataUri: string;
}

// Generate high-contrast SVG representations that Canvas can render and analyze cleanly
function generateGoldNPsSvg(): string {
  const particles: string[] = [];
  // Deterministic particle coordinates for reproducible particle size analysis
  const coords = [
    { cx: 80, cy: 90, r: 12 },
    { cx: 140, cy: 75, r: 14 },
    { cx: 210, cy: 110, r: 16 },
    { cx: 280, cy: 80, r: 11 },
    { cx: 340, cy: 120, r: 15 },
    { cx: 100, cy: 170, r: 18 },
    { cx: 160, cy: 220, r: 13 },
    { cx: 230, cy: 180, r: 15 },
    { cx: 290, cy: 230, r: 17 },
    { cx: 360, cy: 200, r: 12 },
    { cx: 70, cy: 270, r: 14 },
    { cx: 130, cy: 310, r: 16 },
    { cx: 210, cy: 280, r: 19 },
    { cx: 280, cy: 320, r: 13 },
    { cx: 350, cy: 290, r: 15 },
    { cx: 110, cy: 370, r: 11 },
    { cx: 180, cy: 390, r: 14 },
    { cx: 260, cy: 380, r: 16 },
    { cx: 330, cy: 370, r: 13 },
    { cx: 170, cy: 140, r: 15 },
    { cx: 250, cy: 60, r: 12 },
    { cx: 50, cy: 160, r: 10 },
  ];

  for (const p of coords) {
    particles.push(
      `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="#181a1b" stroke="#000000" stroke-width="1.5" />`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    <rect width="420" height="420" fill="#d8d5cb" />
    <!-- Amorphous carbon noise grid -->
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
      <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.12 0"/>
      <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
    </filter>
    <rect width="420" height="420" fill="#e8e5dc" opacity="0.9" filter="url(#noise)" />
    <!-- Nanoparticles -->
    <g id="nanoparticles">
      ${particles.join("")}
    </g>
    <!-- Scale Bar: 100 nm = 80 pixels -->
    <g id="scale-bar" transform="translate(30, 385)">
      <rect x="0" y="0" width="80" height="5" fill="#000000" />
      <text x="40" y="-4" font-family="monospace" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">100 nm</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateSaedPatternSvg(): string {
  const rings = [
    { r: 42, label: "(111)" },
    { r: 49, label: "(200)" },
    { r: 69, label: "(220)" },
    { r: 81, label: "(311)" },
    { r: 98, label: "(400)" },
    { r: 122, label: "(422)" },
  ];

  const ringElements = rings.map((rg) => {
    return `<circle cx="210" cy="210" r="${rg.r}" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-dasharray="3,2" opacity="0.85"/>
      <text x="${210 + rg.r + 4}" y="214" font-family="monospace" font-size="9" fill="#4ade80">${rg.label}</text>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    <rect width="420" height="420" fill="#0b0e14" />
    <!-- Diffuse central background glow -->
    <radialGradient id="beam-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
      <stop offset="6%" stop-color="#047857" stop-opacity="0.4"/>
      <stop offset="40%" stop-color="#064e3b" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#0b0e14" stop-opacity="0"/>
    </radialGradient>
    <circle cx="210" cy="210" r="180" fill="url(#beam-glow)"/>
    
    <!-- Polycrystalline Debye-Scherrer Rings -->
    ${ringElements.join("")}

    <!-- Central transmitted beam with beam stopper shadow -->
    <circle cx="210" cy="210" r="9" fill="#ffffff" stroke="#10b981" stroke-width="3" />
    <polygon points="210,210 216,210 250,420 238,420" fill="#18181b" opacity="0.8" />
    
    <!-- Scale calibration indicator -->
    <g transform="translate(25, 395)">
      <line x1="0" y1="0" x2="60" y2="0" stroke="#10b981" stroke-width="2"/>
      <text x="30" y="-4" font-family="monospace" font-size="10" fill="#10b981" text-anchor="middle">5 nm⁻¹</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function generateHrtemLatticeSvg(): string {
  const fringes: string[] = [];
  // Si (111) fringes oriented at 45 degrees
  for (let i = 0; i < 420; i += 7) {
    fringes.push(
      `<line x1="0" y1="${i}" x2="${i}" y2="0" stroke="#1a1a1a" stroke-width="2.5" opacity="${0.4 + 0.3 * Math.sin(i / 15)}" />`
    );
    fringes.push(
      `<line x1="${i}" y1="420" x2="420" y2="${i}" stroke="#1a1a1a" stroke-width="2.5" opacity="${0.4 + 0.3 * Math.sin(i / 15)}" />`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="420" viewBox="0 0 420 420">
    <rect width="420" height="420" fill="#cfcbbd" />
    <g id="fringes">
      ${fringes.join("")}
    </g>
    <!-- Scale Bar: 2 nm = 100 pixels -->
    <g id="scale-bar" transform="translate(30, 390)">
      <rect x="0" y="0" width="100" height="4" fill="#ffffff" stroke="#000000" stroke-width="1"/>
      <text x="50" y="-4" font-family="monospace" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">2.0 nm (Si 111)</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_MICROGRAPHS: SampleMicrograph[] = [
  {
    id: "sample-gold-nps",
    title: "Au Nanoparticles (Bright-Field)",
    type: "BF-TEM",
    material: "Gold (Au) on Carbon",
    description: "Monodisperse colloidal gold nanoparticles deposited on a thin amorphous carbon film.",
    scaleBarNm: 100,
    scaleBarPixels: 80,
    expectedParticleCount: 22,
    expectedMeanDiameterNm: 17.5,
    expectedStdDevNm: 3.2,
    defaultPrompt: "Analyze the nanoparticle size distribution, morphology, and contrast mechanisms in this bright-field TEM micrograph.",
    svgDataUri: generateGoldNPsSvg(),
  },
  {
    id: "sample-saed-gold",
    title: "Polycrystalline Gold SAED Pattern",
    type: "SAED",
    material: "Polycrystalline Au Thin Film",
    description: "Selected-Area Electron Diffraction pattern showing Debye-Scherrer rings from FCC gold crystallites.",
    scaleBarNm: 5,
    scaleBarPixels: 60,
    expectedParticleCount: 6,
    expectedMeanDiameterNm: 0,
    expectedStdDevNm: 0,
    defaultPrompt: "Index the visible Debye-Scherrer rings, identify crystal structure, and calculate reciprocal interplanar spacings.",
    svgDataUri: generateSaedPatternSvg(),
  },
  {
    id: "sample-silicon-hrtem",
    title: "Silicon [110] Lattice Fringes (HRTEM)",
    type: "HRTEM",
    material: "Single-Crystal Silicon",
    description: "High-Resolution TEM phase-contrast lattice fringes showing Si (111) planes at Scherzer defocus.",
    scaleBarNm: 2.0,
    scaleBarPixels: 100,
    expectedParticleCount: 0,
    expectedMeanDiameterNm: 0.314,
    expectedStdDevNm: 0.01,
    defaultPrompt: "Explain the phase contrast origin of these lattice fringes, discuss Scherzer defocus, and verify Si d-spacing.",
    svgDataUri: generateHrtemLatticeSvg(),
  },
];
