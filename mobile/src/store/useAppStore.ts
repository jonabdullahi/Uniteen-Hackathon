import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  EduBridgeState,
  FinalSurvey,
  InitialSurvey,
  MethodFeedback,
  MoodEntry,
  ScheduleCompletion,
  StudyPlan,
  UserProfile,
  UserSettings,
} from "../types/state";

interface AppStore extends EduBridgeState {
  updateUserProfile: (profile: UserProfile) => void;
  setSummaryComplete: (complete: boolean) => void;
  updateInitialSurvey: (survey: InitialSurvey) => void;
  updateStudyPlan: (plan: StudyPlan) => void;
  addMoodEntry: (entry: MoodEntry) => void;
  updateFinalSurvey: (survey: FinalSurvey) => void;
  addMeetingRequest: (request: Record<string, unknown>) => void;
  addMethodFeedback: (feedback: MethodFeedback) => void;
  setScheduleCompletion: (entry: ScheduleCompletion) => void;
  toggleSavedUniversity: (id: number) => void;
  toggleUniversityChecklistItem: (universityId: number, item: string) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  resetData: () => void;
}

const initialState: EduBridgeState = {
  userProfile: undefined,
  summaryComplete: false,
  initialSurvey: undefined,
  diagnosticResults: undefined,
  studyPlan: undefined,
  moodEntries: [],
  finalSurvey: undefined,
  careerMatches: [],
  universityMatches: [],
  meetingRequests: [],
  methodFeedback: [],
  scheduleCompletions: [],
  savedUniversities: [],
  universityChecklist: {},
  userSettings: {
    privacyMode: false,
    highContrast: false,
    textScale: "normal",
    language: "English",
  },
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: { ...state.userProfile, ...profile },
        })),
      setSummaryComplete: (complete) =>
        set(() => ({
          summaryComplete: complete,
        })),
      updateInitialSurvey: (survey) =>
        set((state) => ({
          initialSurvey: { ...state.initialSurvey, ...survey },
        })),
      updateStudyPlan: (plan) =>
        set(() => ({
          studyPlan: plan,
        })),
      addMoodEntry: (entry) =>
        set((state) => ({
          moodEntries: [entry, ...state.moodEntries],
        })),
      updateFinalSurvey: (survey) =>
        set(() => ({
          finalSurvey: survey,
        })),
      addMeetingRequest: (request) =>
        set((state) => ({
          meetingRequests: [...state.meetingRequests, request],
        })),
      addMethodFeedback: (feedback) =>
        set((state) => ({
          methodFeedback: [feedback, ...state.methodFeedback],
        })),
      setScheduleCompletion: (entry) =>
        set((state) => {
          const next = state.scheduleCompletions.filter(
            (item) => !(item.blockKey === entry.blockKey && item.date === entry.date),
          );
          return {
            scheduleCompletions: [entry, ...next],
          };
        }),
      toggleSavedUniversity: (id) =>
        set((state) => {
          const exists = state.savedUniversities.includes(id);
          return {
            savedUniversities: exists
              ? state.savedUniversities.filter((value) => value !== id)
              : [...state.savedUniversities, id],
          };
        }),
      toggleUniversityChecklistItem: (universityId, item) =>
        set((state) => {
          const key = String(universityId);
          const current = state.universityChecklist[key] ?? [];
          const hasItem = current.includes(item);
          return {
            universityChecklist: {
              ...state.universityChecklist,
              [key]: hasItem ? current.filter((entry) => entry !== item) : [...current, item],
            },
          };
        }),
      updateUserSettings: (settings) =>
        set((state) => ({
          userSettings: { ...state.userSettings, ...settings },
        })),
      resetData: () => set(initialState),
    }),
    {
      name: "edubridge-mobile-state",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
