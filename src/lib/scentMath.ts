
export interface EnvironmentalFactors {
  plantDiversity: number; // 0-100
  animalPresence: number; // 0-100
  soilHealth: number;     // 0-100
  waterQuality: number;   // 0-100
  airPurity: number;      // 0-100
}

export interface ScentProfile {
  name: string;
  intensity: number;
  notes: string[];
}

export function generateScent(factors: EnvironmentalFactors): ScentProfile {
  // Sustainability Equation: Weighted average of factors
  const sustainabilityIndex = (
    factors.plantDiversity * 0.2 +
    factors.animalPresence * 0.1 +
    factors.soilHealth * 0.3 +
    factors.waterQuality * 0.2 +
    factors.airPurity * 0.2
  );

  let name = "Neutral Aura";
  let notes = ["Musky", "Earth"];

  if (sustainabilityIndex > 80) {
    name = "Ethereal Bloom";
    notes = ["Floral", "Fresh Rain", "Ozone"];
  } else if (sustainabilityIndex > 50) {
    name = "Woodland Resonance";
    notes = ["Pine", "Damp Soil", "Moss"];
  } else {
    name = "Urban Echo";
    notes = ["Metal", "Dry Grass"];
  }

  return {
    name,
    intensity: sustainabilityIndex,
    notes,
  };
}
