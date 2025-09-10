interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface PhysicsState {
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  throttle: number;
  fuel: number;
}

interface Controls {
  pitchUp: boolean;
  pitchDown: boolean;
  yawLeft: boolean;
  yawRight: boolean;
  rollLeft: boolean;
  rollRight: boolean;
}

interface AircraftData {
  maxSpeed: number;
  maneuverability: number;
  fuelEfficiency: number;
  maxThrust: number;
  liftCoefficient: number;
  dragCoefficient: number;
}

export function updatePhysics({
  position,
  rotation,
  velocity,
  throttle,
  fuel,
  controls,
  aircraft,
  delta
}: {
  position: Vector3;
  rotation: Vector3;
  velocity: Vector3;
  throttle: number;
  fuel: number;
  controls: Controls;
  aircraft: AircraftData;
  delta: number;
}): PhysicsState {
  
  const newState = {
    position: { ...position },
    rotation: { ...rotation },
    velocity: { ...velocity },
    throttle,
    fuel
  };

  // Only apply physics if we have fuel
  if (fuel <= 0) {
    // Glide mode - gradual descent
    newState.velocity.y -= 9.81 * delta * 0.5; // Reduced gravity in glide
    newState.velocity.x *= 0.99; // Air resistance
    newState.velocity.z *= 0.99;
  } else {
    // Fuel consumption
    const fuelConsumption = (throttle * 0.5 + 0.1) * delta * (11 - aircraft.fuelEfficiency);
    newState.fuel = Math.max(0, fuel - fuelConsumption);

    // Control inputs
    const pitchRate = aircraft.maneuverability * 0.02 * delta;
    const yawRate = aircraft.maneuverability * 0.01 * delta;
    const rollRate = aircraft.maneuverability * 0.03 * delta;

    if (controls.pitchUp) newState.rotation.x -= pitchRate;
    if (controls.pitchDown) newState.rotation.x += pitchRate;
    if (controls.yawLeft) newState.rotation.y -= yawRate;
    if (controls.yawRight) newState.rotation.y += yawRate;
    if (controls.rollLeft) newState.rotation.z -= rollRate;
    if (controls.rollRight) newState.rotation.z += rollRate;

    // Limit rotation ranges
    newState.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, newState.rotation.x));
    newState.rotation.z = Math.max(-Math.PI/2, Math.min(Math.PI/2, newState.rotation.z));

    // Thrust
    const thrust = throttle * aircraft.maxThrust * delta;
    
    // Calculate forward direction
    const forward = {
      x: Math.sin(newState.rotation.y) * Math.cos(newState.rotation.x),
      y: -Math.sin(newState.rotation.x),
      z: -Math.cos(newState.rotation.y) * Math.cos(newState.rotation.x)
    };

    // Apply thrust in forward direction
    newState.velocity.x += forward.x * thrust;
    newState.velocity.y += forward.y * thrust;
    newState.velocity.z += forward.z * thrust;

    // Basic lift calculation (simplified)
    const speed = Math.sqrt(newState.velocity.x ** 2 + newState.velocity.z ** 2);
    const lift = speed * aircraft.liftCoefficient * delta;
    
    // Lift affects upward velocity, modified by pitch
    if (speed > 10) { // Need minimum speed for lift
      newState.velocity.y += lift * Math.cos(newState.rotation.x);
    }
  }

  // Gravity
  newState.velocity.y -= 9.81 * delta;

  // Air resistance/drag
  const speedFactor = Math.sqrt(newState.velocity.x ** 2 + newState.velocity.y ** 2 + newState.velocity.z ** 2);
  const dragForce = aircraft.dragCoefficient * speedFactor * delta;
  
  if (speedFactor > 0) {
    newState.velocity.x *= (1 - dragForce);
    newState.velocity.y *= (1 - dragForce * 0.5); // Less drag on vertical movement
    newState.velocity.z *= (1 - dragForce);
  }

  // Update position
  newState.position.x += newState.velocity.x * delta;
  newState.position.y += newState.velocity.y * delta;
  newState.position.z += newState.velocity.z * delta;

  // Auto-level tendency (realistic aircraft behavior)
  if (Math.abs(controls.rollLeft ? 1 : controls.rollRight ? -1 : 0) < 0.1) {
    newState.rotation.z *= 0.95; // Gradually return to level
  }

  return newState;
}
