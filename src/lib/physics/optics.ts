/**
 * Electron Optics and Contrast Mechanisms for TEM
 * Grounded in C. Barry Carter & David B. Williams: "Transmission Electron Microscopy"
 * Part 3: Imaging (Amplitude Contrast, Phase Contrast, Thickness & Bending Effects)
 */

export type ImagingMode = "bright-field" | "dark-field" | "high-resolution";

export interface ContrastModeInfo {
  id: ImagingMode;
  name: string;
  aperturePosition: "centered-on-optic-axis" | "displaced-to-diffracted-beam" | "open-wide";
  beamSelected: "transmitted (unscattered)" | "diffracted (Bragg scattered)" | "transmitted + multiple diffracted";
  contrastType: "Mass-Thickness & Diffraction Contrast" | "Diffraction Contrast (Inverted)" | "Phase Contrast (Interference)";
  description: string;
  scientificExplanation: string;
  carterReference: string;
  typicalUseCases: string[];
}

export const IMAGING_MODES: Record<ImagingMode, ContrastModeInfo> = {
  "bright-field": {
    id: "bright-field",
    name: "Bright-Field (BF) TEM",
    aperturePosition: "centered-on-optic-axis",
    beamSelected: "transmitted (unscattered)",
    contrastType: "Mass-Thickness & Diffraction Contrast",
    description:
      "The objective aperture is placed in the back focal plane to intercept all diffracted beams and allow only the direct (unscattered) transmitted beam to pass.",
    scientificExplanation:
      "Areas of the specimen that are thicker, denser, or strongly Bragg-oriented scatter electrons away from the optical axis. Because the aperture blocks these scattered electrons, those regions appear DARK on a bright background. Hence the name 'Bright-Field'.",
    carterReference: "Barry Carter, Chapter 22: 'Amplitude Contrast' & Chapter 23: 'Diffraction Contrast'",
    typicalUseCases: [
      "Morphology and particle dispersion",
      "Biological & polymer ultrastructure (with heavy metal stains)",
      "Dislocation line imaging and grain boundary observation",
      "Thickness fringe analysis",
    ],
  },
  "dark-field": {
    id: "dark-field",
    name: "Dark-Field (DF) TEM",
    aperturePosition: "displaced-to-diffracted-beam",
    beamSelected: "diffracted (Bragg scattered)",
    contrastType: "Diffraction Contrast (Inverted)",
    description:
      "The objective aperture selects a specific diffracted Bragg beam g (or the beam is tilted so g travels down the optical axis in Centered Dark-Field).",
    scientificExplanation:
      "Only crystallites or defects fulfilling the exact Bragg condition 2*d*sin(theta) = lambda diffract into the selected aperture aperture. Consequently, diffracting grains or strain fields glow intensely BRIGHT against a completely black background. The contrast is inverted compared to BF.",
    carterReference: "Barry Carter, Chapter 22: 'Amplitude Contrast' (Section 22.3: Dark-Field Imaging)",
    typicalUseCases: [
      "Identifying specific crystallographic phases in multiphase alloys",
      "Determining Burgers vector b of dislocations (g . b invisibility criterion)",
      "Visualizing nanoscale precipitates and twins",
      "Measuring grain size distributions in polycrystalline thin films",
    ],
  },
  "high-resolution": {
    id: "high-resolution",
    name: "High-Resolution TEM (HRTEM)",
    aperturePosition: "open-wide",
    beamSelected: "transmitted + multiple diffracted",
    contrastType: "Phase Contrast (Interference)",
    description:
      "A large objective aperture (or no aperture) allows the transmitted beam and several diffracted beams to pass through simultaneously.",
    scientificExplanation:
      "The beams interfere coherently in the image plane, transferring atomic-scale phase shifts into intensity variations. This creates atomic columns and lattice fringe patterns modulated by the Contrast Transfer Function (CTF) at Scherzer defocus.",
    carterReference: "Barry Carter, Chapter 28: 'Phase Contrast' & Chapter 29: 'High-Resolution TEM'",
    typicalUseCases: [
      "Lattice fringe spacing measurement for unknown phase ID",
      "Atomic-scale interface matching and epitaxial strain",
      "Stacking faults and anti-phase boundaries at unit cell resolution",
      "Core structure of dislocations and grain boundaries",
    ],
  },
};
