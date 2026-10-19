/**
 * Relativistic Electron Physics Calculations for TEM
 * Grounded in C. Barry Carter & David B. Williams: "Transmission Electron Microscopy"
 * Chapter: "Electrons and Their Interaction with the Specimen"
 */

// Fundamental Physical Constants (CODATA 2018)
export const CONSTANTS = {
  h: 6.62607015e-34, // Planck constant (J*s)
  m0: 9.1093837e-31, // Electron rest mass (kg)
  e: 1.602176634e-19, // Elementary charge (C)
  c: 2.99792458e8, // Speed of light in vacuum (m/s)
  restEnergyKeV: 510.9989, // Rest energy m0*c^2 in keV
};

export interface RelativisticResult {
  voltageKV: number;
  voltageV: number;
  wavelengthMeters: number;
  wavelengthNm: number;
  wavelengthPm: number;
  wavelengthAngstrom: number;
  gamma: number; // Lorentz factor
  velocityFractionC: number; // v / c
  velocityMs: number; // m/s
  kineticEnergyKeV: number;
  relativisticMassKg: number;
  momentumKgmS: number;
  nonRelativisticWavelengthNm: number;
  relativisticCorrectionPct: number; // Percentage difference
}

/**
 * Calculates relativistic de Broglie electron wavelength and kinematics
 * for a given accelerating voltage in kV.
 * 
 * Formula:
 * lambda = h / sqrt( 2 * m0 * e * V * (1 + (e * V) / (2 * m0 * c^2)) )
 */
export function calculateRelativisticElectron(voltageKV: number): RelativisticResult {
  const V = Math.max(1, voltageKV) * 1e3; // Convert kV to Volts
  const { h, m0, e, c } = CONSTANTS;

  // Kinetic energy
  const E_k = e * V; // in Joules
  const E0_J = m0 * c * c; // Rest energy in Joules

  // Lorentz factor gamma = 1 + Ek / (m0*c^2)
  const gamma = 1 + E_k / E0_J;

  // Velocity v = c * sqrt(1 - 1 / gamma^2)
  const v_ratio = Math.sqrt(Math.max(0, 1 - 1 / (gamma * gamma)));
  const velocityMs = v_ratio * c;

  // Relativistic momentum p = gamma * m0 * v
  const momentum = Math.sqrt(2 * m0 * E_k * (1 + E_k / (2 * E0_J)));

  // Relativistic wavelength lambda = h / p
  const wavelengthMeters = h / momentum;
  const wavelengthNm = wavelengthMeters * 1e9;
  const wavelengthPm = wavelengthMeters * 1e12;
  const wavelengthAngstrom = wavelengthMeters * 1e10;

  // Non-relativistic comparison: lambda_0 = h / sqrt(2 * m0 * e * V)
  const nonRelLambdaMeters = h / Math.sqrt(2 * m0 * E_k);
  const nonRelativisticWavelengthNm = nonRelLambdaMeters * 1e9;

  const relativisticCorrectionPct =
    ((nonRelativisticWavelengthNm - wavelengthNm) / nonRelativisticWavelengthNm) * 100;

  return {
    voltageKV,
    voltageV: V,
    wavelengthMeters,
    wavelengthNm,
    wavelengthPm,
    wavelengthAngstrom,
    gamma,
    velocityFractionC: v_ratio,
    velocityMs,
    kineticEnergyKeV: voltageKV,
    relativisticMassKg: gamma * m0,
    momentumKgmS: momentum,
    nonRelativisticWavelengthNm,
    relativisticCorrectionPct,
  };
}

/**
 * Standard typical TEM accelerating voltages and their textbook parameters
 */
export const TYPICAL_VOLTAGES = [
  { kv: 80, label: "80 kV (Cryo-TEM / 2D Materials / Low Damage)" },
  { kv: 100, label: "100 kV (Classic Student TEM / Biological)" },
  { kv: 120, label: "120 kV (Biomedical & Soft Matter)" },
  { kv: 200, label: "200 kV (Standard Materials Science Workhorse)" },
  { kv: 300, label: "300 kV (High-Resolution TEM / Deep Penetration)" },
];
