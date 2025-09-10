import { Html } from "@react-three/drei";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";
import { WeatherSystem } from "../lib/weatherSystem";
import { useState } from "react";

export default function WeatherControl() {
  const { weatherConditions, setWeatherConditions } = useFlightSimulator();
  const [showPanel, setShowPanel] = useState(false);

  const applyWeatherPreset = (presetName: string) => {
    let preset;
    switch (presetName) {
      case 'calm':
        preset = WeatherSystem.getCalmWeather();
        break;
      case 'turbulent':
        preset = WeatherSystem.getTurbulentWeather();
        break;
      case 'stormy':
        preset = WeatherSystem.getStormyWeather();
        break;
      default:
        preset = WeatherSystem.getCalmWeather();
    }
    setWeatherConditions(preset);
    console.log(`Applied ${presetName} weather conditions`);
  };

  return (
    <Html fullscreen>
      <div className="fixed top-20 right-4 text-white font-mono pointer-events-auto z-10">
        {/* Weather toggle button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 p-2 rounded mb-2 transition-all duration-200"
        >
          <div className="text-green-400 text-sm font-bold">WEATHER</div>
          <div className="text-xs">
            Wind: {weatherConditions.windSpeed} kts
          </div>
        </button>

        {/* Weather control panel */}
        {showPanel && (
          <div className="bg-black bg-opacity-80 p-4 rounded max-w-xs">
            <div className="text-green-400 text-sm font-bold mb-3">WEATHER CONDITIONS</div>
            
            {/* Current conditions display */}
            <div className="space-y-1 text-xs mb-4">
              <div>Wind Speed: {weatherConditions.windSpeed.toFixed(0)} kts</div>
              <div>Turbulence: {(weatherConditions.turbulenceIntensity * 10).toFixed(1)}/10</div>
              <div>Visibility: {weatherConditions.visibility.toFixed(0)} mi</div>
              <div>Cloud Cover: {(weatherConditions.cloudCover * 100).toFixed(0)}%</div>
              <div>Temperature: {weatherConditions.temperature.toFixed(0)}°C</div>
            </div>

            {/* Weather presets */}
            <div className="space-y-2">
              <div className="text-yellow-400 text-xs font-bold">PRESETS:</div>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => applyWeatherPreset('calm')}
                  className="bg-green-700 hover:bg-green-600 p-1 rounded text-xs transition-colors duration-200"
                >
                  Calm (5 kts, clear)
                </button>
                <button
                  onClick={() => applyWeatherPreset('turbulent')}
                  className="bg-yellow-700 hover:bg-yellow-600 p-1 rounded text-xs transition-colors duration-200"
                >
                  Turbulent (25 kts)
                </button>
                <button
                  onClick={() => applyWeatherPreset('stormy')}
                  className="bg-red-700 hover:bg-red-600 p-1 rounded text-xs transition-colors duration-200"
                >
                  Stormy (35 kts, poor vis)
                </button>
              </div>
            </div>

            {/* Wind indicator */}
            <div className="mt-4 pt-2 border-t border-gray-600">
              <div className="text-yellow-400 text-xs font-bold mb-1">WIND INDICATOR</div>
              <div className="relative w-16 h-16 mx-auto bg-gray-800 rounded-full border border-gray-600">
                {/* Wind direction arrow */}
                <div 
                  className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-yellow-400"
                  style={{
                    transformOrigin: 'bottom center',
                    transform: `translateX(-50%) rotate(${Math.atan2(weatherConditions.windDirection.x, -weatherConditions.windDirection.z) * 180 / Math.PI}deg)`
                  }}
                />
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
              </div>
              <div className="text-center text-xs mt-1">
                {weatherConditions.windSpeed.toFixed(0)} kts
              </div>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}