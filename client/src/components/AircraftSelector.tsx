import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFlightSimulator } from "../lib/stores/useFlightSimulator";
import { aircraftData } from "../lib/aircraftData";

export default function AircraftSelector() {
  const { setSelectedAircraft, setGamePhase } = useFlightSimulator();

  const handleAircraftSelect = (aircraftKey: string) => {
    setSelectedAircraft(aircraftKey);
    setGamePhase('flying');
    console.log("Selected aircraft:", aircraftKey);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Flight Simulator</h1>
          <p className="text-white/80 text-lg">Choose your aircraft</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(aircraftData).map(([key, aircraft]) => (
            <Card key={key} className="bg-white/90 backdrop-blur hover:bg-white/95 transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-xl">{aircraft.name}</CardTitle>
                <CardDescription>{aircraft.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Speed:</span>
                    <span className="font-semibold">{aircraft.maxSpeed} kts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maneuverability:</span>
                    <span className="font-semibold">{aircraft.maneuverability}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fuel Efficiency:</span>
                    <span className="font-semibold">{aircraft.fuelEfficiency}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-semibold capitalize">{aircraft.type}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleAircraftSelect(key)}
                  className="w-full"
                  style={{ backgroundColor: aircraft.color }}
                >
                  Select {aircraft.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
