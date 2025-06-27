// src/store/store.ts
import { create } from 'zustand';
//properly explained by https://youtu.be/_ngCLZ5Iz-0?si=fzAANgrCeormZQBO
//channel name cosden solutions
type HealthFactor = {
  [key: string]: number;
};

interface HealthStore {
  factors: HealthFactor;
  setFactor: (name: string, value: number) => void;
}

export const useHealthStore = create<HealthStore>((set) => ({
  factors: {
    'Age':18,
    'Gender': 1,
    'Air Pollution': 1,
    'Alcohol use': 1,
    'Dust Allergy': 1,
    'OccuPational Hazards': 1,  // Note the capital P
    'Genetic Risk': 1,
    'chronic Lung Disease': 1,  // Note lowercase 'c' in chronic
    'Balanced Diet': 1,
    'Obesity': 1,
    'Smoking': 1,
    'Passive Smoker': 1,
    'Chest Pain': 1,
    'Coughing of Blood': 1,
    'Fatigue': 1,
    'Weight Loss': 1,
    'Shortness of Breath': 1,
    'Wheezing': 1,
    'Swallowing Difficulty': 1,
    'Clubbing of Finger Nails': 1,
    'Frequent Cold': 1,
    'Dry Cough': 1,
    'Snoring': 1,
    'Level': 1
  },
  setFactor: (name, value) => set((state) => ({
    factors: {
      ...state.factors,
      [name]: value
    }
  })),
}));