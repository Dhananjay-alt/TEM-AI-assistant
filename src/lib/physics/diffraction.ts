/**
 * Electron Diffraction and Reciprocal Space Physics
 * Grounded in C. Barry Carter & David B. Williams: "Transmission Electron Microscopy"
 * Part 2: Diffraction (Diffraction Patterns, Thinking in Reciprocal Space, The Ewald Sphere)
 */

import { calculateRelativisticElectron } from "./relativistic";

export interface CrystalData {
  id: string;
  name: string;
  formula: string;
  structure: "FCC" | "BCC" | "Diamond Cubic" | "Hexagonal";
  latticeConstantA: number; // in nm
  latticeConstantC?: number; // in nm
  zoneAxes: string[];
  reflections: {
    hkl: [number, number, number];
    dSpacingNm: number;
    intensity: number; // 0 to 1
  }[];
}

export interface DiffractionSpot {
  hkl: [number, number, number];
  hklStr: string;
  x: number; // Canvas coordinate relative to center
  y: number; // Canvas coordinate relative to center
  distanceMm: number; // R on detector screen in mm
  dSpacingNm: number; // d in nm
  reciprocalVectorNmInv: number; // |g| = 1/d in nm^-1
  braggAngleMrad: number; // theta_B in mrad
  intensity: number; // normalized brightness
  structureFactor: number;
}

export interface DiffractionResult {
  voltageKV: number;
  cameraLengthMm: number;
  wavelengthNm: number;
  cameraConstantMmNm: number; // lambda * L (mm * nm)
  crystal: CrystalData;
  zoneAxis: string;
  mode: "single-crystal" | "polycrystalline-rings";
  spots: DiffractionSpot[];
  rings: {
    hklStr: string;
    dSpacingNm: number;
    radiusMm: number;
    intensity: number;
  }[];
}

// Materials Library with precise crystallographic parameters
export const CRYSTAL_DATABASE: Record<string, CrystalData> = {
  gold: {
    id: "gold",
    name: "Gold (Au)",
    formula: "Au",
    structure: "FCC",
    latticeConstantA: 0.4078,
    zoneAxes: ["[001]", "[011]", "[111]"],
    reflections: [
      { hkl: [1, 1, 1], dSpacingNm: 0.2355, intensity: 1.0 },
      { hkl: [2, 0, 0], dSpacingNm: 0.2039, intensity: 0.52 },
      { hkl: [2, 2, 0], dSpacingNm: 0.1442, intensity: 0.32 },
      { hkl: [3, 1, 1], dSpacingNm: 0.1229, intensity: 0.33 },
      { hkl: [2, 2, 2], dSpacingNm: 0.1177, intensity: 0.12 },
      { hkl: [4, 0, 0], dSpacingNm: 0.1020, intensity: 0.06 },
    ],
  },
  silicon: {
    id: "silicon",
    name: "Silicon (Si)",
    formula: "Si",
    structure: "Diamond Cubic",
    latticeConstantA: 0.5431,
    zoneAxes: ["[001]", "[011]", "[111]"],
    reflections: [
      { hkl: [1, 1, 1], dSpacingNm: 0.3135, intensity: 1.0 },
      { hkl: [2, 2, 0], dSpacingNm: 0.1920, intensity: 0.55 },
      { hkl: [3, 1, 1], dSpacingNm: 0.1638, intensity: 0.30 },
      { hkl: [4, 0, 0], dSpacingNm: 0.1358, intensity: 0.08 },
      { hkl: [3, 3, 1], dSpacingNm: 0.1246, intensity: 0.12 },
    ],
  },
  aluminum: {
    id: "aluminum",
    name: "Aluminum (Al)",
    formula: "Al",
    structure: "FCC",
    latticeConstantA: 0.4049,
    zoneAxes: ["[001]", "[011]", "[111]"],
    reflections: [
      { hkl: [1, 1, 1], dSpacingNm: 0.2338, intensity: 1.0 },
      { hkl: [2, 0, 0], dSpacingNm: 0.2024, intensity: 0.47 },
      { hkl: [2, 2, 0], dSpacingNm: 0.1432, intensity: 0.22 },
      { hkl: [3, 1, 1], dSpacingNm: 0.1221, intensity: 0.24 },
    ],
  },
  graphene: {
    id: "graphene",
    name: "Graphene / Graphite",
    formula: "C",
    structure: "Hexagonal",
    latticeConstantA: 0.2461,
    latticeConstantC: 0.6708,
    zoneAxes: ["[0001]"],
    reflections: [
      { hkl: [1, 0, 0], dSpacingNm: 0.2131, intensity: 0.9 },
      { hkl: [1, 1, 0], dSpacingNm: 0.1230, intensity: 1.0 },
      { hkl: [2, 0, 0], dSpacingNm: 0.1065, intensity: 0.2 },
    ],
  },
};

/**
 * Calculates diffraction pattern spots and rings according to:
 * R * d = lambda * L (TEM Camera Constant)
 */
export function calculateDiffractionPattern(
  voltageKV: number,
  cameraLengthMm: number,
  crystalKey: string,
  zoneAxis: string = "[001]",
  mode: "single-crystal" | "polycrystalline-rings" = "single-crystal",
  scalePixelsPerMm: number = 2.5
): DiffractionResult {
  const { wavelengthNm } = calculateRelativisticElectron(voltageKV);
  const crystal = CRYSTAL_DATABASE[crystalKey] || CRYSTAL_DATABASE.gold;
  const cameraConstant = wavelengthNm * cameraLengthMm; // in mm * nm

  const spots: DiffractionSpot[] = [];
  const rings: {
    hklStr: string;
    dSpacingNm: number;
    radiusMm: number;
    intensity: number;
  }[] = [];

  // Generate polycrystalline Debye-Scherrer rings
  for (const ref of crystal.reflections) {
    const radiusMm = cameraConstant / ref.dSpacingNm;
    rings.push({
      hklStr: `(${ref.hkl.join("")})`,
      dSpacingNm: ref.dSpacingNm,
      radiusMm,
      intensity: ref.intensity,
    });
  }

  // Generate single crystal spot grid based on zone axis
  const a = crystal.latticeConstantA;

  if (crystal.structure === "Hexagonal" || zoneAxis === "[0001]") {
    // 6-fold hexagonal symmetry (Graphene / Graphite)
    const baseD = 0.2131; // nm
    const radiusMm = cameraConstant / baseD;
    const rPixels = radiusMm * scalePixelsPerMm;

    // Six first-order spots {10-10}
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      spots.push({
        hkl: [1, 0, 0],
        hklStr: `(10-10)`,
        x: Math.cos(angle) * rPixels,
        y: Math.sin(angle) * rPixels,
        distanceMm: radiusMm,
        dSpacingNm: baseD,
        reciprocalVectorNmInv: 1 / baseD,
        braggAngleMrad: (wavelengthNm / (2 * baseD)) * 1000,
        intensity: 0.85,
        structureFactor: 1.0,
      });
    }

    // Six second-order spots {11-20}
    const d2 = 0.123;
    const r2Mm = cameraConstant / d2;
    const r2Pixels = r2Mm * scalePixelsPerMm;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 + Math.PI / 6;
      spots.push({
        hkl: [1, 1, 0],
        hklStr: `(11-20)`,
        x: Math.cos(angle) * r2Pixels,
        y: Math.sin(angle) * r2Pixels,
        distanceMm: r2Mm,
        dSpacingNm: d2,
        reciprocalVectorNmInv: 1 / d2,
        braggAngleMrad: (wavelengthNm / (2 * d2)) * 1000,
        intensity: 0.7,
        structureFactor: 0.8,
      });
    }
  } else if (zoneAxis === "[011]") {
    // Rectangular / centered pattern for [011] zone axis in FCC (Carter Ch. 12)
    // Basic vectors: g1 = (200), g2 = (1-11)
    const d200 = a / 2;
    const d111 = a / Math.sqrt(3);

    const r200 = (cameraConstant / d200) * scalePixelsPerMm;
    const r111 = (cameraConstant / d111) * scalePixelsPerMm;

    // Angle between (200) and (1-11) in FCC is 54.74 degrees
    const theta = (54.74 * Math.PI) / 180;

    for (let u = -3; u <= 3; u++) {
      for (let v = -3; v <= 3; v++) {
        if (u === 0 && v === 0) continue;
        const x = u * r200 + v * r111 * Math.cos(theta);
        const y = v * r111 * Math.sin(theta);
        const distPixels = Math.sqrt(x * x + y * y);
        if (distPixels > 240) continue;

        const distMm = distPixels / scalePixelsPerMm;
        const dAppx = cameraConstant / Math.max(0.01, distMm);

        spots.push({
          hkl: [u * 2, v, v],
          hklStr: `(${u * 2},${v},${v})`,
          x,
          y,
          distanceMm: distMm,
          dSpacingNm: dAppx,
          reciprocalVectorNmInv: 1 / dAppx,
          braggAngleMrad: (wavelengthNm / (2 * dAppx)) * 1000,
          intensity: Math.max(0.15, 1 - distPixels / 260),
          structureFactor: 1.0,
        });
      }
    }
  } else {
    // Standard [001] zone axis (Square 4-fold grid: (200) and (020) reflections)
    const d200 = a / 2; // for FCC/Diamond cubic (200) or (220)
    const stepMm = cameraConstant / d200;
    const stepPixels = stepMm * scalePixelsPerMm;

    for (let h = -3; h <= 3; h++) {
      for (let k = -3; k <= 3; k++) {
        if (h === 0 && k === 0) continue;
        const x = h * stepPixels;
        const y = k * stepPixels;
        const distPixels = Math.sqrt(x * x + y * y);
        if (distPixels > 250) continue;

        const distMm = distPixels / scalePixelsPerMm;
        const dSpacing = cameraConstant / Math.max(0.01, distMm);
        const factor = 1 / (1 + (h * h + k * k) * 0.25);

        spots.push({
          hkl: [h * 2, k * 2, 0],
          hklStr: `(${h * 2},${k * 2},0)`,
          x,
          y,
          distanceMm: distMm,
          dSpacingNm: dSpacing,
          reciprocalVectorNmInv: 1 / dSpacing,
          braggAngleMrad: (wavelengthNm / (2 * dSpacing)) * 1000,
          intensity: factor,
          structureFactor: 1.0,
        });
      }
    }
  }

  return {
    voltageKV,
    cameraLengthMm,
    wavelengthNm,
    cameraConstantMmNm: cameraConstant,
    crystal,
    zoneAxis,
    mode,
    spots,
    rings,
  };
}
