import { Html } from "@react-three/drei";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";
import { useState, useEffect } from "react";

export default function AdvancedInstruments() {
  const { position, rotation, speed, altitude, heading, verticalSpeed } = useFlightSimulator();
  const [showInstruments, setShowInstruments] = useState(true);
  const [gpsCoords, setGpsCoords] = useState({ lat: 0, lon: 0 });

  // Convert world position to GPS coordinates (simplified)
  useEffect(() => {
    const lat = 40.7128 + (position.z / 111111); // Approximate conversion
    const lon = -74.0060 + (position.x / 111111);
    setGpsCoords({ lat, lon });
  }, [position.x, position.z]);

  const pitchAngle = (rotation.x * 180 / Math.PI);
  const rollAngle = (rotation.z * 180 / Math.PI);
  const bankAngle = -rollAngle; // Bank is opposite of roll

  return (
    <Html fullscreen>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white font-mono pointer-events-auto">
        {/* Instrument panel toggle */}
        <button
          onClick={() => setShowInstruments(!showInstruments)}
          className="bg-black bg-opacity-70 hover:bg-opacity-90 p-2 rounded mb-2 transition-all duration-200 mx-auto block"
        >
          <div className="text-green-400 text-sm font-bold">INSTRUMENTS</div>
        </button>

        {showInstruments && (
          <div className="bg-black bg-opacity-80 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              
              {/* Enhanced Artificial Horizon */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-2">ARTIFICIAL HORIZON</div>
                <div className="relative w-24 h-24 bg-gradient-to-b from-blue-500 to-green-500 rounded-full overflow-hidden border-2 border-white">
                  {/* Sky/Ground division */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-b from-blue-500 to-green-500"
                    style={{
                      transform: `rotate(${bankAngle}deg) translateY(${pitchAngle * 2}px)`
                    }}
                  />
                  
                  {/* Pitch ladder marks */}
                  {[-30, -20, -10, 0, 10, 20, 30].map((pitch) => (
                    <div
                      key={pitch}
                      className="absolute left-1/2 border-t border-white opacity-60"
                      style={{
                        width: pitch === 0 ? '60%' : '30%',
                        top: `${50 - pitch * 1.5}%`,
                        transform: `translateX(-50%) rotate(${bankAngle}deg)`,
                        borderWidth: pitch === 0 ? '2px' : '1px'
                      }}
                    />
                  ))}
                  
                  {/* Aircraft symbol (fixed) */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-yellow-400 absolute -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-4 h-0.5 bg-yellow-400 absolute -translate-x-1/2 -translate-y-1/2 -ml-6"></div>
                    <div className="w-4 h-0.5 bg-yellow-400 absolute -translate-x-1/2 -translate-y-1/2 ml-6"></div>
                    <div className="w-0.5 h-3 bg-yellow-400 absolute -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                  
                  {/* Bank angle indicator */}
                  <div className="absolute -top-1 left-1/2 w-0.5 h-3 bg-white transform -translate-x-1/2"></div>
                  
                  {/* Bank scale */}
                  {[-60, -45, -30, -20, -10, 0, 10, 20, 30, 45, 60].map((angle) => (
                    <div
                      key={angle}
                      className="absolute top-0 left-1/2 w-0.5 bg-white origin-bottom"
                      style={{
                        height: angle % 30 === 0 ? '6px' : '3px',
                        transform: `translateX(-50%) rotate(${angle}deg) translateY(48px)`
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs mt-1">
                  P: {pitchAngle.toFixed(0)}° | B: {bankAngle.toFixed(0)}°
                </div>
              </div>

              {/* Compass */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-2">COMPASS</div>
                <div className="relative w-24 h-24 bg-black rounded-full border-2 border-white">
                  {/* Compass rose */}
                  <div 
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, #333 0deg, #555 90deg, #333 180deg, #555 270deg, #333 360deg)',
                      transform: `rotate(${-heading}deg)`
                    }}
                  >
                    {/* Cardinal directions */}
                    {[
                      { angle: 0, label: 'N', color: 'text-red-400' },
                      { angle: 90, label: 'E', color: 'text-white' },
                      { angle: 180, label: 'S', color: 'text-white' },
                      { angle: 270, label: 'W', color: 'text-white' }
                    ].map(({ angle, label, color }) => (
                      <div
                        key={angle}
                        className={`absolute text-xs font-bold ${color}`}
                        style={{
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-32px) rotate(${-angle}deg)`
                        }}
                      >
                        {label}
                      </div>
                    ))}
                    
                    {/* Degree markers */}
                    {Array.from({ length: 36 }, (_, i) => i * 10).map((angle) => (
                      <div
                        key={angle}
                        className="absolute w-0.5 bg-white origin-bottom"
                        style={{
                          height: angle % 30 === 0 ? '8px' : '4px',
                          top: '2px',
                          left: '50%',
                          transform: `translateX(-50%) rotate(${angle}deg) translateY(0px)`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Fixed aircraft heading indicator */}
                  <div className="absolute top-1 left-1/2 w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-yellow-400 transform -translate-x-1/2"></div>
                </div>
                <div className="text-xs mt-1">HDG: {heading.toFixed(0)}°</div>
              </div>

              {/* GPS and Navigation */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-2">GPS NAV</div>
                <div className="bg-gray-800 p-2 rounded text-xs">
                  <div className="mb-2">
                    <div className="text-yellow-400 font-bold">POSITION</div>
                    <div>LAT: {gpsCoords.lat.toFixed(4)}°</div>
                    <div>LON: {gpsCoords.lon.toFixed(4)}°</div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-yellow-400 font-bold">ALTITUDE</div>
                    <div>{altitude.toFixed(0)} ft MSL</div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-yellow-400 font-bold">GROUND SPEED</div>
                    <div>{(speed * 1.94384).toFixed(0)} kts</div>
                  </div>
                  
                  <div>
                    <div className="text-yellow-400 font-bold">WAYPOINT</div>
                    <div className="text-gray-400">DIRECT</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional flight instruments row */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {/* Vertical Speed Indicator */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-1">V/S</div>
                <div className="bg-gray-800 p-2 rounded h-12 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    {verticalSpeed > 0 ? '+' : ''}{verticalSpeed.toFixed(0)} fpm
                  </div>
                  {/* Vertical speed tape */}
                  <div 
                    className="absolute left-1 w-0.5 bg-green-400 transition-all duration-300"
                    style={{
                      height: `${Math.min(Math.abs(verticalSpeed) / 20, 100)}%`,
                      bottom: verticalSpeed < 0 ? '50%' : 'auto',
                      top: verticalSpeed >= 0 ? '50%' : 'auto',
                      backgroundColor: verticalSpeed > 1000 ? '#ef4444' : verticalSpeed < -1000 ? '#ef4444' : '#10b981'
                    }}
                  />
                </div>
              </div>

              {/* Turn Coordinator */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-1">TURN</div>
                <div className="bg-gray-800 p-2 rounded h-12 relative">
                  <div 
                    className="absolute top-1/2 left-1/2 w-1 h-6 bg-white transform -translate-x-1/2 -translate-y-1/2 origin-bottom"
                    style={{ transform: `translate(-50%, -50%) rotate(${bankAngle * 0.5}deg)` }}
                  ></div>
                  <div className="absolute bottom-1 left-2 w-1 h-1 bg-yellow-400"></div>
                  <div className="absolute bottom-1 right-2 w-1 h-1 bg-yellow-400"></div>
                </div>
              </div>

              {/* Heading Indicator (Digital) */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-1">HDG</div>
                <div className="bg-gray-800 p-2 rounded h-12 flex items-center justify-center text-lg font-mono">
                  {heading.toFixed(0).padStart(3, '0')}°
                </div>
              </div>

              {/* Altitude Trend */}
              <div className="text-center">
                <div className="text-green-400 text-xs font-bold mb-1">ALT</div>
                <div className="bg-gray-800 p-2 rounded h-12 flex items-center justify-center text-sm">
                  {altitude.toFixed(0)} ft
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
}