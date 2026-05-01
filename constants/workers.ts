import { WorkerProfile, WorkerRole } from '../types';

export const GLOBAL_WORKER_POOL: WorkerProfile[] = [
  { 
    id: 'W-01', name: 'Dr. Sarah Chen', esin: 'EA-WORK-1101', role: 'BIOTECH_ANALYST', 
    skills: ['Genetic Sequencing', 'Seed Quality', 'Soil Ph'], sustainabilityRating: 98, verifiedHours: 2400, 
    isOpenToWork: true, lifetimeEAC: 12000, efficiency: 95, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', 
    location: 'California Hub', availability: 'AVAILABLE' 
  },
  { 
    id: 'W-02', name: 'Marcus T.', esin: 'EA-WORK-1102', role: 'DRONE_OPERATOR', 
    skills: ['Fleet Sync', 'Lidar Mapping', 'Telemetry'], sustainabilityRating: 85, verifiedHours: 820, 
    isOpenToWork: true, lifetimeEAC: 4500, efficiency: 88, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', 
    location: 'Nairobi Ingest', availability: 'OCCUPIED' 
  },
  { 
    id: 'W-03', name: 'Elena Rodriguez', esin: 'EA-WORK-1103', role: 'HARVEST_SPECIALIST', 
    skills: ['Precision Picking', 'Post-Harvest', 'Quality Audit'], sustainabilityRating: 92, verifiedHours: 1560, 
    isOpenToWork: true, lifetimeEAC: 8900, efficiency: 91, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150', 
    location: 'Valencia Shard', availability: 'AVAILABLE' 
  },
  { 
    id: 'W-04', name: 'Kofi Mensah', esin: 'EA-WORK-1104', role: 'FIELD_TECHNICIAN', 
    skills: ['IoT Maintenance', 'Irrigation', 'Solar Panels'], sustainabilityRating: 94, verifiedHours: 3100, 
    isOpenToWork: true, lifetimeEAC: 15600, efficiency: 97, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150', 
    location: 'Accra Node', availability: 'AVAILABLE' 
  },
  { 
    id: 'W-05', name: 'Yuki Tanaka', esin: 'EA-WORK-1105', role: 'LOGISTICS_COORDINATOR', 
    skills: ['Supply Chain', 'Warehousing', 'Transit Optimization'], sustainabilityRating: 89, verifiedHours: 1200, 
    isOpenToWork: true, lifetimeEAC: 6700, efficiency: 85, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', 
    location: 'Osaka Port', availability: 'OFFLINE' 
  },
  { 
    id: 'W-06', name: 'Aria Vance', esin: 'EA-WORK-1106', role: 'SUSTAINABILITY_AUDITOR', 
    skills: ['Carbon MRV', 'ESG Reporting', 'Registry Sync'], sustainabilityRating: 99, verifiedHours: 4200, 
    isOpenToWork: true, lifetimeEAC: 25000, efficiency: 99, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150', 
    location: 'London Shard', availability: 'AVAILABLE' 
  },
];

export const ROLE_DETAILS: Record<WorkerRole, { label: string; desc: string }> = {
  FIELD_TECHNICIAN: { label: 'Field Technician', desc: 'Hardware deployment and physical layer maintenance.' },
  DRONE_OPERATOR: { label: 'Drone Operator', desc: 'Aerial mapping and autonomous swarm management.' },
  HARVEST_SPECIALIST: { label: 'Harvest Specialist', desc: 'Precision gathering and high-load quality control.' },
  LOGISTICS_COORDINATOR: { label: 'Logistics Coordinator', desc: 'Supply shard routing and chain optimization.' },
  BIOTECH_ANALYST: { label: 'Biotech Analyst', desc: 'Genetic auditing and laboratory process sharding.' },
  SUSTAINABILITY_AUDITOR: { label: 'Sustainability Auditor', desc: 'Verification of ecological proofs and carbon yields.' },
  AGRO_ENGINEER: { label: 'Agro Engineer', desc: 'System-level architecture and organizational resonance.' },
  BOT_SYSTEM_OVERSEER: { label: 'Bot System Overseer', desc: 'Management and maintenance of autonomous bot swarms.' },
};
