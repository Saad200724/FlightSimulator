import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";

enum Controls {
  cameraSwitch = 'cameraSwitch'
}

export default function CameraController() {
  const { camera } = useThree();
  const [, getControls] = useKeyboardControls<Controls>();
  const { position, rotation, cameraMode, setCameraMode } = useFlightSimulator();
  const lastCameraSwitchRef = useRef(false);

  useFrame(() => {
    const controls = getControls();
    
    // Handle camera switching
    if (controls.cameraSwitch && !lastCameraSwitchRef.current) {
      const modes = ['chase', 'cockpit', 'free'];
      const currentIndex = modes.indexOf(cameraMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      setCameraMode(nextMode as any);
      console.log("Camera mode switched to:", nextMode);
    }
    lastCameraSwitchRef.current = controls.cameraSwitch;

    // Update camera position based on mode
    const aircraftPosition = new THREE.Vector3(position.x, position.y, position.z);
    const aircraftRotation = new THREE.Euler(rotation.x, rotation.y, rotation.z);

    switch (cameraMode) {
      case 'chase':
        // Chase camera - follow behind the aircraft
        const offset = new THREE.Vector3(0, 3, 10);
        offset.applyEuler(aircraftRotation);
        camera.position.copy(aircraftPosition.clone().add(offset));
        camera.lookAt(aircraftPosition);
        break;

      case 'cockpit':
        // Cockpit camera - inside the aircraft
        const cockpitOffset = new THREE.Vector3(0, 0.5, 1);
        cockpitOffset.applyEuler(aircraftRotation);
        camera.position.copy(aircraftPosition.clone().add(cockpitOffset));
        
        // Look forward from aircraft
        const lookDirection = new THREE.Vector3(0, 0, -1);
        lookDirection.applyEuler(aircraftRotation);
        camera.lookAt(aircraftPosition.clone().add(lookDirection));
        break;

      case 'free':
        // Free camera - smooth follow with more distance
        const freeOffset = new THREE.Vector3(-5, 8, 15);
        freeOffset.applyEuler(aircraftRotation);
        const targetPosition = aircraftPosition.clone().add(freeOffset);
        
        // Smooth camera movement
        camera.position.lerp(targetPosition, 0.05);
        camera.lookAt(aircraftPosition);
        break;
    }
  });

  return null;
}
