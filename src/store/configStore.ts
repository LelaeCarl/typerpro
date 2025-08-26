import { create } from 'zustand';

type Mode = 'time' | 'quote' | 'zen' | 'custom';

interface ConfigSlice {
  mode: Mode;
  durations: number[];
  durationSec: number;
  setMode: (m: Mode) => void;
  setDuration: (s: number) => void;
}

export const useConfigStore = create<ConfigSlice>((set) => ({
  mode: 'time',
  durations: [15, 30, 60, 120],
  durationSec: 30,
  setMode: (m: Mode) => set({ mode: m }),
  setDuration: (s: number) => set({ durationSec: s }),
}));
