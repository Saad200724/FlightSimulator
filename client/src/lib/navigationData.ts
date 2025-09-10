export interface Waypoint {
  id: string;
  name: string;
  position: [number, number, number];
  type: 'airport' | 'navigation' | 'landmark';
  description: string;
}

export const waypoints: Waypoint[] = [
  {
    id: 'KJFK',
    name: 'JFK International',
    position: [300, 0, -200],
    type: 'airport',
    description: 'Major international airport with multiple runways'
  },
  {
    id: 'KLGA',
    name: 'LaGuardia Airport',
    position: [-400, 0, 150],
    type: 'airport',
    description: 'Regional airport in Queens, NY'
  },
  {
    id: 'TEBN',
    name: 'Teterboro Airport',
    position: [-100, 0, 250],
    type: 'airport',
    description: 'General aviation airport'
  },
  {
    id: 'NAV01',
    name: 'Hudson VOR',
    position: [0, 0, 0],
    type: 'navigation',
    description: 'VOR navigation beacon'
  },
  {
    id: 'NAV02',
    name: 'Central Park',
    position: [150, 0, 100],
    type: 'landmark',
    description: 'Famous urban park landmark'
  },
  {
    id: 'NAV03',
    name: 'Brooklyn Bridge',
    position: [200, 0, -50],
    type: 'landmark',
    description: 'Historic suspension bridge'
  },
  {
    id: 'NAV04',
    name: 'Statue of Liberty',
    position: [250, 0, -100],
    type: 'landmark',
    description: 'Iconic statue and landmark'
  },
  {
    id: 'NAV05',
    name: 'Bear Mountain',
    position: [-600, 0, 400],
    type: 'landmark',
    description: 'Mountain peak north of NYC'
  }
];