import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { initialSurveySchema, type InitialSurvey } from "../types/state";

const steps = [
  { title: "Learning Style", description: "Tell us how you learn best." },
  { title: "Subjects & Interests", description: "Share what excites you in class." },
  { title: "Goals", description: "Set your academic and personal targets." },
] as const;

type Props = NativeStackScreenProps<RootStackParamList, "Survey">;

export function SurveyScreen({ navigation }: Props) {
  const updateInitialSurvey = useAppStore((state) => state.updateInitialSurvey);
  const existing = useAppStore((state) => state.initialSurvey);
  const [step, setStep] = React.useState(0);

  const {
    control,
    trigger,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<InitialSurvey>({
    resolver: zodResolver(initialSurveySchema),
    defaultValues: existing ?? {
      favoriteSubjects: "",
      weakSubjects: "",
      interests: "",
      learningStyle: undefined,
      studyMethod: undefined,
      academicGoals: "",
      personalGoals: "",
    },
  });

  const progress = ((step + 1) / steps.length) * 100;
  const isLastStep = step === steps.length - 1;

  const handleNext = async () => {
    const fields =
      step === 0
        ? ["learningStyle", "studyMethod"]
        : step === 1
          ? ["favoriteSubjects", "weakSubjects", "interests"]
          : ["academicGoals", "personalGoals"];
    const ok = await trigger(fields as never);
    if (!ok) return;

    if (isLastStep) {
      void handleSubmit((data) => {
        updateInitialSurvey(data);
        navigation.goBack();
      })();
      return;
    }

    setStep((prev) => prev + 1);
  };

  return (
    <Screen>
      <Card>
        <ProgressBar value={progress} />
        <Text style={styles.eyebrow}>Initial Survey</Text>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.subtitle}>{steps[step].description}</Text>

        {step === 0 && (
          <View style={styles.group}>
            <Text style={styles.label}>Preferred Learning Style</Text>
            <View style={styles.choiceWrap}>
              {["Visual", "Audio", "Reading", "Kinesthetic"].map((value) => (
                <ChoiceChip
                  key={value}
                  selected={watch("learningStyle") === value}
                  onPress={() => setValue("learningStyle", value as InitialSurvey["learningStyle"], { shouldValidate: true })}
                >
                  {value}
                </ChoiceChip>
              ))}
            </View>
            {errors.learningStyle ? <Text style={styles.error}>{errors.learningStyle.message}</Text> : null}

            <Text style={styles.label}>Current Study Method</Text>
            <View style={styles.choiceWrap}>
              {["Active recall", "Spaced repetition", "Practice problems", "Concept explanation", "Flashcards"].map((value) => (
                <ChoiceChip
                  key={value}
                  selected={watch("studyMethod") === value}
                  onPress={() => setValue("studyMethod", value as InitialSurvey["studyMethod"], { shouldValidate: true })}
                >
                  {value}
                </ChoiceChip>
              ))}
            </View>
            {errors.studyMethod ? <Text style={styles.error}>{errors.studyMethod.message}</Text> : null}
          </View>
        )}

        {step === 1 && (
          <>
            <Controller
              control={control}
              name="favoriteSubjects"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputField label="Favorite Subjects" placeholder="Math, Physics, History" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.favoriteSubjects?.message} />
              )}
            />
            <Controller
              control={control}
              name="weakSubjects"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputField label="Subjects to Improve" placeholder="Chemistry, Writing" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.weakSubjects?.message} />
              )}
            />
            <Controller
              control={control}
              name="interests"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputField label="Areas of Interest" placeholder="Robotics, Design, Economics" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.interests?.message} />
              )}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Controller
              control={control}
              name="academicGoals"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputField label="Key Academic Goal" placeholder="I want to improve my calculus grade..." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={4} style={{ minHeight: 100 }} error={errors.academicGoals?.message} />
              )}
            />
            <Controller
              control={control}
              name="personalGoals"
              render={({ field: { value, onChange, onBlur } }) => (
                <InputField label="Personal Goal" placeholder="I want to build better study habits..." value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={4} style={{ minHeight: 100 }} error={errors.personalGoals?.message} />
              )}
            />
          </>
        )}

        <View style={styles.footer}>
          <SecondaryButton onPress={() => (step > 0 ? setStep((prev) => prev - 1) : navigation.goBack())}>
            {step === 0 ? "Cancel" : "Back"}
          </SecondaryButton>
          <PrimaryButton onPress={handleNext}>{isLastStep ? "Save Survey" : "Next"}</PrimaryButton>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { marginTop: 16, color: colors.softBlue, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 28, fontWeight: "800", marginTop: 6 },
  subtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 20 },
  group: { gap: 12 },
  label: { color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 6 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 6 },
  error: { color: colors.danger, fontSize: 12, marginBottom: 8 },
  footer: { gap: 10, marginTop: 14 },
});
