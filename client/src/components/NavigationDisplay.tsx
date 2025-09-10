import { useFlightSimulator } from "../lib/stores/useFlightSimulator";
import { waypoints, type Waypoint } from "../lib/navigationData";
import { useState } from "react";

export default function NavigationDisplay() {
  const { position } = useFlightSimulator();
  const [showNav, setShowNav] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);

  // Calculate distance and bearing to waypoints
  const getWaypointInfo = (waypoint: Waypoint) => {
    const dx = waypoint.position[0] - position.x;
    const dz = waypoint.position[2] - position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const bearing = (Math.atan2(dx, -dz) * 180 / Math.PI + 360) % 360;
    
    return {
      distance: distance * 0.000539957, // Convert to nautical miles
      bearing
    };
  };

  // Find nearest waypoints
  const nearbyWaypoints = waypoints
    .map(waypoint => ({ 
      ...waypoint, 
      ...getWaypointInfo(waypoint) 
    }))
    .filter(wp => wp.distance < 50) // Within 50 nautical miles
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8);

  return (
    <div className="fixed top-4 right-80 z-10 text-white font-mono pointer-events-auto bg-black bg-opacity-80 p-2 rounded">
      {/* Navigation toggle button */}
      <button
        onClick={() => setShowNav(!showNav)}
        className="bg-black bg-opacity-70 hover:bg-opacity-90 p-2 rounded mb-2 transition-all duration-200"
      >
        <div className="text-green-400 text-xs font-bold">NAV</div>
        <div className="text-xs">
          {nearbyWaypoints.length} pts
        </div>
      </button>

        {/* Navigation panel */}
        {showNav && (
          <div className="bg-black bg-opacity-80 p-3 rounded max-w-sm">
            <div className="text-green-400 text-sm font-bold mb-3">NAVIGATION POINTS</div>
            
            {/* Selected waypoint info */}
            {selectedWaypoint && (
              <div className="bg-blue-900 bg-opacity-50 p-2 rounded mb-3 text-xs">
                <div className="text-yellow-400 font-bold">{selectedWaypoint.name}</div>
                <div className="text-gray-300 mb-1">{selectedWaypoint.description}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400">DIST:</span> {getWaypointInfo(selectedWaypoint).distance.toFixed(1)} NM
                  </div>
                  <div>
                    <span className="text-gray-400">BRG:</span> {getWaypointInfo(selectedWaypoint).bearing.toFixed(0)}°
                  </div>
                </div>
              </div>
            )}

            {/* Waypoint list */}
            <div className="space-y-1 text-xs max-h-64 overflow-y-auto">
              {nearbyWaypoints.length === 0 ? (
                <div className="text-gray-400 text-center py-2">
                  No waypoints within 50 NM
                </div>
              ) : (
                nearbyWaypoints.map((waypoint) => (
                  <div
                    key={waypoint.id}
                    className={`flex justify-between items-center p-2 rounded cursor-pointer transition-colors duration-200 ${
                      selectedWaypoint?.id === waypoint.id
                        ? 'bg-blue-700 bg-opacity-50'
                        : 'bg-gray-800 bg-opacity-30 hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedWaypoint(
                      selectedWaypoint?.id === waypoint.id ? null : waypoint
                    )}
                  >
                    <div className="flex-1">
                      <div className="font-bold">{waypoint.name}</div>
                      <div className="text-gray-400">{waypoint.type.toUpperCase()}</div>
                    </div>
                    
                    <div className="text-right">
                      <div>{waypoint.distance.toFixed(1)} NM</div>
                      <div className="text-gray-400">{waypoint.bearing.toFixed(0)}°</div>
                    </div>
                    
                    {/* Type indicator */}
                    <div className="ml-2">
                      {waypoint.type === 'airport' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {waypoint.type === 'navigation' && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {waypoint.type === 'landmark' && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Legend */}
            <div className="mt-3 pt-2 border-t border-gray-600 text-xs">
              <div className="text-yellow-400 font-bold mb-1">LEGEND</div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  <span>Airport</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span>VOR</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  <span>Landmark</span>
                </div>
              </div>
            </div>

            {/* Mini compass for selected waypoint */}
            {selectedWaypoint && (
              <div className="mt-3 pt-2 border-t border-gray-600">
                <div className="text-yellow-400 text-xs font-bold mb-1">BEARING TO {selectedWaypoint.name}</div>
                <div className="relative w-16 h-16 mx-auto bg-gray-800 rounded-full border border-gray-600">
                  <div 
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-yellow-400"
                    style={{
                      transformOrigin: 'bottom center',
                      transform: `translateX(-50%) rotate(${getWaypointInfo(selectedWaypoint).bearing}deg)`
                    }}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            )}
          </div>
        )}
    </div>
  );
}