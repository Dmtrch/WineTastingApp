export type WineType = 'dry' | 'semi-dry' | 'semi-sweet' | 'sweet' | 'dessert';
export type WineCategory = 'still' | 'sparkling';
export type WineColor = 'red' | 'white' | 'rose' | 'orange' | 'glou-glou' | 'other';

export interface GrapeVariety {
  name: string;
  percentage: number;
}

export interface TastingNotes {
  colorNotes: string;
  density: string;
  firstNose: string;
  aromaAfterAeration: string;
  taste: string;
  tannins: string;
  acidity: string;
  sweetness: string;
  balance: string;
  associations: string;
  consumptionDate: string;
}

export interface PersonalVerdict {
  verdict: 'mine' | 'not-mine';
  take: boolean;
  other: string;
}

export interface Photos {
  bottlePhoto: string | null;
  labelPhoto: string | null;
  backLabelPhoto: string | null;
  plaquePhoto: string | null;
}

export interface WineRecord {
  wineryName: string;
  wineName: string;
  harvestYear: string;
  bottlingYear: string;
  grapeVarieties: GrapeVariety[];
  winemaker: string;
  owner: string;
  country: string;
  region: string;
  sugarContent: string;
  alcoholContent: string;
  wineType: WineType;
  wineCategory: WineCategory;
  wineColor: WineColor;
  price: string;
  tastingNotes: TastingNotes;
  personalVerdict: PersonalVerdict;
  photos: Photos;
}