export type MaterialCategory = 'PET' | 'ALUMINUM' | 'UNKNOWN';

export interface MaterialInfo {
  category: MaterialCategory;
  name: string;
  description: string;
  color: string;
  iconName: string;
}
