import { AnatomyChapter, ComponentInspection } from "./types";

export const ANATOMY_CHAPTERS: AnatomyChapter[] = [
  {
    id: "electron-gun",
    number: "01",
    componentId: "electron-gun",
    title: "ELECTRON GUN",
    subtitle: "Generating the electron beam",
    functionSummary:
      "The electron gun generates the coherent electron beam used to illuminate the specimen. It accelerates electrons to relativistic kinetic energies using an ultra-high potential gradient between cathode and anode.",
    keyIdea:
      "Electrons are extracted from a source (Field Emission Gun FEG, LaB₆ crystal, or tungsten filament) and accelerated to high energies (80–300 kV) before entering the electromagnetic optical column. At 200 kV, electrons travel at ~70% the speed of light.",
    specs: [
      { label: "ACCELERATION", value: "80 – 300", unit: "kV", highlight: true },
      { label: "BEAM CURRENT", value: "0.1 – 100", unit: "nA" },
      { label: "SOURCE TYPE", value: "Schottky FEG / W" },
      { label: "CROSSOVER (d0)", value: "15 – 30", unit: "nm" },
      { label: "ENERGY SPREAD ΔE", value: "0.3 – 0.7", unit: "eV" },
    ],
    systemStatus: {
      beam: "ACTIVE",
      mode: "BEAM GENERATION",
      subsystem: "HIGH-VOLTAGE TANK (-200 kV)",
      stageInfo: "VACUUM: 10⁻⁸ Pa (FEG Chamber)",
      signalCount: "1 (Primary e⁻)",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 5",
      title: "Electron Sources & Emission Mechanisms",
      topic: "Thermionic vs Field-Emission Guns, Brightness & Coherence",
    },
    contrastMechanism:
      "Source coherence directly limits phase contrast transfer and spatial coherence in HRTEM.",
    pedagogicalTakeaway:
      "The electron beam is born here. Without high acceleration voltage, the de Broglie wavelength would be too large to resolve atomic lattices.",
  },
  {
    id: "condenser-system",
    number: "02",
    componentId: "condenser-system",
    title: "CONDENSER SYSTEM",
    subtitle: "Shaping and collimating the beam",
    functionSummary:
      "Condenser lenses control the illumination of the specimen. They influence beam convergence, illumination area, beam intensity, and coherence on the sample plane.",
    keyIdea:
      "The first condenser lens (C1) demagnifies the electron gun crossover into a tiny virtual source. The second condenser lens (C2) controls the convergence angle and spreads or focuses the beam onto the specimen.",
    specs: [
      { label: "LENS STAGES", value: "C1 (Spot) + C2 (Intensity)", highlight: true },
      { label: "CONVERGENCE (α)", value: "0.1 – 10.0", unit: "mrad" },
      { label: "SPOT DIAMETER", value: "0.2 nm – 10 µm" },
      { label: "APERTURE STRIP", value: "20, 50, 100, 200", unit: "µm" },
      { label: "ILLUMINATION", value: "Parallel ↔ Convergent" },
    ],
    systemStatus: {
      beam: "COLLIMATING",
      mode: "BEAM SHAPING & APERTURE",
      subsystem: "CONDENSER DEFLECTION COILS",
      stageInfo: "PARALLEL TEM ILLUMINATION",
      signalCount: "COLLIMATED FLUX",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 6",
      title: "Lenses, Apertures, and Illuminating Systems",
      topic: "C1/C2 Lens Action, Convergence Semi-Angle, Beam Brightness",
    },
    contrastMechanism:
      "Parallel beam condition is mandatory for sharp, un-broadened Bragg diffraction spot patterns (SAED).",
    pedagogicalTakeaway:
      "By tuning C1/C2, the microscopist decides whether to illuminate a wide field evenly (TEM) or focus down into an atomic probe (STEM).",
  },
  {
    id: "specimen-stage",
    number: "03",
    componentId: "specimen",
    title: "SPECIMEN",
    subtitle: "Where electrons meet matter",
    functionSummary:
      "The specimen stage holds a thin, electron-transparent foil (<100 nm) precisely centered inside the ultra-strong magnetic field of the objective lens pole gap, with eucentric dual-axis tilt.",
    keyIdea:
      "When the high-energy electron beam hits the specimen, it splits. Some electrons pass unscattered (transmitted beam). Some scatter elastically off atomic nuclei (Bragg diffraction). Some scatter inelastically, creating X-rays and energy loss. These signals contain all structural information.",
    specs: [
      { label: "SAMPLE THICKNESS (t)", value: "< 100", unit: "nm", highlight: true },
      { label: "GRID DIAMETER", value: "3.05", unit: "mm standard" },
      { label: "STAGE TILT (α/β)", value: "±45° / ±30°" },
      { label: "SIGNALS PRODUCED", value: "Transmitted, Diffracted, X-rays" },
      { label: "INTERACTION", value: "Elastic + Inelastic" },
    ],
    systemStatus: {
      beam: "INTERACTING",
      mode: "SAMPLE PENETRATION & SCATTERING",
      subsystem: "EUCENTRIC SIDE-ENTRY GONIOMETER",
      stageInfo: "SAMPLE IMMERSED IN POLE GAP",
      signalCount: "MULTIPLE (e⁻, hν, Auger)",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 2 & 11",
      title: "Electrons and Their Interaction with the Specimen",
      topic: "Mean Free Path, Elastic Scattering, Bragg's Law in Crystals",
    },
    contrastMechanism:
      "Differences in thickness, atomic number (Z), and crystal orientation cause differential scattering across the specimen.",
    pedagogicalTakeaway:
      "The specimen does not emit light; it modulates the incoming electron wavefront through phase shifts and elastic Bragg scattering.",
  },
  {
    id: "objective-lens",
    number: "04",
    componentId: "objective-lens",
    title: "OBJECTIVE LENS",
    subtitle: "The critical imaging element",
    functionSummary:
      "The objective lens collects electrons emerging from the exit face of the specimen and forms both the first intermediate image in its image plane and the electron diffraction pattern in its back focal plane.",
    keyIdea:
      "This is the heart of the TEM. The aberrations (Cs and Cc) of the objective lens dictate the spatial resolution limit of the entire microscope. Electrons scattered at identical angles cross at the Back Focal Plane, while electrons from the same point on the specimen converge at the Image Plane.",
    specs: [
      { label: "FOCAL LENGTH (f)", value: "1.5 – 3.0", unit: "mm", highlight: true },
      { label: "SPHERICAL ABERRATION (Cs)", value: "0.5 – 1.2", unit: "mm" },
      { label: "POLE PIECE GAP", value: "2.0 – 5.0", unit: "mm" },
      { label: "INITIAL MAGNIFICATION", value: "20× – 50×" },
      { label: "CONJUGATE PLANES", value: "Back Focal Plane & Image Plane" },
    ],
    systemStatus: {
      beam: "SPLITTING",
      mode: "DIFFRACTION & INITIAL IMAGE FORMATION",
      subsystem: "OBJECTIVE POLE PIECES",
      stageInfo: "SPECIMEN IMMERSED IN 2.0 T FIELD",
      signalCount: "2 FORMED PLANES",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 6 & 13",
      title: "The Objective Lens & The First Intermediate Image",
      topic: "Back Focal Plane (BFP), Abbe Theory of Image Formation, Scherzer Defocus",
    },
    contrastMechanism:
      "Ray focusing: Back Focal Plane = Diffraction Pattern; First Image Plane = Real Space Image.",
    pedagogicalTakeaway:
      "One lens creates TWO distinct representations of your specimen: real-space image and reciprocal-space diffraction pattern.",
  },
  {
    id: "objective-aperture",
    number: "05",
    componentId: "objective-aperture",
    title: "OBJECTIVE APERTURE",
    subtitle: "Selecting electrons & defining contrast",
    functionSummary:
      "Positioned directly in the Back Focal Plane (BFP) of the objective lens, this micro-aperture physically intercepts and blocks unwanted electron trajectories to generate strong image contrast.",
    keyIdea:
      "Without an aperture, transmitted and diffracted electrons recombine, producing low contrast. By inserting a 20–50 µm aperture centered on the optical axis, diffracted electrons are blocked, creating Bright-Field (BF) contrast. Shifting the aperture to select a diffracted spot produces Dark-Field (DF) contrast.",
    specs: [
      { label: "APERTURE POSITION", value: "Back Focal Plane (BFP)", highlight: true },
      { label: "APERTURE DIAMETERS", value: "10, 20, 50, 100", unit: "µm" },
      { label: "MODES ENABLED", value: "Bright-Field (BF) & Dark-Field (DF)" },
      { label: "CONTRAST EFFECT", value: "Diffraction + Mass-Thickness" },
      { label: "BLOCKED RAYS", value: "Bragg Diffracted (>2θB)" },
    ],
    systemStatus: {
      beam: "FILTERED",
      mode: "APERTURE FILTERING (BRIGHT-FIELD)",
      subsystem: "OBJECTIVE APERTURE DRIVE",
      stageInfo: "APERTURE INSERTED IN BFP",
      signalCount: "DIRECT BEAM SELECTED",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 22",
      title: "Amplitude Contrast: Bright-Field and Dark-Field Imaging",
      topic: "Aperture Contrast, Mass-Thickness, Two-Beam Diffraction Condition",
    },
    contrastMechanism:
      "Crystalline areas tilted into Bragg reflection scatter electrons outside the aperture, appearing dark in BF images.",
    pedagogicalTakeaway:
      "TEM contrast is primarily subtractive: you create image contrast by throwing away electrons that underwent diffraction.",
  },
  {
    id: "intermediate-lens",
    number: "06",
    componentId: "magnification-system",
    title: "MAGNIFICATION SYSTEM",
    subtitle: "Intermediate and projector lens chain",
    functionSummary:
      "A multi-stage electron-optical magnifying system that magnifies either the first intermediate image (Imaging Mode) or the objective back focal plane (Diffraction Mode) onto the detector plane.",
    keyIdea:
      "The intermediate lens controls whether the TEM displays an image or a diffraction pattern. By varying intermediate and projector lens currents, magnification cascades exponentially: Specimen → Small image (50×) → Intermediate image (1,000×) → Projected image (100,000×+).",
    specs: [
      { label: "MAGNIFICATION RANGE", value: "50× – 1,500,000×", highlight: true },
      { label: "LENS STAGES", value: "Diffraction + Int. 1 + Int. 2 + Projector" },
      { label: "CAMERA LENGTH (L)", value: "100 – 2500", unit: "mm" },
      { label: "MODE SWITCH", value: "Imaging ↔ SAED Diffraction" },
      { label: "DISTORTION CONTROL", value: "Rotation-free lens couples" },
    ],
    systemStatus: {
      beam: "MAGNIFIED",
      mode: "CASCADE MAGNIFICATION",
      subsystem: "INTERMEDIATE & PROJECTOR LENSES",
      stageInfo: "MAG: 250,000× | ROTATION: CORRECTED",
      signalCount: "EXPANDED ELECTRON FLUX",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 9",
      title: "The Intermediate and Projector Lens System",
      topic: "Conjugate Planes, Camera Length Calibration, Magnification Calibration",
    },
    contrastMechanism:
      "Adjusting intermediate lens focus flips conjugate plane from specimen real space to reciprocal space.",
    pedagogicalTakeaway:
      "Pushing the 'DIFF' button on a TEM console doesn't move physical parts; it simply changes the focal length of the intermediate lens.",
  },
  {
    id: "detector",
    number: "07",
    componentId: "detector",
    title: "DETECTOR SYSTEM",
    subtitle: "Turning electrons into scientific information",
    functionSummary:
      "The detector system converts the arriving high-energy electron flux into photons or digital charge readouts to capture real-space micrographs and reciprocal-space diffraction patterns.",
    keyIdea:
      "Traditional TEM uses a retractable ZnS:Ag phosphor screen viewed through lead glass for manual alignment. Modern systems use direct electron detectors (DED) CMOS sensors that count individual electrons with near-unity Detective Quantum Efficiency (DQE), eliminating scintillator noise.",
    specs: [
      { label: "PHOSPHOR SCREEN", value: "ZnS:Ag (P22 green emission)", highlight: true },
      { label: "DIGITAL SENSOR", value: "Direct Electron CMOS (4k × 4k)" },
      { label: "DQE (0 freq)", value: "> 0.90 (Direct Detection)" },
      { label: "PIXEL RESOLUTION", value: "4096 × 4096", unit: "16 MP" },
      { label: "STEM DETECTORS", value: "BF, ADF, HAADF Annular Segments" },
    ],
    systemStatus: {
      beam: "DETECTED",
      mode: "DIRECT ELECTRON SENSING",
      subsystem: "BOTTOM-MOUNTED HIGH-SPEED CMOS",
      stageInfo: "EXPOSURE: 0.1 s | 4096×4096",
      signalCount: "FINAL IMAGE RECORDED",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 8",
      title: "Recording Media and Detectors",
      topic: "Photographic Film, Phosphor Screens, CCD, and Direct Electron Detectors",
    },
    contrastMechanism:
      "Electron arrival density translates directly into image pixel grayscale values (0 to 65,535 in 16-bit).",
    pedagogicalTakeaway:
      "The detector is the final link in the chain. Everything upstream determines the spatial and phase fidelity captured on this sensor.",
    buttonAction: {
      label: "EXPLORE DIFFRACTION SIMULATOR →",
      href: "/simulator",
    },
  },
  {
    id: "exploded-view",
    number: "08",
    componentId: "exploded-view",
    title: "COMPLETE EXPLODED VIEW",
    subtitle: "The entire electron-optical chain in separation",
    functionSummary:
      "Every major lens, aperture, stage, and sensor separated along the optical axis, illustrating how each element aligns in a single continuous vacuum column.",
    keyIdea:
      "A TEM is not a single lens magnifying an object. It is a precision chain of electromagnetic electron optics, where each stage performs a specific role: source generation, probe conditioning, specimen interaction, initial image/diffraction formation, aperture filtering, magnification cascade, and digital detection.",
    specs: [
      { label: "TOTAL COLUMN HEIGHT", value: "2.2 – 2.8", unit: "meters", highlight: true },
      { label: "VACUUM GRADIENT", value: "10⁻⁸ Pa (Gun) → 10⁻⁵ Pa (Chamber)" },
      { label: "OPTICAL ALIGNMENT", value: "Sub-micrometer column concentricity" },
      { label: "TOTAL LENSES", value: "6 to 8 electromagnetic stages" },
      { label: "SHIELDING", value: "Mu-metal magnetic shielding" },
    ],
    systemStatus: {
      beam: "ACTIVE",
      mode: "EXPLODED OPTICAL BLUEPRINT",
      subsystem: "ENTIRE TEM COLUMN DISSECTED",
      stageInfo: "ALL 7 SUBSYSTEMS ISOLATED",
      signalCount: "CONTINUOUS ELECTRON PATHWAY",
    },
    carterRef: {
      chapter: "Carter & Williams: Chapter 1",
      title: "The Transmission Electron Microscope Architecture",
      topic: "Column Layout, Optical Axis, Alignment Principles",
    },
    pedagogicalTakeaway:
      "Mastering TEM requires understanding that an artifact at the detector could originate from any point in this 2.5-meter chain of electron optics.",
  },
];

export const COMPONENT_INSPECTIONS: Record<string, ComponentInspection> = {
  "electron-gun": {
    id: "electron-gun",
    name: "Field Emission Gun (FEG) & High-Voltage Accelerator",
    groupName: "Illumination Source",
    functionDesc:
      "Emits electrons by tunneling through a lowered potential barrier under intense electrostatic field (>10⁷ V/cm). Accelerates them via high tension stack.",
    opticsRole: "Defines initial source brightness, coherence, and energy spread ΔE.",
    carterRef: "Carter & Williams, Chapter 5: 'Electron Sources'",
    typicalParams: [
      "Accelerating voltage: 80–300 kV",
      "Brightness β: 10⁸ A/(m²·sr·V)",
      "Tip radius: ~100 nm (ZrO/W Schottky)",
      "Operating vacuum: < 10⁻⁸ Pa",
    ],
  },
  "anode": {
    id: "anode",
    name: "Ground Potential Anode Plate",
    groupName: "Acceleration Stage",
    functionDesc:
      "Maintains 0V relative to cathode (-200 kV). The electrostatic potential difference accelerates electrons down the bore.",
    opticsRole: "Finalizes electron kinetic energy and de Broglie wavelength λ = h/p.",
    carterRef: "Carter & Williams, Chapter 5: 'High Voltage Gun Stack'",
    typicalParams: [
      "Potential: 0 V (ground)",
      "Bore diameter: 2–4 mm",
      "Electron kinetic energy: 200 keV",
      "Relativistic speed: 0.695 c",
    ],
  },
  "condenser-system": {
    id: "condenser-system",
    name: "Dual Condenser Lens System (C1 / C2) & Aperture",
    groupName: "Illumination Optics",
    functionDesc:
      "C1 demagnifies the crossover. C2 varies convergence angle α to switch between parallel TEM and convergent STEM probe.",
    opticsRole: "Controls beam current, convergence semi-angle, and illuminated spot size.",
    carterRef: "Carter & Williams, Chapter 6: 'Lenses and Apertures'",
    typicalParams: [
      "C1 Demagnification: 10× to 100×",
      "Convergence angle α: 0.1 to 10 mrad",
      "C2 aperture sizes: 20, 50, 100, 200 µm",
      "Coil current: 1 to 5 Amperes",
    ],
  },
  "specimen": {
    id: "specimen",
    name: "Specimen Stage & Thin Foil Matter",
    groupName: "Sample Interaction Plane",
    functionDesc:
      "Holds electron-transparent specimen (<100 nm) on 3 mm copper/gold grid inside high-field pole gap with dual tilt.",
    opticsRole: "Modulates incoming wavefront through elastic Bragg diffraction and inelastic energy loss.",
    carterRef: "Carter & Williams, Chapter 2 & 11: 'Specimen Interaction'",
    typicalParams: [
      "Thickness: 10–50 nm optimal for HRTEM",
      "Grid diameter: 3.05 mm",
      "Eucentric tilt: ±45° α-axis, ±30° β-axis",
      "Thermal drift: < 0.1 nm/min",
    ],
  },
  "objective-lens": {
    id: "objective-lens",
    name: "Objective Lens Pole Piece Assembly",
    groupName: "Primary Imaging Element",
    functionDesc:
      "Creates a powerful symmetric magnetic field (up to 2 Tesla) in a narrow gap (2–5 mm) where specimen is immersed.",
    opticsRole: "Forms first intermediate real image and creates the Back Focal Plane (Diffraction Pattern).",
    carterRef: "Carter & Williams, Chapter 6: 'The Objective Lens'",
    typicalParams: [
      "Focal length f: 1.5–2.5 mm",
      "Spherical aberration Cs: 0.5–1.0 mm",
      "Chromatic aberration Cc: 1.0–1.5 mm",
      "Gap width: 2.0–5.0 mm",
    ],
  },
  "objective-aperture": {
    id: "objective-aperture",
    name: "Objective Aperture Mechanism",
    groupName: "Contrast Filter",
    functionDesc:
      "Precision platinum/molybdenum strip with laser-drilled micro-holes inserted in the Objective Back Focal Plane.",
    opticsRole: "Selects transmitted beam (Bright Field) or specific diffracted beam (Dark Field) to generate contrast.",
    carterRef: "Carter & Williams, Chapter 22: 'Amplitude Contrast'",
    typicalParams: [
      "Aperture sizes: 10, 20, 50, 100 µm",
      "Drive precision: Sub-micrometer piezoelectric/micrometer",
      "Material: High-purity Platinum or Molybdenum",
      "Cleaning cycle: High-vacuum self-heating / replacement",
    ],
  },
  "magnification-system": {
    id: "magnification-system",
    name: "Intermediate & Projector Lens Cascade",
    groupName: "Magnification & Mode Switching",
    functionDesc:
      "Cascades magnification up to 1,500,000×. Intermediate lens switches conjugate plane between Image Plane and Back Focal Plane.",
    opticsRole: "Scales images and switches instrument between Imaging Mode and SAED Diffraction Mode.",
    carterRef: "Carter & Williams, Chapter 9: 'Projector Systems'",
    typicalParams: [
      "Magnification: 50× to 1,500,000×",
      "Camera length L: 100 mm to 2500 mm",
      "Image rotation: Compensated via counter-wound coils",
      "Field of view: 10 µm down to 2 nm",
    ],
  },
  "detector": {
    id: "detector",
    name: "Direct Electron CMOS Camera & Phosphor Screen",
    groupName: "Detection & Recording",
    functionDesc:
      "Captures electron arrival. Retractable ZnS:Ag phosphor screen for manual eye viewing; direct CMOS sensor for digital acquisition.",
    opticsRole: "Converts electron spatial distribution into 16-bit digital intensity data with high DQE.",
    carterRef: "Carter & Williams, Chapter 8: 'Detectors'",
    typicalParams: [
      "Sensor: Direct Electron CMOS (4096 × 4096)",
      "Pixel size: 14 µm × 14 µm",
      "Frame rate: 40 to 400 fps",
      "DQE at Nyquist: > 0.50",
    ],
  },
};
