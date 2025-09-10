import { useFlightSimulator } from "../lib/stores/useFlightSimulator";

export default function EngineDisplay() {
  const { engineState, systemFailures, repairFailure, emergencyRestart } = useFlightSimulator();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg font-mono text-sm min-w-[280px]">
      <h3 className="text-lg font-bold mb-3 text-center border-b border-gray-500 pb-1">
        ENGINE SYSTEMS
      </h3>
      
      {/* Engine Status */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Status:</span>
          <span className={`font-bold ${
            engineState.failed ? 'text-red-500' : 
            engineState.isRunning ? 'text-green-500' : 
            engineState.startupSequenceActive ? 'text-yellow-500' : 
            engineState.shutdownSequenceActive ? 'text-orange-500' : 'text-gray-500'
          }`}>
            {engineState.failed ? 'FAILED' :
             engineState.isRunning ? 'RUNNING' :
             engineState.startupSequenceActive ? 'STARTING' :
             engineState.shutdownSequenceActive ? 'SHUTTING DOWN' : 'OFF'}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>RPM: <span className="text-cyan-400">{engineState.rpm.toFixed(0)}</span></div>
          <div>TEMP: <span className={`${engineState.temperature > 100 ? 'text-red-400' : 'text-cyan-400'}`}>
            {engineState.temperature.toFixed(0)}°C
          </span></div>
          <div>OIL PSI: <span className={`${engineState.oilPressure < 20 ? 'text-red-400' : 'text-cyan-400'}`}>
            {engineState.oilPressure.toFixed(0)}
          </span></div>
          <div>FUEL GPH: <span className="text-cyan-400">{engineState.fuelFlow.toFixed(1)}</span></div>
        </div>
      </div>

      {/* Engine Controls */}
      <div className="mb-4 text-xs">
        <div className="text-gray-400 mb-1">Controls:</div>
        <div>S - Start Engine</div>
        <div>X - Shutdown Engine</div>
        <div>SHIFT+PAGEUP/PAGEDOWN - Throttle</div>
      </div>

      {/* System Failures */}
      {systemFailures.length > 0 && (
        <div className="border-t border-gray-500 pt-3">
          <div className="text-red-400 font-bold mb-2">SYSTEM FAILURES:</div>
          <div className="max-h-32 overflow-y-auto">
            {systemFailures.map((failure, index) => (
              <div key={index} className={`mb-2 p-2 rounded text-xs ${
                failure.severity === 'critical' ? 'bg-red-900 bg-opacity-50' :
                failure.severity === 'caution' ? 'bg-yellow-900 bg-opacity-50' :
                'bg-orange-900 bg-opacity-50'
              }`}>
                <div className={`font-bold ${
                  failure.severity === 'critical' ? 'text-red-400' :
                  failure.severity === 'caution' ? 'text-yellow-400' :
                  'text-orange-400'
                }`}>
                  {failure.severity.toUpperCase()}
                </div>
                <div className="text-white">{failure.message}</div>
                {failure.duration > 0 && (
                  <div className="text-gray-400">
                    Time remaining: {failure.duration.toFixed(0)}s
                  </div>
                )}
                <button
                  onClick={() => repairFailure(failure.message)}
                  className="mt-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded"
                >
                  REPAIR
                </button>
              </div>
            ))}
          </div>
          
          {engineState.failed && (
            <button
              onClick={emergencyRestart}
              className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded"
            >
              EMERGENCY RESTART
            </button>
          )}
        </div>
      )}
    </div>
  );
}