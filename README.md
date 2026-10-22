# TEM-AI — TRANSMISSION ELECTRON MICROSCOPY INTELLIGENCE

```
  ████████╗███████╗███╗   ███╗      █████╗ ██╗
  ╚══██╔══╝██╔════╝████╗ ████║     ██╔══██╗██║
     ██║   █████╗  ██╔████╔██║     ███████║██║
     ██║   ██╔══╝  ██║╚██╔╝██║     ██╔══██║██║
     ██║   ███████╗██║ ╚═╝ ██║     ██║  ██║██║
     ╚═╝   ╚══════╝╚═╝     ╚═╝     ╚═╝  ╚═╝╚═╝
  ═════════════════════════════════════════════
  CARTER LAB AGENT & INTERACTIVE MICROSCOPY WORKSTATION
```

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
[![Google Gemini Pro](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Aesthetic](https://img.shields.io/badge/Design-Neo--Brutalist_Acid-D2E823?style=for-the-badge&labelColor=09090B)](https://github.com/Dhananjay-alt/TEM-AI-assistant)

---

## ⚡ Overview

**TEM-AI** is an AI-powered educational laboratory workstation and intelligent assistant built for **Transmission Electron Microscopy (TEM)** and Materials Science.

Unlike generic chatbots that hallucinate citations and dump walls of unverified text, **TEM-AI** is grounded strictly in the materials science standard:
> **David B. Williams & C. Barry Carter**
> *"Transmission Electron Microscopy: A Textbook for Materials Science"* (Springer 2nd Edition)

It provides an interactive, tactile, **Neo-Brutalist "Acid" Workstation** featuring live relativistic physics calculations, automated micrograph particle size distribution analysis, single-crystal SAED diffraction simulation, university exam grading rubrics, and a cinematic scroll-driven anatomical dissection of the 2.5-meter optical column.

---

## 🔬 Core Workstations & Capabilities

### 1. 🤖 Carter AI Lab Agent Workstation (`/` & `/ask`)
The **Carter AI Agent** is the central command center of the workstation:
- **Strict Grounding:** Distinct separation between `"From Carter"` (authentic textbook citations with chapter & page indices) and `"Additional Scientific Explanation"`.
- **4 Operational Modes:**
  - `ASK CARTER` — High-speed technical Q&A with strict no-hallucination verification.
  - `SOCRATIC TUTOR` — Pedagogical step-by-step guidance through electron optics derivations.
  - `EXAM GRADER` — Automated grading against university rubrics (2M definitions, 5M derivations, 10M contrast essays, and oral Viva Voce traps).
  - `COLUMN LAB` — Real-time microscope troubleshooting (astigmatism, beam drift, charging, contamination).
- **Relativistic Telemetry HUD:** Displays real-time electron velocity ($v/c$), de Broglie wavelength ($\lambda$), and vacuum level.

---

### 2. 🧬 TEM Column Anatomy — Scroll Dissection (`/anatomy`)
An interactive, scroll-driven physical dissection of the Transmission Electron Microscope column:
- **"Dissect a TEM as you scroll":** The complete instrument progressively separates into its constituent optical stages as the user scrolls.
- **Independent SVG Optical Groups:**
  1. `01. ELECTRON GUN` — High-voltage tank (-200 kV) with Schottky FEG / tungsten cathode and acceleration anode.
  2. `02. CONDENSER SYSTEM` — Dual electromagnetic lenses (C1 spot demagnification & C2 convergence semi-angle $\alpha$) and condenser apertures.
  3. `03. SPECIMEN STAGE` — Eucentric dual-axis ($\pm45^\circ$) goniometer rod and thin foil ($<100\text{ nm}$).
  4. `04. OBJECTIVE LENS` — High magnetic field immersion gap ($2.0\text{ T}$), first intermediate image plane, and Back Focal Plane (BFP).
  5. `05. OBJECTIVE APERTURE` — Contrast selector in the Back Focal Plane creating Bright-Field (BF) or Dark-Field (DF) imaging.
  6. `06. MAGNIFICATION SYSTEM` — Cascaded intermediate and projector lenses magnifying from $50\times$ up to $1,500,000\times$.
  7. `07. DETECTOR SYSTEM` — ZnS:Ag phosphor screen and direct electron CMOS camera (4k $\times$ 4k, 16 MP).
- **Diffraction Branch:** Interactive duality callout comparing **Image Space (Real Space)** with **Diffraction Space (Reciprocal Space)** with animated Bragg diffraction spot reflections.

---

### 3. 🎯 SAED Diffraction Simulator (`/simulator`)
- **Relativistic de Broglie Solver:** Real-time calculation of electron wavelength ($\lambda$), relativistic momentum ($p$), and Lorentz factor ($\gamma$) across $10\text{--}300\text{ kV}$.
- **Single-Crystal Spot Generator:** Calculates camera constant ($R\cdot d = \lambda\cdot L$) for cubic lattices (FCC, BCC, Diamond Cubic).
- **Polycrystalline Ring Simulator:** Simulates powder diffraction rings with real-time radial profiling.

---

### 4. 🖼️ Micrograph Particle Lab (`/image-analysis`)
- **Connected-Component Segmentation:** Canvas-based computer vision blob detection extracting particle count, equivalent circle diameter ($ECD$), and area.
- **Calibrated Scale Bar Tool:** Interactive calibration tool mapping pixels to physical nanometers.
- **Log-Normal Size Distribution:** Real-time histogram rendering of mean particle size, standard deviation, and polydispersity index ($PDI$).

---

### 5. 📚 University Examination & Viva Workshop (`/exam`)
- **Marking Rubrics:** Modeled on university materials science exams:
  - **2-Mark Questions:** Concise definitions (e.g., *Scherzer defocus*, *Kikuchi lines*, *Ewald sphere*).
  - **5-Mark Questions:** Physical derivations (e.g., $R\cdot d = \lambda\cdot L$, relativistic $\lambda$).
  - **10-Mark Questions:** In-depth comparative contrast essays (Phase vs Amplitude, BF vs DF).
  - **Oral Viva Voce Traps:** Common laboratory defense questions with trap warnings.

---

### 6. 🌐 Pedagogical Concept Graph (`/knowledge-map`)
- Interactive reciprocal space ontology linking 14+ foundational concepts:
  - `Ewald Sphere` $\leftrightarrow$ `Bragg Diffraction` $\leftrightarrow$ `Back Focal Plane`
  - `Weak-Beam Dark Field` $\leftrightarrow$ `Dislocation Burgers Vector` $\leftrightarrow$ `g·b = 0`

---

## 🎨 Design System: Neo-Brutalist "Acid" Aesthetic

The interface is engineered around an **Acid Neo-Brutalist** design language:

```text
COLOR PALETTE:
  Paper Background:   #F8F4E8  (Warm paper-like tone)
  Primary / Borders:  #09090B  (Solid ink-black)
  Signature Accent:   #D2E823  (High-voltage Acid Yellow-Green)

TYPOGRAPHY:
  Headings & Display: 'Dela Gothic One' (All-caps, tracking-tighter)
  Body & Labels:      'Space Grotesk'   (Weights 400-700)
  Telemetry & Code:   'JetBrains Mono'  (Monospaced data)

TACTILE MICRO-INTERACTIONS:
  • Hard Shadows:     Offset solid boxes with 0 blur (e.g. 4px 4px 0px 0px #09090B)
  • Physical Press:   Buttons translate [2px, 2px] and drop shadow on active click
  • Glitch Hover:     Rapid ±2px jitter keyframe animation on display titles
  • Custom Cursor:    32px mix-blend-mode: difference circle with 0.2 smooth lerp
  • Continuous Loop:  Acid marquee highlights banner running at linear 20s
  • Paper Texture:    Global SVG fractal noise overlay at 3% opacity
```

---

## 📐 Relativistic Physics & Kinematics Grounding

All physics calculations in TEM-AI use the fundamental constants (CODATA 2018):

$$E_k = e \cdot V, \quad \gamma = 1 + \frac{E_k}{m_0 c^2}$$

$$\lambda = \frac{h}{\sqrt{2 m_0 e V \left(1 + \frac{e V}{2 m_0 c^2}\right)}}$$

$$v = c \sqrt{1 - \frac{1}{\gamma^2}}$$

### Typical Optical Parameters at Standard Accelerating Voltages:

| Voltage ($V$) | Wavelength ($\lambda$) | Velocity ($v/c$) | Relativistic Mass ($m/m_0$) |
|---|---|---|---|
| **80 kV** | $4.18\text{ pm}$ | $0.501\text{ c}$ | $1.157$ |
| **100 kV** | $3.70\text{ pm}$ | $0.548\text{ c}$ | $1.196$ |
| **200 kV** | $2.51\text{ pm}$ | $0.695\text{ c}$ | $1.391$ |
| **300 kV** | $1.97\text{ pm}$ | $0.777\text{ c}$ | $1.587$ |

---

## 🛠️ Tech Stack & Directory Structure

```text
TEM-AI-assistant/
├── src/
│   ├── app/
│   │   ├── anatomy/             # /anatomy — Interactive Scroll Dissection
│   │   ├── ask/                 # /ask — Dedicated Carter AI Tutor page
│   │   ├── simulator/           # /simulator — SAED & Ewald Sphere Solver
│   │   ├── image-analysis/      # /image-analysis — Micrograph Particle Sizer
│   │   ├── exam/                # /exam — Exam Marking Rubrics & Viva Voce
│   │   ├── knowledge-map/       # /knowledge-map — Concept Graph
│   │   ├── page.tsx             # Homepage with Agent in Main Focus
│   │   └── globals.css          # Acid Neo-Brutalist styles & keyframes
│   ├── components/
│   │   ├── anatomy/             # Multi-group SVG column & GSAP triggers
│   │   ├── chat/                # Agent chat interface & mode controllers
│   │   ├── home/                # HeroAgentWorkstation, BentoGrid, Drops
│   │   ├── ui/                  # CustomCursor, BrutalCard, BrutalButton
│   │   └── layout/              # Sticky Navbar (16px margin) & Footer
│   ├── lib/
│   │   ├── ai/                  # Gemini client, system prompts & fallbacks
│   │   ├── rag/                 # Vector search & Carter textbook indexer
│   │   └── physics/             # Relativistic de Broglie & electron optics
│   └── data/                    # Carter chapter index & sample micrographs
├── tailwind.config.ts           # Neo-Brutalist Acid tokens & hard shadows
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18.17+ or v20+
- **npm** or **pnpm**

### 2. Clone & Install
```bash
git clone https://github.com/Dhananjay-alt/TEM-AI-assistant.git
cd TEM-AI-assistant
npm install
```

### 3. Environment Setup (Optional)
The application includes rich, authentic offline Carter textbook embeddings and works immediately out of the box. To connect live Google Gemini Pro generative capabilities:

Create `.env.local` in the project root:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 📖 Citation & Textbook Grounding

If you use TEM-AI in teaching, academic coursework, or research, please cite the foundational reference:

```bibtex
@book{williams_carter_2009,
  author    = {Williams, David B. and Carter, C. Barry},
  title     = {Transmission Electron Microscopy: A Textbook for Materials Science},
  edition   = {2nd},
  publisher = {Springer},
  year      = {2009},
  isbn      = {978-0-387-76500-6},
  doi       = {10.1007/978-0-387-76501-3}
}
```

---

## 🛡️ License

Built for educational materials science and electron microscopy research. Released under the **MIT License**.
