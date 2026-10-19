/**
 * TEM Laboratory Troubleshooting Diagnostic Matrix
 * Grounded in Williams & Carter experimental guidance
 */

export interface TroubleshootingItem {
  id: string;
  symptom: string;
  category: "Contrast & Imaging" | "Diffraction" | "Beam & Stability" | "Specimen & Contamination";
  severity: "High" | "Medium" | "Low";
  possibleCauses: {
    title: string;
    description: string;
  }[];
  tryThis: {
    step: number;
    action: string;
    details: string;
  }[];
  carterReference: string;
  warningNote?: string;
}

export const TROUBLESHOOTING_GUIDE: TroubleshootingItem[] = [
  {
    id: "poor-contrast",
    symptom: "Image has poor contrast or looks completely washed out",
    category: "Contrast & Imaging",
    severity: "Medium",
    possibleCauses: [
      {
        title: "Objective aperture removed or too large",
        description: "Without an objective aperture, all scattered electrons reach the image plane, eliminating amplitude contrast.",
      },
      {
        title: "Specimen is too thick (t > 150 nm)",
        description: "Excessive inelastic scattering produces massive chromatic aberration (Cc * deltaE/E0), causing a diffuse gray fog.",
      },
      {
        title: "Crystal oriented far off Bragg condition",
        description: "If diffraction contrast is expected but the crystal is not tilted into a two-beam condition, contrast drops dramatically.",
      },
      {
        title: "Incorrect defocus (too close to Gaussian in-focus for low-Z)",
        description: "Biological or low-Z nanomaterials have near-zero amplitude contrast; slight underfocus is required for phase contrast.",
      },
    ],
    tryThis: [
      {
        step: 1,
        action: "Insert and center the objective aperture",
        details: "Switch to diffraction mode (DIFF), locate the (000) central transmitted beam, insert the smallest suitable objective aperture, and center it precisely around (000).",
      },
      {
        step: 2,
        action: "Check specimen thickness via low-loss EELS or edge inspection",
        details: "Move the stage to the thin edge of the specimen foil or grid hole where t/lambda is below 0.5.",
      },
      {
        step: 3,
        action: "Tilt into a Two-Beam Condition",
        details: "Use Kikuchi line maps to tilt the specimen until one strong Bragg reflection (g) is excited alongside (000).",
      },
      {
        step: 4,
        action: "Apply intentional underfocus",
        details: "For low-Z or biological samples, apply -500 nm to -1 um of underfocus to generate Fresnel edge contrast.",
      },
    ],
    carterReference: "Williams & Carter, Chapter 22: 'Amplitude Contrast' (Section 22.1)",
  },
  {
    id: "no-diffraction-spots",
    symptom: "Diffraction pattern is blurry, invisible, or shows only diffuse halos",
    category: "Diffraction",
    severity: "High",
    possibleCauses: [
      {
        title: "Material is truly amorphous",
        description: "Amorphous carbon, vitreous ice, or amorphous oxide coatings produce only broad, diffuse rings, not discrete spots.",
      },
      {
        title: "Selected-Area aperture placed over empty vacuum or hole",
        description: "The SA aperture is not intercepting specimen material, or specimen has drifted out of aperture area.",
      },
      {
        title: "Intermediate lens out of focus (diffraction focus not tuned)",
        description: "The intermediate lens is not imaging the back focal plane of the objective lens.",
      },
      {
        title: "Beam is heavily converged onto specimen",
        description: "Convergent illumination creates convergent beam discs (CBED) or broad overlapping discs instead of sharp SAED spots.",
      },
    ],
    tryThis: [
      {
        step: 1,
        action: "Spread the electron beam to parallel illumination",
        details: "Turn the Brightness / Condenser C2 knob clockwise until the beam is completely parallel across the field of view.",
      },
      {
        step: 2,
        action: "Focus the diffraction pattern (Diff Focus)",
        details: "Adjust the 'Diff Focus' control knob until the central transmitted spot (000) is as sharp and small as possible.",
      },
      {
        step: 3,
        action: "Verify aperture location in imaging mode",
        details: "Switch to MAG mode, insert the SA aperture, and ensure it encircles a thin, crystalline crystallite, then switch back to DIFF.",
      },
      {
        step: 4,
        action: "Tilt the goniometer to locate a zone axis",
        details: "Single crystals tilted far away from any zone axis show very few spots; tilt along Kikuchi bands to hit a major zone axis.",
      },
    ],
    carterReference: "Williams & Carter, Chapter 12: 'Selected-Area Diffraction' (Section 12.2)",
  },
  {
    id: "beam-drift",
    symptom: "Electron beam is drifting or unstable across the screen",
    category: "Beam & Stability",
    severity: "High",
    possibleCauses: [
      {
        title: "Specimen charging due to insulating substrate",
        description: "Electrons accumulate on an insulating sample or ungrounded grid, deflecting the primary beam electrostatically.",
      },
      {
        title: "Goniometer stage thermal drift",
        description: "The sample holder was recently inserted, or room temperature/chiller temperature is fluctuating.",
      },
      {
        title: "High voltage or gun emission instability",
        description: "Gun micro-discharges, field-emission flashing required, or high-voltage tank ripple.",
      },
    ],
    tryThis: [
      {
        step: 1,
        action: "Allow 15-20 minutes for thermal equilibrium",
        details: "After inserting a specimen holder or cryo-transfer, wait for stage drift to drop below 0.1 nm/s before high-res imaging.",
      },
      {
        step: 2,
        action: "Carbon coat or use conductive grid",
        details: "If charging is occurring, deposit a thin (2-3 nm) amorphous carbon layer or switch from formvar to a lacey carbon/gold grid.",
      },
      {
        step: 3,
        action: "Check emission current and vacuum levels",
        details: "Ensure column vacuum is in the 10^-5 to 10^-7 Pa range and emission current is stable without sudden spikes.",
      },
    ],
    carterReference: "Williams & Carter, Chapter 9: 'The Instrument' (Section 9.5: Vacuum & Stability)",
    warningNote: "If the beam jumps erratically with high voltage sparks, immediately switch beam off and alert lab staff.",
  },
  {
    id: "contamination-buildup",
    symptom: "Dark hydrocarbon contamination spots rapidly forming under electron beam",
    category: "Specimen & Contamination",
    severity: "Medium",
    possibleCauses: [
      {
        title: "Mobile hydrocarbon molecules on specimen surface",
        description: "Residual solvent, grease, or pump oil molecules migrate into the beam irradiated area and are polymerized into carbon.",
      },
      {
        title: "Cold trap / anti-contaminator not filled with liquid nitrogen",
        description: "The liquid nitrogen dewar surrounding the specimen chamber is dry or warm, failing to cryo-pump residual gases.",
      },
    ],
    tryThis: [
      {
        step: 1,
        action: "Plasma clean the specimen before insertion",
        details: "Subject the mounted TEM grid to 30-60 seconds of gentle Argon/Oxygen plasma cleaning (e.g. Fischione Model 1020).",
      },
      {
        step: 2,
        action: "Verify Liquid Nitrogen (LN2) cold trap",
        details: "Ensure the anti-contamination cold finger dewar is filled with LN2 and cooled down for at least 30 minutes before insertion.",
      },
      {
        step: 3,
        action: "Flood specimen area with wide beam ('Beam Showering')",
        details: "Defocus the beam over a large area (50 um) at high current for 5-10 minutes to immobilize hydrocarbon surface diffusion.",
      },
    ],
    carterReference: "Williams & Carter, Chapter 10: 'Specimen Preparation' (Section 10.8: Contamination)",
  },
  {
    id: "astigmatism-present",
    symptom: "Directional stretching or blurring in image that flips 90° across focus",
    category: "Contrast & Imaging",
    severity: "Medium",
    possibleCauses: [
      {
        title: "Objective lens astigmatism out of balance",
        description: "The objective lens magnetic field is asymmetric due to polepiece machining tolerances or aperture contamination.",
      },
      {
        title: "Dirty objective aperture edge",
        description: "Contamination on the objective aperture becomes electrostatically charged, creating a non-uniform dipole field.",
      },
    ],
    tryThis: [
      {
        step: 1,
        action: "Observe amorphous edge at 150kX - 300kX",
        details: "Move to a hole edge in amorphous carbon. Adjust focus back and forth across minimum contrast.",
      },
      {
        step: 2,
        action: "Tune Objective Stigmators (Stig X & Stig Y)",
        details: "Adjust Obj Stigmator X and Y controls until Fresnel fringes around carbon holes remain isotropic circles with no elongation.",
      },
      {
        step: 3,
        action: "Check or retract objective aperture",
        details: "If astigmatism cannot be corrected, retract the objective aperture. If image sharpens, the aperture is dirty and must be baked or replaced.",
      },
    ],
    carterReference: "Williams & Carter, Chapter 6: 'Lenses, Apertures, and Defects' (Section 6.4: Astigmatism)",
  },
];
