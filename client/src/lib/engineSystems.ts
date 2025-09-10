export interface EngineState {
  isRunning: boolean;
  rpm: number;
  temperature: number; // Engine temperature in Celsius
  oilPressure: number; // Oil pressure in PSI
  fuelFlow: number; // Fuel flow in GPH
  startupSequenceActive: boolean;
  shutdownSequenceActive: boolean;
  failed: boolean;
  failureType: string | null;
}

export interface SystemFailure {
  type: 'engine' | 'fuel' | 'electrical' | 'hydraulic';
  severity: 'warning' | 'caution' | 'critical';
  message: string;
  affectsEngine: boolean;
  duration: number; // Duration in seconds, -1 for permanent
}

export class EngineSystem {
  private state: EngineState;
  private startupTime: number = 0;
  private shutdownTime: number = 0;
  private failures: SystemFailure[] = [];
  private lastFailureCheck: number = 0;

  constructor() {
    this.state = {
      isRunning: false,
      rpm: 0,
      temperature: 20, // Ambient temperature
      oilPressure: 0,
      fuelFlow: 0,
      startupSequenceActive: false,
      shutdownSequenceActive: false,
      failed: false,
      failureType: null
    };
  }

  startEngine(): boolean {
    if (this.state.isRunning || this.state.startupSequenceActive || this.state.failed) {
      return false;
    }

    console.log("Engine startup sequence initiated");
    this.state.startupSequenceActive = true;
    this.startupTime = 0;
    return true;
  }

  shutdownEngine(): boolean {
    if (!this.state.isRunning || this.state.shutdownSequenceActive) {
      return false;
    }

    console.log("Engine shutdown sequence initiated");
    this.state.shutdownSequenceActive = true;
    this.shutdownTime = 0;
    return true;
  }

  update(delta: number, throttle: number, altitude: number): EngineState {
    // Handle startup sequence
    if (this.state.startupSequenceActive) {
      this.updateStartupSequence(delta);
    }

    // Handle shutdown sequence
    if (this.state.shutdownSequenceActive) {
      this.updateShutdownSequence(delta);
    }

    // Update engine parameters if running
    if (this.state.isRunning && !this.state.failed) {
      this.updateEngineParameters(delta, throttle, altitude);
    }

    // Check for random failures
    this.checkForFailures(delta);

    // Update active failures
    this.updateFailures(delta);

    return { ...this.state };
  }

  private updateStartupSequence(delta: number): void {
    this.startupTime += delta;

    if (this.startupTime < 2) {
      // Cranking phase
      this.state.rpm = 200 + Math.sin(this.startupTime * 10) * 50;
      this.state.oilPressure = 0;
      this.state.temperature = 20;
    } else if (this.startupTime < 5) {
      // Ignition phase
      this.state.rpm = 300 + (this.startupTime - 2) * 200;
      this.state.oilPressure = Math.min(30, (this.startupTime - 2) * 10);
      this.state.temperature = 20 + (this.startupTime - 2) * 5;
    } else {
      // Engine started
      console.log("Engine startup complete");
      this.state.startupSequenceActive = false;
      this.state.isRunning = true;
      this.state.rpm = 800; // Idle RPM
      this.state.oilPressure = 35;
      this.state.temperature = 35;
    }
  }

  private updateShutdownSequence(delta: number): void {
    this.shutdownTime += delta;

    if (this.shutdownTime < 3) {
      // Spooldown phase
      const progress = this.shutdownTime / 3;
      this.state.rpm = 800 * (1 - progress);
      this.state.oilPressure = 35 * (1 - progress);
      this.state.fuelFlow = 0;
    } else {
      // Engine stopped
      console.log("Engine shutdown complete");
      this.state.shutdownSequenceActive = false;
      this.state.isRunning = false;
      this.state.rpm = 0;
      this.state.oilPressure = 0;
      this.state.temperature = Math.max(20, this.state.temperature - delta * 5);
    }
  }

  private updateEngineParameters(delta: number, throttle: number, altitude: number): void {
    // Calculate target RPM based on throttle
    const idleRPM = 800;
    const maxRPM = 2700;
    const targetRPM = idleRPM + (maxRPM - idleRPM) * throttle;

    // Smooth RPM changes
    const rpmRate = 1000; // RPM per second
    if (this.state.rpm < targetRPM) {
      this.state.rpm = Math.min(targetRPM, this.state.rpm + rpmRate * delta);
    } else {
      this.state.rpm = Math.max(targetRPM, this.state.rpm - rpmRate * delta);
    }

    // Update oil pressure (dependent on RPM)
    const targetOilPressure = Math.min(80, 20 + (this.state.rpm / maxRPM) * 60);
    this.state.oilPressure += (targetOilPressure - this.state.oilPressure) * delta * 2;

    // Update temperature (affected by throttle and altitude)
    const ambientTemp = 20 - (altitude * 0.002); // Temperature decreases with altitude
    const targetTemp = ambientTemp + throttle * 60 + (this.state.rpm / maxRPM) * 40;
    this.state.temperature += (targetTemp - this.state.temperature) * delta * 0.5;

    // Update fuel flow
    this.state.fuelFlow = (throttle * 15 + 2) * (this.state.rpm / maxRPM);
  }

  private checkForFailures(delta: number): void {
    this.lastFailureCheck += delta;

    // Check for failures every 30 seconds
    if (this.lastFailureCheck < 30) return;
    this.lastFailureCheck = 0;

    // Very low probability of failure (1 in 1000 chance per check)
    if (Math.random() < 0.001) {
      this.triggerRandomFailure();
    }

    // Higher chance of overheating if running hot
    if (this.state.temperature > 120 && Math.random() < 0.01) {
      this.triggerFailure({
        type: 'engine',
        severity: 'critical',
        message: 'Engine overheating - emergency shutdown required',
        affectsEngine: true,
        duration: -1 // Permanent until repaired
      });
    }

    // Oil pressure failure
    if (this.state.oilPressure < 20 && this.state.isRunning && Math.random() < 0.005) {
      this.triggerFailure({
        type: 'engine',
        severity: 'critical',
        message: 'Low oil pressure - engine damage imminent',
        affectsEngine: true,
        duration: -1
      });
    }
  }

  private triggerRandomFailure(): void {
    const failures = [
      {
        type: 'fuel' as const,
        severity: 'caution' as const,
        message: 'Fuel pump pressure low',
        affectsEngine: false,
        duration: 60
      },
      {
        type: 'electrical' as const,
        severity: 'warning' as const,
        message: 'Alternator output low',
        affectsEngine: false,
        duration: 120
      },
      {
        type: 'engine' as const,
        severity: 'caution' as const,
        message: 'Engine roughness detected',
        affectsEngine: true,
        duration: 90
      },
      {
        type: 'hydraulic' as const,
        severity: 'warning' as const,
        message: 'Hydraulic pressure fluctuation',
        affectsEngine: false,
        duration: 180
      }
    ];

    const failure = failures[Math.floor(Math.random() * failures.length)];
    this.triggerFailure(failure);
  }

  private triggerFailure(failure: SystemFailure): void {
    console.log(`System failure: ${failure.message}`);
    this.failures.push({ ...failure });

    if (failure.affectsEngine && failure.severity === 'critical') {
      this.state.failed = true;
      this.state.failureType = failure.message;
      
      // Force engine shutdown on critical failure
      if (this.state.isRunning) {
        this.shutdownEngine();
      }
    }
  }

  private updateFailures(delta: number): void {
    this.failures = this.failures.filter(failure => {
      if (failure.duration > 0) {
        failure.duration -= delta;
        return failure.duration > 0;
      }
      return true; // Keep permanent failures
    });

    // If no critical engine failures remain, allow restart
    const criticalEngineFailures = this.failures.filter(
      f => f.type === 'engine' && f.severity === 'critical' && f.affectsEngine
    );

    if (criticalEngineFailures.length === 0 && this.state.failed) {
      this.state.failed = false;
      this.state.failureType = null;
      console.log("Engine can be restarted - critical failures resolved");
    }
  }

  getState(): EngineState {
    return { ...this.state };
  }

  getFailures(): SystemFailure[] {
    return [...this.failures];
  }

  // Manual failure repair (for gameplay)
  repairFailure(failureType: string): boolean {
    const index = this.failures.findIndex(f => f.message === failureType);
    if (index !== -1) {
      console.log(`Repairing failure: ${failureType}`);
      this.failures.splice(index, 1);
      return true;
    }
    return false;
  }

  // Emergency restart (bypasses some checks)
  emergencyRestart(): boolean {
    if (!this.state.failed || this.state.isRunning) {
      return false;
    }

    console.log("Emergency engine restart attempted");
    this.state.failed = false;
    this.state.failureType = null;
    return this.startEngine();
  }
}