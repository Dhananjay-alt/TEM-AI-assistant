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
  {
    chunkId: "carter-ch19-s1",
    part: 2,
    partTitle: "Diffraction",
    chapterNumber: 19,
    chapterTitle: "Kikuchi Diffraction",
    sectionNumber: "19.1",
    sectionTitle: "Origin and Formation of Kikuchi Lines and Bands",
    page: 299,
    pageEnd: 312,
    keywords: ["kikuchi", "kikuchi lines", "kikuchi bands", "excess line", "deficiency line", "diffuse inelastic scattering", "crystal orientation", "zone axis map", "two-beam alignment"],
    excerpt:
      "Kikuchi lines appear in electron diffraction patterns when the specimen is moderately thick (>30-50 nm). They originate from a two-step process: first, high-energy electrons undergo diffuse, small-angle inelastic scattering in all directions; second, these scattered electrons are elastically Bragg-diffracted by crystal planes. This creates a pair of parallel lines on the phosphor screen: an 'excess' bright line (scattered outward) and a 'deficiency' dark line (scattered toward the center), separated by angular distance 2*theta_B. Crucially, Kikuchi lines are rigidly fixed to the crystal lattice. When the crystal tilts by angle delta_theta, the Kikuchi pattern shifts across the screen by L * delta_theta, whereas Bragg spot positions remain virtually static. This makes Kikuchi maps the essential roadmap for navigating zone axes and achieving exact two-beam conditions (where the Kikuchi line passes directly through spot g, setting excitation error s = 0).",
    summary:
      "Kikuchi lines arise from inelastic-elastic scattering in thick foils; because they are fixed to the crystal frame, they provide an exact navigational roadmap for crystal tilting and two-beam alignment.",
    pedagogicalKeyPoints: [
      "Requires sample thickness > 30 nm for sufficient diffuse inelastic background.",
      "Pair of lines separated by 2*theta_B = lambda / d.",
      "Kikuchi pattern moves rigidly with crystal tilt: shift delta_R = L * delta_theta.",
      "Exact Bragg condition (s = 0) occurs when the bright Kikuchi line passes through diffracted spot g.",
    ],
    formulas: [
      "\\Delta \\theta_{Kikuchi} = 2 \\theta_B = \\frac{\\lambda}{d_{hkl}}",
      "\\Delta R = L \\cdot \\Delta \\theta",
      "s = 0 \\iff \\text{Kikuchi line bisects spot } \\mathbf{g}",
    ],
    figureRef: "Figure 19.3: Ray diagram of Kikuchi line generation from inelastic scattering cones.",
  },
  {
    chunkId: "carter-ch1-s3",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 1,
    chapterTitle: "The Transmission Electron Microscope",
    sectionNumber: "1.4",
    sectionTitle: "Comparison: TEM vs Scanning Electron Microscopy (SEM)",
    page: 12,
    pageEnd: 18,
    keywords: ["tem vs sem", "sem", "scanning electron microscopy", "transmission", "accelerating voltage", "secondary electrons", "backscattered", "sample thickness", "spatial resolution"],
    excerpt:
      "The fundamental distinction between Transmission Electron Microscopy (TEM) and Scanning Electron Microscopy (SEM) lies in the nature of the specimen, the beam-matter interaction, and the detected signals. In TEM, high-energy electrons (80-300 kV) transmit through an ultra-thin specimen (<100 nm), allowing spatial resolution down to sub-angstrom levels (<0.1 nm) and providing crystallographic (SAED), phase, and chemical information through the bulk of the material. In conventional SEM, lower-energy electrons (0.5-30 kV) raster across a bulk, solid specimen; detectors collect Secondary Electrons (SE, 0-50 eV) for 3D surface topography and Backscattered Electrons (BSE) for atomic number (Z) composition. While SEM offers immense depth of field and simple sample preparation for macro/micro surfaces with resolution of 1-5 nm, TEM provides true atomic lattice resolution, defect Burgers vector analysis, and phase-contrast imaging of internal crystal structure.",
    summary:
      "TEM transmits relativistic electrons through thin foils (<100 nm) for sub-angstrom internal atomic imaging and diffraction; SEM rasters lower-voltage electrons across bulk surfaces for 3D topography and BSE Z-contrast.",
    pedagogicalKeyPoints: [
      "TEM: 80-300 kV, transmitted electrons, thin foils (<100 nm), sub-angstrom resolution.",
      "SEM: 0.5-30 kV, secondary & backscattered electrons, bulk specimens, 1-5 nm resolution.",
      "TEM gives internal atomic lattice and crystal defects; SEM gives surface 3D topography and depth of field.",
    ],
    formulas: [
      "d_{TEM} < 0.1\\text{ nm} \\quad \\text{vs} \\quad d_{SEM} \\approx 1 - 5\\text{ nm}",
      "V_{TEM} = 80 - 300\\text{ kV} \\quad \\text{vs} \\quad V_{SEM} = 0.5 - 30\\text{ kV}",
    ],
    figureRef: "Figure 1.8: Interaction volume comparison between bulk SEM sample and thin TEM foil.",
  },
  {
    chunkId: "carter-ch13-s1",
    part: 3,
    partTitle: "Imaging",
    chapterNumber: 13,
    chapterTitle: "Bright-Field and Dark-Field Imaging",
    sectionNumber: "13.1",
    sectionTitle: "Bright-Field, Displaced-Aperture DF, and Centered Dark-Field (CDF)",
    page: 215,
    pageEnd: 228,
    keywords: ["bright-field", "dark-field", "bf", "df", "centered dark field", "cdf", "aperture", "beam tilt coils", "spherical aberration", "diffraction contrast"],
    excerpt:
      "In Bright-Field (BF) imaging, the objective aperture in the Back Focal Plane is centered precisely on the unscattered direct beam (000). Electrons scattered out of the aperture by Bragg diffraction or high-angle Rutherford scattering are stopped, making diffracting crystals appear dark. In Dark-Field (DF) imaging, only a diffracted beam (g) is admitted to form the image. There are two ways to form a DF image: 1) Displaced-Aperture DF: Physically shifting the aperture off-axis to select spot g. This introduces severe off-axis spherical aberration (Cs) and astigmatism, degrading image resolution; 2) Centered Dark-Field (CDF): Using beam deflection coils above the specimen to tilt the incident illumination by angle 2*theta_B so the diffracted beam g travels straight down the optical axis through the centered objective aperture. CDF maintains optical alignment along the lens axis, preserving high spatial resolution.",
    summary:
      "Bright-Field selects the direct beam (000); Dark-Field selects a diffracted beam (g). Centered Dark-Field (CDF) tilts the incident beam so diffracted rays travel down the optical axis, eliminating off-axis spherical aberration.",
    pedagogicalKeyPoints: [
      "BF selects direct beam (000); diffracting regions appear dark.",
      "DF selects diffracted beam (g); only regions satisfying Bragg's law appear bright.",
      "Displaced-aperture DF suffers from severe spherical aberration Cs*alpha^3.",
      "Centered Dark Field (CDF) tilts the incident beam by 2*theta_B to keep diffracted rays along the optical axis.",
    ],
    formulas: [
      "\\text{Incident Beam Tilt: } 2\\theta_B = \\frac{\\lambda}{d_{hkl}}",
      "I_{BF} \\propto |\\phi_0|^2, \\quad I_{DF} \\propto |\\phi_g|^2",
    ],
    figureRef: "Figure 13.2: Ray diagrams comparing Bright-Field, Displaced-Aperture DF, and Centered Dark-Field (CDF).",
  },
  {
    chunkId: "carter-ch24-s1",
    part: 3,
    partTitle: "Imaging",
    chapterNumber: 24,
    chapterTitle: "Scanning Transmission Electron Microscopy (STEM)",
    sectionNumber: "24.1",
    sectionTitle: "STEM Detectors: Bright-Field, ADF, and HAADF Z-Contrast",
    page: 395,
    pageEnd: 410,
    keywords: ["stem", "haadf", "z-contrast", "annular dark field", "adf", "rutherford scattering", "sub-angstrom probe", "incoherent imaging"],
    excerpt:
      "In Scanning Transmission Electron Microscopy (STEM), condenser optics focus the electron beam into an atomic-scale probe (0.05-0.2 nm) that is rastered across the specimen. Transmitted electrons are collected on geometrically configured detectors: 1) Bright-Field (BF) detector: intercepts the direct transmitted disc; 2) Annular Dark-Field (ADF) detector: collects medium-angle scattered electrons (10-50 mrad), containing mixed Bragg and thermal diffuse scattering; 3) High-Angle Annular Dark-Field (HAADF) detector: collects electrons scattered to very high semi-angles (>50-100 mrad). At these high angles, coherent Bragg scattering is completely suppressed by thermal diffuse scattering (TDS), and the signal is dominated by incoherent Rutherford scattering off atomic nuclei. Consequently, HAADF intensity scales monotonically with atomic number: I proportional to Z^1.7 to Z^2.0 ('Z-contrast'). Unlike HRTEM, HAADF images do not suffer from phase contrast reversals with defocus or thickness, allowing direct visual interpretation of atomic columns.",
    summary:
      "HAADF-STEM uses an annular detector at high scattering angles (>50 mrad) to collect incoherent Rutherford-scattered electrons, producing direct Z-contrast images scaling as Z^(1.7-2.0) without phase reversals.",
    pedagogicalKeyPoints: [
      "Atomic-scale convergent probe rastered across sample.",
      "HAADF collects high-angle (>50 mrad) incoherent Rutherford scattering.",
      "Intensity scales as Z^(1.7 to 2.0): heavy atoms glow much brighter than light atoms.",
      "No contrast reversals with defocus or thickness, enabling intuitive atomic column identification.",
    ],
    formulas: [
      "I_{HAADF} \\propto Z^{\\gamma}, \\quad 1.7 \\le \\gamma \\le 2.0",
      "\\sigma_{Rutherford}(\\theta) \\propto \\frac{Z^2}{\\sin^4(\\theta/2)}",
    ],
    figureRef: "Figure 24.3: Configuration of BF, ADF, and HAADF detectors beneath the specimen in STEM.",
  },
  {
    chunkId: "carter-ch18-s1",
    part: 2,
    partTitle: "Diffraction",
    chapterNumber: 18,
    chapterTitle: "Convergent-Beam Electron Diffraction (CBED)",
    sectionNumber: "18.1",
    sectionTitle: "CBED Discs, Higher-Order Laue Zones (HOLZ), and Thickness Determination",
    page: 275,
    pageEnd: 295,
    keywords: ["cbed", "convergent beam", "kossel-mollenstedt", "holz", "higher order laue zone", "space group", "point group", "sample thickness", "kelly method"],
    excerpt:
      "Unlike conventional SAED which uses parallel illumination to produce sharp spots, Convergent-Beam Electron Diffraction (CBED) uses a convergent electron probe (semi-angle alpha) focused onto the specimen. This expands each diffraction spot into a disc of diameter 2*alpha (Kossel-Möllenstedt discs). Within each disc, dynamic diffraction intensity oscillations reveal rich 3D crystallographic information. At high scattering angles, narrow lines known as Higher-Order Laue Zone (HOLZ) lines appear due to Ewald sphere intersections with higher reciprocal lattice layers (n > 0). HOLZ lines are exceptionally sensitive to small lattice parameter changes (strain sensitivity < 0.01%) and accelerating voltage. Furthermore, intensity fringe spacings within two-beam CBED discs allow exact local foil thickness determination down to +/- 2% using Kelly's graphical method.",
    summary:
      "CBED expands diffraction spots into discs containing dynamical intensity fringes and HOLZ lines, enabling 3D space group determination, local strain measurement, and exact thickness calibration.",
    pedagogicalKeyPoints: [
      "Disc diameter equals 2*alpha; non-overlapping discs = Kossel-Möllenstedt condition.",
      "HOLZ lines provide 3D crystal symmetry, point/space group identification, and sub-picometer strain sensitivity.",
      "Kelly's method uses fringe spacing in two-beam CBED discs to measure local thickness t.",
    ],
    formulas: [
      "\\frac{s_i^2}{n_i^2} + \\frac{1}{\\xi_g^2 n_i^2} = \\frac{1}{t^2}",
      "r_{HOLZ} = \\sqrt{\\frac{2 n H}{\\lambda}}",
    ],
    figureRef: "Figure 18.2: Formation of CBED discs and HOLZ rings across Zero-Order and First-Order Laue Zones.",
  },
  {
    chunkId: "carter-ch38-s1",
    part: 4,
    partTitle: "Spectrometry",
    chapterNumber: 38,
    chapterTitle: "Microanalysis: Comparing EDS and EELS",
    sectionNumber: "38.1",
    sectionTitle: "Comparison: Energy-Dispersive X-ray (EDS) vs Electron Energy-Loss (EELS)",
    page: 675,
    pageEnd: 690,
    keywords: ["eds vs eels", "eels vs eds", "spectrometry", "energy resolution", "light elements", "cliff-lorimer", "elnes", "fluorescence yield", "detector"],
    excerpt:
      "Energy-Dispersive X-ray Spectroscopy (EDS) and Electron Energy-Loss Spectroscopy (EELS) are complementary analytical techniques on the TEM. EDS detects characteristic X-ray photons emitted when outer electrons de-excite into core vacancies. Because fluorescence yield drops dramatically for low atomic numbers Z (where non-radiative Auger emission dominates), and because beryllium/polymer detector windows absorb low-energy X-rays, EDS is best suited for medium and heavy elements (Z >= 11, Na to U). EELS, in contrast, detects the primary fast electrons that caused the ionization by measuring their exact kinetic energy loss. EELS captures virtually 100% of forward-scattered inelastically scattered electrons, making it exquisitely sensitive to light elements (Li, Be, B, C, N, O). Furthermore, EELS boasts an energy resolution of 0.3-1.0 eV (versus 130 eV for EDS), enabling Energy-Loss Near-Edge Structure (ELNES) to resolve oxidation states, chemical bonding coordination, and bandgap states.",
    summary:
      "EDS detects secondary X-rays and excels at heavy elements with simple quantification; EELS detects primary electron energy loss with 1 eV resolution, excelling at light elements and oxidation state analysis.",
    pedagogicalKeyPoints: [
      "Energy Resolution: EELS = 0.3-1.0 eV vs EDS = 120-140 eV.",
      "Light Elements (Z < 11): EELS is far superior because fluorescence yield omega_K is negligible for light atoms.",
      "Chemical State: EELS ELNES reveals oxidation states (e.g. Fe2+ vs Fe3+, Ti3+ vs Ti4+); EDS only gives elemental ratios.",
      "Sample Thickness: EDS tolerates thicker samples; EELS requires very thin foils (t/lambda < 0.5) to avoid multiple plasmon convolution.",
    ],
    formulas: [
      "\\omega_K \\propto Z^4 \\implies \\text{X-ray yield poor for low Z}",
      "\\Delta E_{EELS} \\approx 0.3 - 0.8\\text{ eV} \\ll \\Delta E_{EDS} \\approx 130\\text{ eV}",
    ],
    figureRef: "Figure 38.1: Complementary mechanisms of EELS (primary event) and EDS (secondary de-excitation event).",
  },
  {
    chunkId: "carter-ch10-s1",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 10,
    chapterTitle: "Specimen Preparation",
    sectionNumber: "10.1",
    sectionTitle: "Techniques for Preparing Electron-Transparent Foils",
    page: 153,
    pageEnd: 172,
    keywords: ["sample prep", "specimen preparation", "electropolishing", "twin jet", "ion milling", "fib", "focused ion beam", "lift out", "dimpling", "contamination"],
    excerpt:
      "A successful TEM investigation depends fundamentally on specimen preparation: the sample must be electron-transparent (<100 nm, ideally <20 nm for HRTEM), structurally undamaged, representative of the bulk, and free of hydrocarbon contamination. Common preparation techniques include: 1) Electropolishing (Twin-Jet): Conductive metals are punched into 3 mm discs, and twin jets of electrolyte acid (e.g., perchloric/acetic) dissolve a central perforation; the thin wedge around the hole is electron transparent; 2) Mechanical Dimpling & Ion Milling: Brittle ceramics and semiconductors are mechanically ground to ~20 um, then thinned to perforation using low-angle argon ion beams (Ar+, 2-5 keV at 4-6 degrees grazing angle); 3) Focused Ion Beam (FIB) In-Situ Lift-Out: Gallium ion beams (Ga+, 30 kV down to 2-5 kV final polish) mill site-specific cross-sections, transferred to a copper post with an internal micromanipulator; 4) Dispersion onto Carbon Grids: Nanoparticles, catalysts, and 2D materials are ultrasonicated in solvent and drop-cast onto ultra-thin carbon or holey carbon/graphene TEM grids.",
    summary:
      "TEM requires foils <100 nm prepared by twin-jet electropolishing (metals), Ar+ ion milling (ceramics), FIB lift-out (site-specific devices), or drop-casting (nanoparticles).",
    pedagogicalKeyPoints: [
      "Electropolishing: Fast, artifact-free for conductive alloys.",
      "Ion milling: Works for ceramics/semiconductors; requires low grazing angle (<5 deg) to minimize amorphous surface layer.",
      "FIB: High precision site-specificity; requires low-voltage cleaning (2-5 kV) to remove Ga+ ion damage.",
      "Plasma cleaning: Removes hydrocarbon contamination before loading into ultra-high vacuum.",
    ],
    formulas: [
      "t_{foil} < 100\\text{ nm} \\quad (t < 20\\text{ nm for HRTEM})",
      "\\text{FIB cleaning voltage: } 2 - 5\\text{ kV to remove Ga amorphous layer}",
    ],
    figureRef: "Figure 10.4: Schematic of twin-jet electropolishing and FIB in-situ lift-out procedure.",
  },
  {
    chunkId: "carter-ch4-s1",
    part: 1,
    partTitle: "Basics",
    chapterNumber: 4,
    chapterTitle: "Microscope Alignment and Calibration",
    sectionNumber: "4.1",
    sectionTitle: "Eucentric Height, Beam Alignment, and Objective Astigmatism Correction",
    page: 55,
    pageEnd: 71,
    keywords: ["alignment", "eucentric height", "z-wobbler", "astigmatism", "stigmator", "fresnel fringes", "gun tilt", "current center", "voltage center"],
    excerpt:
      "Aligning a TEM follows a rigorous electron-optical sequence: 1) Eucentric Height: The specimen must sit precisely on the tilt axis of the goniometer. Using the Z-axis wobbler, the operator tilts +/- 15 degrees and adjusts sample Z-height until image parallax ceases; 2) Gun Tilt & Shift: High-voltage alignment coils center the beam on the condenser aperture; 3) Condenser Aperture Centering: While oscillating C2 brightness (defocusing the beam), the aperture is mechanically centered so the beam expands and contracts concentrically without sideways drift; 4) Voltage / Current Center: Modulating high tension (HT) or objective lens current causes images to rotate around the optical axis; alignment coils center this rotation point; 5) Objective Astigmatism Correction: At high magnification on an amorphous carbon film, defocusing produces a Fresnel fringe. If astigmatism is present, the fringe is elliptical and flips 90 degrees across focus. Adjusting objective stigmators restores a perfectly circular, isotropic fringe at Gaussian focus.",
    summary:
      "Proper TEM operation requires establishing eucentric height via the Z-wobbler, concentric condenser aperture centering, voltage centering, and objective astigmatism correction on amorphous Fresnel fringes.",
    pedagogicalKeyPoints: [
      "Eucentric height ensures the feature does not translate across the field of view during sample tilting.",
      "Objective astigmatism correction eliminates directional blurring and is checked on amorphous carbon edges.",
      "Voltage/current center ensures the optical axis coincides with the physical lens centers.",
    ],
    formulas: [
      "\\Delta Z = \\frac{\\Delta x}{2 \\sin(\\theta_{wobbler})}",
      "r_{astig} = \\Delta f_{astig} \\cdot \\alpha",
    ],
    figureRef: "Figure 4.3: Sequence of Fresnel fringe symmetry during objective astigmatism correction across focus.",
  },
];
