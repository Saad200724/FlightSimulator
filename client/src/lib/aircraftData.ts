export interface AircraftData {
  name: string;
  description: string;
  type: string;
  maxSpeed: number;
  maneuverability: number; // 1-10 scale
  fuelEfficiency: number; // 1-10 scale
  maxThrust: number;
  liftCoefficient: number;
  dragCoefficient: number;
  color: string;
}

export const aircraftData: Record<string, AircraftData> = {
  trainer: {
    name: "T-6 Trainer",
    description: "Easy to fly training aircraft with forgiving flight characteristics",
    type: "trainer",
    maxSpeed: 180,
    maneuverability: 6,
    fuelEfficiency: 8,
    maxThrust: 150,
    liftCoefficient: 0.8,
    dragCoefficient: 0.02,
    color: "#4A90E2"
  },
  
  fighter: {
    name: "F-16 Falcon",
    description: "High-performance fighter with excellent maneuverability",
    type: "fighter",
    maxSpeed: 450,
    maneuverability: 9,
    fuelEfficiency: 4,
    maxThrust: 400,
    liftCoefficient: 1.2,
    dragCoefficient: 0.015,
    color: "#E24A4A"
  },
  
  airliner: {
    name: "Boeing 737",
    description: "Commercial airliner with stable flight characteristics and high fuel efficiency",
    type: "airliner",
    maxSpeed: 280,
    maneuverability: 3,
    fuelEfficiency: 9,
    maxThrust: 200,
    liftCoefficient: 1.0,
    dragCoefficient: 0.018,
    color: "#50C878"
  }
};
