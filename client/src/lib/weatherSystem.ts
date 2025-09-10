interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface WeatherConditions {
  windSpeed: number;
  windDirection: Vector3;
  turbulenceIntensity: number;
  visibility: number;
  cloudCover: number;
  temperature: number;
  pressure: number;
}

export interface WeatherEffects {
  windForce: Vector3;
  turbulence: Vector3;
  atmosphericDrag: number;
}

export class WeatherSystem {
  private conditions: WeatherConditions;
  private turbulenceTimer: number = 0;

  constructor(conditions?: Partial<WeatherConditions>) {
    this.conditions = {
      windSpeed: conditions?.windSpeed ?? 15, // knots
      windDirection: conditions?.windDirection ?? { x: 1, y: 0, z: 0.3 },
      turbulenceIntensity: conditions?.turbulenceIntensity ?? 0.3,
      visibility: conditions?.visibility ?? 10, // miles
      cloudCover: conditions?.cloudCover ?? 0.4, // 0-1
      temperature: conditions?.temperature ?? 15, // celsius
      pressure: conditions?.pressure ?? 1013.25 // hPa
    };

    // Normalize wind direction
    const magnitude = Math.sqrt(
      this.conditions.windDirection.x ** 2 +
      this.conditions.windDirection.y ** 2 +
      this.conditions.windDirection.z ** 2
    );
    
    if (magnitude > 0) {
      this.conditions.windDirection.x /= magnitude;
      this.conditions.windDirection.y /= magnitude;
      this.conditions.windDirection.z /= magnitude;
    }
  }

  updateConditions(newConditions: Partial<WeatherConditions>): void {
    this.conditions = { ...this.conditions, ...newConditions };
    
    // Re-normalize wind direction if it was updated
    if (newConditions.windDirection) {
      const magnitude = Math.sqrt(
        this.conditions.windDirection.x ** 2 +
        this.conditions.windDirection.y ** 2 +
        this.conditions.windDirection.z ** 2
      );
      
      if (magnitude > 0) {
        this.conditions.windDirection.x /= magnitude;
        this.conditions.windDirection.y /= magnitude;
        this.conditions.windDirection.z /= magnitude;
      }
    }
  }

  getEffects(altitude: number, delta: number): WeatherEffects {
    this.turbulenceTimer += delta;

    // Wind force calculation (stronger at higher altitudes)
    const altitudeFactor = Math.max(0, Math.min(altitude / 1000, 2.0)); // Factor increases up to 2000 world units
    const windForceMultiplier = this.conditions.windSpeed * 0.1 * altitudeFactor;
    
    const windForce: Vector3 = {
      x: this.conditions.windDirection.x * windForceMultiplier,
      y: this.conditions.windDirection.y * windForceMultiplier * 0.5, // Less vertical wind
      z: this.conditions.windDirection.z * windForceMultiplier
    };

    // Turbulence calculation (random fluctuations)
    const turbulenceBase = this.conditions.turbulenceIntensity * altitudeFactor;
    const turbulence: Vector3 = {
      x: Math.sin(this.turbulenceTimer * 3.7) * turbulenceBase * 0.5,
      y: Math.cos(this.turbulenceTimer * 2.1) * turbulenceBase * 0.3,
      z: Math.sin(this.turbulenceTimer * 4.3) * turbulenceBase * 0.4
    };

    // Atmospheric drag based on altitude and weather conditions
    const densityFactor = Math.exp(-altitude / 8000); // Air density decreases with altitude
    const atmosphericDrag = 0.02 * densityFactor * (1 + this.conditions.cloudCover * 0.1);

    return {
      windForce,
      turbulence,
      atmosphericDrag
    };
  }

  getConditions(): WeatherConditions {
    return { ...this.conditions };
  }

  // Preset weather conditions
  static getCalmWeather(): WeatherConditions {
    return {
      windSpeed: 5,
      windDirection: { x: 1, y: 0, z: 0 },
      turbulenceIntensity: 0.1,
      visibility: 15,
      cloudCover: 0.2,
      temperature: 20,
      pressure: 1013.25
    };
  }

  static getStormyWeather(): WeatherConditions {
    return {
      windSpeed: 35,
      windDirection: { x: 0.8, y: -0.2, z: 0.6 },
      turbulenceIntensity: 0.8,
      visibility: 3,
      cloudCover: 0.9,
      temperature: 10,
      pressure: 995
    };
  }

  static getTurbulentWeather(): WeatherConditions {
    return {
      windSpeed: 25,
      windDirection: { x: 0.6, y: 0.1, z: 0.8 },
      turbulenceIntensity: 0.6,
      visibility: 8,
      cloudCover: 0.7,
      temperature: 12,
      pressure: 1008
    };
  }
}