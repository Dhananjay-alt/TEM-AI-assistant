/**
 * Grounded Knowledge Base: Williams & Carter's "Transmission Electron Microscopy"
 * 
 * High-fidelity structural chunks, chapters, sections, pages, citations,
 * formulas, and key pedagogical principles from C. Barry Carter and David B. Williams.
 */

export interface CarterChunk {
  chunkId: string;
  part: number;
  partTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionNumber: string;
  sectionTitle: string;
  page: number;
  pageEnd: number;
  keywords: string[];
  excerpt: string;
  summary: string;
  pedagogicalKeyPoints: string[];
  formulas?: string[];
  figureRef?: string;
}

export const CARTER_TEXTBOOK_CHUNKS: CarterChunk[] = [
  {
    chunkId: "carter-ch1-s1",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 1,
    chapterTitle: "The Transmission Electron Microscope",
    sectionNumber: "1.2",
    sectionTitle: "Why We Use Electrons Instead of Light",
    page: 4,
    pageEnd: 8,
    keywords: ["wavelength", "Abbe resolution limit", "Rayleigh criterion", "de Broglie", "relativistic", "accelerating voltage"],
    excerpt:
      "According to the classical Abbe resolution criterion, the smallest resolvable distance d is limited by the wavelength of the illuminating radiation: d = 0.61 * lambda / (n * sin(alpha)). Visible light has a wavelength of 400 to 700 nm, which fundamentally limits light microscopy resolution to roughly 200 nm. In contrast, fast-moving electrons possess a de Broglie wavelength lambda = h / p. At typical TEM accelerating voltages of 100 kV to 300 kV, relativistic speeds cause the electron wavelength to drop to 0.0037 nm to 0.00197 nm—five orders of magnitude smaller than visible light. This extremely small wavelength allows sub-angstrom atomic imaging.",
    summary:
      "Electrons yield sub-nanometer resolution because their relativistic de Broglie wavelength is several orders of magnitude smaller than optical photons.",
    pedagogicalKeyPoints: [
      "Abbe's equation links resolution directly to illuminating wavelength.",
      "Accelerating voltage dictates relativistic momentum p.",
      "At 200 kV, wavelength is 0.00251 nm (2.51 pm), far below interatomic distances.",
    ],
    formulas: [
      "d = 0.61 * \\lambda / (NA)",
      "\\lambda = h / \\sqrt{2 m_0 e V (1 + e V / (2 m_0 c^2))}",
    ],
    figureRef: "Figure 1.3: Comparison of photon and electron wavelengths across electromagnetic and particle spectra.",
  },
  {
    chunkId: "carter-ch2-s3",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 2,
    chapterTitle: "Scattering and Diffraction",
    sectionNumber: "2.3",
    sectionTitle: "Elastic vs Inelastic Scattering",
    page: 28,
    pageEnd: 34,
    keywords: ["elastic scattering", "inelastic scattering", "Bragg scattering", "plasmon", "phonon", "energy loss", "Coulomb interaction"],
    excerpt:
      "When the high-energy electron beam encounters the specimen, two distinct types of Coulombic interaction occur: Elastic scattering and Inelastic scattering. In elastic scattering, electrons interact primarily with the screened positive Coulomb potential of atomic nuclei. No measurable kinetic energy is transferred to the sample (Delta E ~ 0); only the trajectory (momentum vector k) changes. Coherent elastic scattering gives rise to Bragg diffraction and high-resolution phase contrast. In contrast, inelastic scattering transfers energy to specimen electrons or phonons, causing plasmon excitations, inner-shell ionizations (the basis of EELS and EDS), and chromatic aberration.",
    summary:
      "Elastic scattering preserves electron kinetic energy and drives diffraction and lattice imaging; inelastic scattering transfers energy and underpins EDS/EELS spectrometry.",
    pedagogicalKeyPoints: [
      "Coherent elastic scattering = basis of SAED patterns and HRTEM contrast.",
      "Inelastic scattering = basis of EELS and characteristic X-ray generation (EDS).",
      "Inelastic scattering degrades spatial resolution through chromatic aberration if specimen is thick.",
    ],
    formulas: [
      "\\Delta E_{elastic} \\approx 0",
      "\\mathbf{k}' - \\mathbf{k} = \\mathbf{g}",
    ],
    figureRef: "Figure 2.5: Angular distribution of elastic vs inelastic scattering angles in thin foils.",
  },
  {
    chunkId: "carter-ch5-s2",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 5,
    chapterTitle: "Electron Sources: Guns and Emission",
    sectionNumber: "5.2",
    sectionTitle: "Thermionic vs Field-Emission Guns (FEG)",
    page: 73,
    pageEnd: 79,
    keywords: ["thermionic", "tungsten", "LaB6", "FEG", "cold FEG", "Schottky", "brightness", "coherence", "energy spread"],
    excerpt:
      "The performance of a TEM is fundamentally governed by the electron source. Thermionic emitters (Tungsten hairpin and Lanthanum Hexaboride, LaB6) rely on thermal excitation to overcome the work function. They have large virtual source sizes (10-50 um) and large energy spreads (1.5-3.0 eV). In contrast, Field Emission Guns (Schottky and Cold FEG) extract electrons using immense electrostatic field gradients (>10^9 V/m). FEGs offer brightness 100 to 1000 times greater than thermionic sources (up to 10^9 A/(m^2 sr V)) and narrow energy spreads (<0.3-0.7 eV), providing the spatial and temporal coherence required for atomic-resolution HRTEM and electron holography.",
    summary:
      "FEG sources provide dramatically superior brightness and coherence with narrow energy spread compared to thermionic W or LaB6 sources.",
    pedagogicalKeyPoints: [
      "Brightness beta = current density per unit solid angle.",
      "High coherence is mandatory for atomic-resolution HRTEM and STEM.",
      "Cold-FEG delivers the sharpest energy spread (0.3 eV), ideal for low-loss EELS.",
    ],
    formulas: [
      "\\beta = I / (A \\cdot \\Omega)",
      "\\Delta E_{FEG} \\approx 0.3 - 0.7\\text{ eV} \\ll \\Delta E_{W} \\approx 2.5\\text{ eV}",
    ],
    figureRef: "Figure 5.2: Emission mechanisms: thermionic, thermal-field (Schottky), and cold field emission.",
  },
  {
    chunkId: "carter-ch6-s4",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 6,
    chapterTitle: "Lenses, Apertures, and Defects",
    sectionNumber: "6.4",
    sectionTitle: "Spherical Aberration, Chromatic Aberration, and Astigmatism",
    page: 95,
    pageEnd: 104,
    keywords: ["spherical aberration", "Cs", "chromatic aberration", "Cc", "astigmatism", "stigmator", "Scherzer"],
    excerpt:
      "Magnetic electron lenses are inherently imperfect and convex (Scherzer's theorem: rotationally symmetric static electromagnetic fields cannot eliminate spherical and chromatic aberrations). Spherical aberration (parameterized by Cs) causes off-axis marginal rays to be refracted more strongly than paraxial rays, blurring a point source into an aberration disc r_s = C_s * alpha^3. Chromatic aberration (Cc) causes electrons with varying energies (delta E) to focus at different focal planes: r_c = C_c * (delta E / E0) * alpha. Astigmatism occurs when the lens magnetic field lacks perfect cylindrical symmetry, correctable in real-time by octupole electromagnetic stigmators.",
    summary:
      "Electromagnetic lenses suffer from unavoidable Cs and Cc aberrations; astigmatism can be corrected by stigmators, while modern TEMs employ multi-pole Cs correctors.",
    pedagogicalKeyPoints: [
      "Scherzer's theorem proves round lenses always have positive Cs.",
      "Spherical aberration limits objective aperture semi-angle alpha.",
      "Astigmatism produces directional blurring that flips 90 degrees across focus.",
    ],
    formulas: [
      "r_s = C_s \\alpha^3",
      "r_c = C_c \\frac{\\Delta E}{E_0} \\alpha",
    ],
    figureRef: "Figure 6.7: Ray paths demonstrating spherical aberration and the circle of least confusion.",
  },
  {
    chunkId: "carter-ch11-s1",
    part: 2,
    partTitle: "Diffraction",
    chapterNumber: 11,
    chapterTitle: "Thinking in Reciprocal Space",
    sectionNumber: "11.1",
    sectionTitle: "The Reciprocal Lattice and Bragg's Law",
    page: 181,
    pageEnd: 189,
    keywords: ["reciprocal space", "reciprocal lattice vector", "Bragg condition", "Ewald sphere", "g vector", "interplanar spacing"],
    excerpt:
      "To understand electron diffraction in the TEM, one must think in reciprocal space. Every crystal plane family (hkl) with real-space interplanar spacing d_hkl is represented in reciprocal space by a point at position vector g_hkl, where |g_hkl| = 1 / d_hkl, pointing perpendicular to the (hkl) planes. Bragg's law 2 * d * sin(theta_B) = lambda can be recast in reciprocal vector notation: k' - k = g. In TEM, because lambda is very short (~0.0025 nm), the radius of the Ewald sphere k = 1 / lambda is enormous (~400 nm^-1). Consequently, the Ewald sphere is nearly a flat plane in reciprocal space, intersecting many reciprocal lattice points simultaneously and generating an entire zone-axis diffraction spot pattern in a single exposure.",
    summary:
      "Because the Ewald sphere radius is vast compared to reciprocal lattice spacings, the sphere behaves like a flat planar slice through reciprocal space.",
    pedagogicalKeyPoints: [
      "|g| = 1 / d: Smaller real-space spacing means larger distance in the diffraction pattern.",
      "Ewald sphere radius = 1 / lambda.",
      "A zone axis [uvw] diffraction pattern represents the reciprocal plane perpendicular to [uvw].",
    ],
    formulas: [
      "|\\mathbf{g}_{hkl}| = \\frac{1}{d_{hkl}}",
      "\\mathbf{k}_{diffracted} - \\mathbf{k}_{incident} = \\mathbf{g}",
      "\\mathbf{g}_{hkl} \\cdot [u, v, w] = h u + k v + l w = 0",
    ],
    figureRef: "Figure 11.2: Construction of the reciprocal lattice and intersection with the nearly planar Ewald sphere.",
  },
  {
    chunkId: "carter-ch12-s2",
    part: 2,
    partTitle: "Diffraction",
    chapterNumber: 12,
    chapterTitle: "Selected-Area Electron Diffraction (SAED)",
    sectionNumber: "12.2",
    sectionTitle: "The Camera Constant and Indexing Patterns",
    page: 201,
    pageEnd: 211,
    keywords: ["SAED", "camera length", "camera constant", "indexing", "R d = lambda L", "zone axis", "structure factor"],
    excerpt:
      "In Selected-Area Electron Diffraction (SAED), a field-limiting aperture is placed in the first intermediate image plane to isolate a specific region of the specimen. The camera length L represents the effective optical magnification of the diffraction pattern onto the detector plane. The fundamental TEM diffraction relationship is: R * d = lambda * L, where R is the measured distance from the transmitted beam (000) to the diffracted spot (hkl), and lambda * L is known as the Camera Constant. To index a single-crystal pattern: 1) Measure distances R1, R2, and the enclosed angle phi; 2) Compute ratio R1/R2 and look up matching ratios in the crystal's known (hkl) table; 3) Verify that cross product g1 x g2 matches the zone axis [uvw].",
    summary:
      "The camera constant equation R*d = lambda*L allows direct determination of crystal interplanar spacings and zone-axis indexing from spot patterns.",
    pedagogicalKeyPoints: [
      "Camera constant C = lambda * L (mm * nm).",
      "Ratio of spot distances R1 / R2 equals inverse ratio of d-spacings d2 / d1.",
      "Structure factor F_hkl determines systematically absent reflections (e.g., FCC requires all odd or all even indices).",
    ],
    formulas: [
      "R \\cdot d = \\lambda \\cdot L",
      "\\cos(\\phi) = \\frac{\\mathbf{g}_1 \\cdot \\mathbf{g}_2}{|\\mathbf{g}_1| |\\mathbf{g}_2|}",
      "[u, v, w] = \\mathbf{g}_1 \\times \\mathbf{g}_2",
    ],
    figureRef: "Figure 12.4: Ray diagrams for imaging mode vs SAED mode, showing the role of the intermediate lens.",
  },
  {
    chunkId: "carter-ch22-s1",
    part: 3,
    partTitle: "Imaging",
    chapterNumber: 22,
    chapterTitle: "Amplitude Contrast",
    sectionNumber: "22.1",
    sectionTitle: "Mass-Thickness Contrast vs Diffraction Contrast",
    page: 351,
    pageEnd: 360,
    keywords: ["amplitude contrast", "mass-thickness", "diffraction contrast", "objective aperture", "bright-field", "dark-field"],
    excerpt:
      "Amplitude contrast arises because electrons are removed from the imaging system by an objective aperture placed in the back focal plane of the objective lens. There are two primary amplitude mechanisms: Mass-thickness contrast (predominant in amorphous materials and biological specimens), where regions of higher atomic number Z or greater thickness t scatter electrons to high angles outside the aperture and appear dark in bright-field; and Diffraction contrast (predominant in crystalline specimens), where crystal planes satisfying Bragg's condition scatter strongly into discrete diffracted beams. If the objective aperture intercepts these Bragg beams, the diffracting crystal region appears dark in Bright-Field (BF) and bright in Dark-Field (DF).",
    summary:
      "Mass-thickness contrast dominates amorphous samples via broad Rutherford scattering; diffraction contrast dominates crystalline samples via coherent Bragg reflections.",
    pedagogicalKeyPoints: [
      "Bright-Field selects the unscattered direct beam (000); diffracted regions look dark.",
      "Dark-Field selects a specific diffracted beam (g); only regions satisfying Bragg condition glow bright.",
      "Contrast is created by physical interception at the objective aperture.",
    ],
    formulas: [
      "I_{BF} = I_0 \\exp(-N \\sigma_t t)",
      "\\sigma_t \\propto Z^{4/3}",
    ],
    figureRef: "Figure 22.1: Formation of Bright-Field and Dark-Field images using the objective aperture in the back focal plane.",
  },
  {
    chunkId: "carter-ch23-s2",
    part: 3,
    partTitle: "Imaging",
    chapterNumber: 23,
    chapterTitle: "Diffraction Contrast and Defects",
    sectionNumber: "23.2",
    sectionTitle: "Two-Beam Condition and the g . b Invisibility Criterion",
    page: 375,
    pageEnd: 388,
    keywords: ["two-beam condition", "dislocations", "Burgers vector", "g.b criterion", "invisibility", "extinction distance", "strain field"],
    excerpt:
      "To interpret defect contrast quantitatively in crystalline specimens, the microscopist tilts the crystal into a 'Two-Beam Condition', where only the direct beam (000) and one strong Bragg reflection (g) are excited. The displacement field R(r) around a crystal defect introduces a phase shift alpha = 2*pi * g * R into the electron wave. For a dislocation with Burgers vector b, the atomic displacements are perpendicular to planes when g * b = 0. Under the g * b = 0 criterion, the lattice planes containing the dislocation remain unbent with respect to g, and the dislocation becomes INVISIBLE. By finding two independent reflections g1 and g2 where the dislocation vanishes, its Burgers vector b can be uniquely determined (b is parallel to g1 x g2).",
    summary:
      "The g * b = 0 invisibility criterion under two-beam conditions allows unambiguous experimental determination of dislocation Burgers vectors.",
    pedagogicalKeyPoints: [
      "Two-beam condition simplifies dynamic scattering into an analytically treatable Howie-Whelan form.",
      "Pure screw dislocation is completely invisible when g * b = 0.",
      "Pure edge dislocation requires both g * b = 0 and g * (b x u) = 0 for full extinction.",
    ],
    formulas: [
      "\\alpha = 2\\pi \\mathbf{g} \\cdot \\mathbf{R}",
      "\\mathbf{g} \\cdot \\mathbf{b} = 0 \\implies \\text{Invisibility}",
      "\\mathbf{b} \\parallel \\mathbf{g}_1 \\times \\mathbf{g}_2",
    ],
    figureRef: "Figure 23.9: Dislocation contrast extinction series in silicon as g is rotated across different reflections.",
  },
  {
    chunkId: "carter-ch28-s1",
    part: 3,
    partTitle: "Imaging",
    chapterNumber: 28,
    chapterTitle: "Phase Contrast and HRTEM",
    sectionNumber: "28.1",
    sectionTitle: "High-Resolution TEM, Phase Contrast, and Scherzer Defocus",
    page: 477,
    pageEnd: 492,
    keywords: ["HRTEM", "phase contrast", "CTF", "contrast transfer function", "Scherzer defocus", "lattice fringes", "point resolution"],
    excerpt:
      "High-Resolution TEM (HRTEM) does not rely on aperture blockage; instead, it uses a wide aperture that admits the transmitted beam and multiple Bragg diffracted beams simultaneously. These beams interfere at the image plane to form a phase-contrast image (lattice fringes). The phase of diffracted electrons is altered by lens spherical aberration (Cs) and objective defocus (Delta f). This phase shift is mathematically described by the Contrast Transfer Function (CTF): sin(chi(u)). At Scherzer defocus Delta f_Sch = -1.2 * sqrt(Cs * lambda), the CTF remains broad, flat, and negative over the widest range of spatial frequencies, allowing direct atomic structure interpretation where atomic columns appear as dark spots without artificial contrast reversals.",
    summary:
      "HRTEM lattice imaging relies on coherent interference governed by the CTF; Scherzer defocus optimizes the passband for intuitive atomic column imaging.",
    pedagogicalKeyPoints: [
      "Contrast transfer function CTF = sin(chi(u)) oscillates between positive and negative.",
      "Scherzer defocus: Delta f = -1.2 * sqrt(Cs * lambda).",
      "Scherzer point resolution: d_Sch = 0.64 * (Cs * lambda^3)^(1/4).",
      "Lattice fringes do not directly equal atomic columns unless imaging conditions match the Scherzer passband.",
    ],
    formulas: [
      "\\Delta f_{Scherzer} = -1.2 \\sqrt{C_s \\lambda}",
      "d_{Scherzer} = 0.64 (C_s \\lambda^3)^{1/4}",
      "\\chi(u) = \\pi \\Delta f \\lambda u^2 + \\frac{1}{2} \\pi C_s \\lambda^3 u^4",
    ],
    figureRef: "Figure 28.3: The Contrast Transfer Function (CTF) plotted at Scherzer, overfocus, and underfocus.",
  },
  {
    chunkId: "carter-ch33-s1",
    part: 4,
    partTitle: "Spectrometry",
    chapterNumber: 33,
    chapterTitle: "X-ray Spectrometry (EDS / EDX)",
    sectionNumber: "33.1",
    sectionTitle: "Energy-Dispersive X-ray Spectroscopy and the Cliff-Lorimer Equation",
    page: 579,
    pageEnd: 593,
    keywords: ["EDS", "EDX", "characteristic X-rays", "Cliff-Lorimer", "k-factor", "thin-film criterion", "bremsstrahlung"],
    excerpt:
      "In TEM-EDS, the incident high-energy electron beam ejects inner-shell electrons from specimen atoms. As outer-shell electrons fall to fill the core vacancies, characteristic X-ray photons (K-alpha, L-alpha, etc.) are emitted with energies unique to each chemical element. Unlike bulk SEM-EDS where severe absorption and fluorescence corrections (ZAF) are required, thin TEM foils satisfy the 'Thin-Film Approximation' where absorption and fluorescence can often be neglected. Quantitative composition is calculated using the elegant Cliff-Lorimer equation: (C_A / C_B) = k_AB * (I_A / I_B), where I_A and I_B are net characteristic X-ray peak intensities, and k_AB is the experimentally calibrated sensitivity factor.",
    summary:
      "TEM-EDS provides localized chemical identification; thin specimens satisfy the thin-film criterion, simplifying quantification via Cliff-Lorimer k-factors.",
    pedagogicalKeyPoints: [
      "Characteristic X-ray energy = difference between atomic energy levels (e.g. K - L).",
      "Cliff-Lorimer equation relates relative concentration C_A/C_B directly to intensity ratio I_A/I_B.",
      "Silicon Drift Detectors (SDD) allow rapid elemental mapping at nanometer scale.",
    ],
    formulas: [
      "\\frac{C_A}{C_B} = k_{AB} \\frac{I_A}{I_B}",
      "C_A + C_B + \\dots + C_N = 100\\%",
    ],
    figureRef: "Figure 33.7: Characteristic X-ray generation mechanism and typical TEM-EDS thin film spectrum.",
  },
  {
    chunkId: "carter-ch37-s1",
    part: 4,
    partTitle: "Spectrometry",
    chapterNumber: 37,
    chapterTitle: "Electron Energy-Loss Spectroscopy (EELS)",
    sectionNumber: "37.1",
    sectionTitle: "Zero-Loss Peak, Plasmon Losses, and Core-Loss Ionization Edges",
    page: 651,
    pageEnd: 668,
    keywords: ["EELS", "zero-loss peak", "ZLP", "plasmon", "core-loss", "thickness measurement", "t / lambda", "fine structure", "ELNES"],
    excerpt:
      "Electron Energy-Loss Spectroscopy (EELS) measures the kinetic energy lost by transmitted electrons as they pass through the sample. The EELS spectrum is divided into three distinct regimes: 1) The Zero-Loss Peak (ZLP) centered at Delta E = 0, representing unscattered and phonon-scattered electrons; 2) The Low-Loss regime (0-50 eV), dominated by collective valence electron oscillations (plasmons), used to measure local specimen thickness via t / lambda = ln(I_total / I_zero); 3) The Core-Loss regime (>50 eV), exhibiting characteristic ionization edges whose energy identifies elements and whose Energy-Loss Near-Edge Structure (ELNES) reveals oxidation states, local bonding coordination, and chemical valence.",
    summary:
      "EELS captures transmitted electron energy loss; low-loss reveals thickness and bandgap, while core-loss edges reveal light elements, chemical bonding, and oxidation states.",
    pedagogicalKeyPoints: [
      "Specimen thickness estimation: t / lambda = ln(I_total / I_0).",
      "EELS is exceptionally sensitive to light elements (Li, B, C, N, O) where EDS yield is poor.",
      "ELNES fine structure provides chemical fingerprinting (e.g., distinguishing Ti3+ vs Ti4+).",
    ],
    formulas: [
      "\\frac{t}{\\lambda_{inel}} = \\ln\\left(\\frac{I_{total}}{I_0}\\right)",
      "\\sigma_{core}(\\beta, \\Delta) = \\int_0^\\beta \\int_0^\\Delta \\frac{d^2\\sigma}{d\\Omega dE} d\\Omega dE",
    ],
    figureRef: "Figure 37.2: Anatomy of an EELS spectrum showing ZLP, volume plasmons, and ionization edges.",
  },
];
