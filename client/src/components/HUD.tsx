import { Html } from "@react-three/drei";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";

export default function HUD() {
  const { altitude, speed, heading, fuel, throttle } = useFlightSimulator();

  return (
    <Html fullscreen>
      <div className="fixed inset-0 pointer-events-none text-white font-mono">
        {/* Top left - Flight data */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 p-4 rounded">
          <div className="text-green-400 text-lg font-bold mb-2">FLIGHT DATA</div>
          <div className="space-y-1">
            <div>ALT: {altitude.toFixed(0)} ft</div>
            <div>SPD: {speed.toFixed(1)} kts</div>
            <div>HDG: {heading.toFixed(0)}°</div>
            <div>THR: {(throttle * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Top right - Fuel gauge */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-4 rounded">
          <div className="text-green-400 text-lg font-bold mb-2">FUEL</div>
          <div className="w-20 h-4 border border-white bg-black">
            <div 
              className={`h-full transition-all duration-300 ${
                fuel > 25 ? 'bg-green-500' : fuel > 10 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${fuel}%` }}
            />
          </div>
          <div className="text-center mt-1">{fuel.toFixed(1)}%</div>
        </div>

        {/* Bottom center - Artificial horizon */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 p-4 rounded">
          <div className="w-32 h-32 border border-white bg-gradient-to-b from-blue-500 to-green-500 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-0.5 bg-white"></div>
              <div className="w-4 h-0.5 bg-white ml-2"></div>
              <div className="w-4 h-0.5 bg-white ml-2"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Bottom left - Controls help */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 p-4 rounded text-sm">
          <div className="text-green-400 font-bold mb-2">CONTROLS</div>
          <div className="space-y-1">
            <div>W/S: Throttle</div>
            <div>I/K: Pitch</div>
            <div>A/D: Yaw</div>
            <div>J/L: Roll</div>
            <div>C: Camera</div>
            <div>R: Reset</div>
          </div>
        </div>

        {/* Bottom right - Status */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-4 rounded">
          <div className="text-green-400 font-bold mb-2">STATUS</div>
          <div className="space-y-1">
            <div className={fuel > 0 ? "text-green-400" : "text-red-400"}>
              {fuel > 0 ? "ENGINE OK" : "NO FUEL"}
            </div>
            <div className={altitude > 5 ? "text-green-400" : "text-yellow-400"}>
              {altitude > 5 ? "AIRBORNE" : "GROUND"}
            </div>
          </div>
        </div>

        {/* Center crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-0.5 bg-white absolute -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-0.5 h-8 bg-white absolute -translate-x-1/2 -translate-y-1/2"></div>
            <div className="w-2 h-2 border border-white absolute -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          </div>
        </div>
      </div>
    </Html>
  );
}
