export type Tier = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export type Category = 'original' | 'ultra' | 'juice' | 'cafe' | 'rehab';

export interface CatalogMonster {
  id: string;
  name: string;
  category: Category;
  flavorProfile: string;
  description: string;
  imagePath: string;
}

export interface InventoryEntry {
  catalogId: string;
  quantity: number;
  rating: number;
  tier: Tier;
  notes: string;
  dateAdded: string;
}

export interface MonsterWithInventory extends CatalogMonster {
  inventory?: InventoryEntry;
}
