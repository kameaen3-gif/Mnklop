export type Humor = 'damavi' | 'safravi' | 'balghami' | 'sawdawi';

export type TemperamentKey = 
  | 'damavi' 
  | 'safravi' 
  | 'balghami' 
  | 'sawdawi' 
  | 'damavi_safravi' 
  | 'safravi_sawdawi' 
  | 'balghami_sawdawi' 
  | 'damavi_balghami' 
  | 'motedal';

export interface Question {
  category: string;
  q: string;
  opts: [string, string, string, string];
  // An array of 4 scores (dam, safra, balgham, sawda) for each of the 4 options
  scores: [
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number],
    [number, number, number, number]
  ];
}

export interface FoodItem {
  name: string;
  note: string;
}

export interface Recipe {
  name: string;
  emoji: string;
  time: string;
  serves: string;
  ingredients: string[];
  method: string[];
  benefit: string;
}

export interface MealPlanDay {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

export interface TreatmentItem {
  name: string;
  desc: string;
}

export interface TreatmentSection {
  oils: TreatmentItem[];
  teas: TreatmentItem[];
  aromas: TreatmentItem[];
  seasons: TreatmentItem[];
}

export interface Lifestyle {
  sleep: string;
  bath: string;
  climate: string;
  clothes: string;
  mental: string;
  seasons: string;
}

export interface Remedy {
  cause: string;
  treatment: string;
}

export interface TemperamentData {
  title: string;
  subtitle: string;
  icon: string;
  desc: string;
  traits: string[];
  deep: Record<string, string>;
  helpful: FoodItem[];
  harmful: FoodItem[];
  recipes: Recipe[];
  meals: MealPlanDay[];
  treatments: TreatmentSection;
  lifestyle: Lifestyle;
  remedies: Record<string, Remedy>;
  spouse: string;
  compatibility: Record<Humor, number>;
}
