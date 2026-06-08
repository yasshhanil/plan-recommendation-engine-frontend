import { create } from 'zustand';

export const usePlanStore = create((set, get) => ({
  currentPlan: null,
  selectedCity: null,
  setSelectedCity: (city) => set({ selectedCity: city }),
  selectedArea: null,
  setSelectedArea: (area) => set({ selectedArea: area }),
  planningState: {
    selectedVibeTags: [],
    selectedCategoryTags: [],
    selectedPriceTags: null,
    selectedSpecialTags: [],
    selectedArea: null,
  },

  setPlanningState: (key, value) =>
    set((state) => ({
      planningState: { ...state.planningState, [key]: value },
    })),

  toggleTag: (key, id, add, isSingle = false) =>
    set((state) => {
      const prev = state.planningState;
      const newVal = isSingle
        ? (add ? id : null)
        : add
          ? [...(prev[key] || []), id]
          : (prev[key] || []).filter(v => v !== id);
      return { planningState: { ...prev, [key]: newVal } };
    }),

  setCurrentPlan: (plan) => set({ currentPlan: plan }),

  resetPlanningState: () =>
    set({
      planningState: {
        selectedVibeTags: [],
        selectedCategoryTags: [],
        selectedPriceTags: null,
        selectedSpecialTags: [],
        selectedArea: null,
      },
    }),
}));
