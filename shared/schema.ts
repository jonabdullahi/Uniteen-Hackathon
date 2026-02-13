import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dummy table to satisfy backend infrastructure (unused by frontend)
export const app_state = pgTable("app_state", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
});

// === LOCAL STORAGE STATE SCHEMAS ===

export const userProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  age: z.string().trim().min(1, "Age is required"),
  location: z.string().trim().min(1, "Location is required"),
  school: z.string().trim().min(1, "School is required"),
  languages: z.string().trim().min(1, "Languages are required"),
});

export const initialSurveySchema = z.object({
  favoriteSubjects: z.string().trim().min(1, "Favorite subjects are required"),
  weakSubjects: z.string().trim().min(1, "Subjects to improve are required"),
  interests: z.string().trim().min(1, "Interests are required"),
  learningStyle: z.enum(["Visual", "Audio", "Reading", "Kinesthetic"]),
  studyMethod: z.enum(["Active recall", "Spaced repetition", "Practice problems", "Concept explanation", "Flashcards"]),
  academicGoals: z.string().trim().min(1, "Academic goal is required"),
  personalGoals: z.string().trim().min(1, "Personal goal is required"),
});

export const moodEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  rating: z.number().min(1).max(5),
  note: z.string().optional(),
});

export const finalSurveySchema = z.object({
  personality: z.object({
    Analytical: z.string().trim().min(1, "Analytical response is required"),
    Creative: z.string().trim().min(1, "Creative response is required"),
    Social: z.string().trim().min(1, "Social response is required"),
    Organized: z.string().trim().min(1, "Organized response is required"),
  }),
  values: z.array(z.string()).min(1, "Select at least one core value"),
  preferences: z.object({
    workEnvironment: z.string().trim().min(1, "Work environment is required"),
    studyEnvironment: z.string().trim().min(1, "Study environment is required"),
    location: z.string().trim().min(1, "Location preference is required"),
    approach: z.string().trim().min(1, "Approach is required"),
  }),
});

export const studyPlanSchema = z.object({
  weeklyGoals: z.array(z.string()),
  recommendedMethod: z.string(),
  practiceBlocks: z.array(z.object({
    subject: z.string(),
    duration: z.string(),
    task: z.string()
  }))
});

export const methodFeedbackSchema = z.object({
  method: z.string(),
  helpful: z.boolean(),
  date: z.string(),
});

export const scheduleCompletionSchema = z.object({
  blockKey: z.string(),
  date: z.string(),
  completed: z.boolean(),
});

export const userSettingsSchema = z.object({
  privacyMode: z.boolean().default(false),
  highContrast: z.boolean().default(false),
  textScale: z.enum(["normal", "large"]).default("normal"),
  language: z.enum(["English", "French", "Spanish"]).default("English"),
});

// Unified State Object
export const eduBridgeStateSchema = z.object({
  userProfile: userProfileSchema.optional(),
  summaryComplete: z.boolean().optional(),
  initialSurvey: initialSurveySchema.optional(),
  diagnosticResults: z.any().optional(),
  studyPlan: studyPlanSchema.optional(),
  moodEntries: z.array(moodEntrySchema).default([]),
  finalSurvey: finalSurveySchema.optional(),
  // Mock data results would be stored here
  careerMatches: z.array(z.any()).default([]),
  universityMatches: z.array(z.any()).default([]),
  meetingRequests: z.array(z.any()).default([]),
  methodFeedback: z.array(methodFeedbackSchema).default([]),
  scheduleCompletions: z.array(scheduleCompletionSchema).default([]),
  savedUniversities: z.array(z.number()).default([]),
  universityChecklist: z.record(z.array(z.string())).default({}),
  userSettings: userSettingsSchema.default({
    privacyMode: false,
    highContrast: false,
    textScale: "normal",
    language: "English",
  }),
});

export type EduBridgeState = z.infer<typeof eduBridgeStateSchema>;
