import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { initialSurveySchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const steps = [
  {
    title: "Learning Style",
    description: "Tell us how you learn best.",
    fields: ["learningStyle", "studyMethod"],
  },
  {
    title: "Subjects & Interests",
    description: "Share what excites you in class.",
    fields: ["favoriteSubjects", "weakSubjects", "interests"],
  },
  {
    title: "Goals",
    description: "Set your academic and personal targets.",
    fields: ["academicGoals", "personalGoals"],
  },
] as const;

export default function Survey() {
  const { updateInitialSurvey } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);

  const form = useForm<z.infer<typeof initialSurveySchema>>({
    resolver: zodResolver(initialSurveySchema),
    defaultValues: {
      favoriteSubjects: "",
      weakSubjects: "",
      interests: "",
      learningStyle: "Visual",
      studyMethod: "Active recall",
      academicGoals: "",
      personalGoals: "",
    },
  });

  const onSubmit = (data: z.infer<typeof initialSurveySchema>) => {
    updateInitialSurvey(data);
    toast({
      title: "Survey Saved",
      description: "Your learning preferences were updated.",
    });
    setLocation("/dashboard");
  };

  const isLastStep = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = async () => {
    const currentFields = steps[step].fields as unknown as Array<keyof z.infer<typeof initialSurveySchema>>;
    const isValid = await form.trigger(currentFields, { shouldFocus: true });
    if (!isValid) return;

    if (isLastStep) {
      form.handleSubmit(onSubmit)();
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#011f4b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#005b96] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#6497b1] rounded-full opacity-10 blur-3xl" />
      </div>

      <Card className="w-full max-w-3xl bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-0 overflow-hidden z-10">
        <div className="h-2 bg-[#b3cde0]">
          <motion.div
            className="h-full bg-[#005b96]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest text-[#6497b1]">Initial Survey</p>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#011f4b] mb-2">
              {steps[step].title}
            </h1>
            <p className="text-[#6497b1]">{steps[step].description}</p>
          </div>

          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={async (event) => {
                event.preventDefault();
                await handleNext();
              }}
            >
              {step === 0 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <FormField
                    control={form.control}
                    name="learningStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Learning Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "Visual",
                              "Audio",
                              "Reading",
                              "Kinesthetic",
                            ].map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studyMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Study Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-50 border-slate-200">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              "Active recall",
                              "Spaced repetition",
                              "Practice problems",
                              "Concept explanation",
                              "Flashcards",
                            ].map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="favoriteSubjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Favorite Subjects</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Math, Physics, History"
                            {...field}
                            className="bg-slate-50 border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weakSubjects"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subjects to Improve</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Chemistry, Writing"
                            {...field}
                            className="bg-slate-50 border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Areas of Interest</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Robotics, Design, Economics"
                            {...field}
                            className="bg-slate-50 border-slate-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="academicGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Academic Goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I want to improve my calculus grade..."
                            {...field}
                            className="bg-slate-50 border-slate-200 resize-none"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="personalGoals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="I want to build better study habits..."
                            {...field}
                            className="bg-slate-50 border-slate-200 resize-none"
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <Button type="button" variant="outline" onClick={handleBack} disabled={step === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="text-xs text-gray-500">Step {step + 1} of {steps.length}</div>
                <Button type="button" size="lg" className="bg-[#005b96] hover:bg-[#03396c]" onClick={handleNext}>
                  {isLastStep ? "Save Survey" : "Next"}
                  {isLastStep ? <Check className="ml-2 h-4 w-4" /> : <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
