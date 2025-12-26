import { create } from 'zustand';
import type { MeetingJourney, Meeting } from '@/types';

interface MeetingStore {
  currentJourney: MeetingJourney | null;
  currentMeeting: Meeting | null;
  journeys: MeetingJourney[];
  loading: boolean;
  error: string | null;

  setCurrentJourney: (journey: MeetingJourney | null) => void;
  setCurrentMeeting: (meeting: Meeting | null) => void;
  setJourneys: (journeys: MeetingJourney[]) => void;
  addJourney: (journey: MeetingJourney) => void;
  updateJourney: (journeyId: string, journey: Partial<MeetingJourney>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useMeetingStore = create<MeetingStore>()((set) => ({
  currentJourney: null,
  currentMeeting: null,
  journeys: [],
  loading: false,
  error: null,

  setCurrentJourney: (journey) => set({ currentJourney: journey }),
  setCurrentMeeting: (meeting) => set({ currentMeeting: meeting }),
  setJourneys: (journeys) => set({ journeys }),

  addJourney: (journey) =>
    set((state) => ({
      journeys: [...state.journeys, journey],
    })),

  updateJourney: (journeyId, updatedJourney) =>
    set((state) => ({
      journeys: state.journeys.map((j) =>
        j._id === journeyId ? { ...j, ...updatedJourney } : j
      ),
      currentJourney:
        state.currentJourney?._id === journeyId
          ? { ...state.currentJourney, ...updatedJourney }
          : state.currentJourney,
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentJourney: null,
      currentMeeting: null,
      journeys: [],
      loading: false,
      error: null,
    }),
}));
