export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface MonsterEnergy {
  id: number;
  name: string;
  flavorProfile: string;
  tier: Tier;
  imagePath: string;
  notes: string;
}