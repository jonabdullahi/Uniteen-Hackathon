import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { finalSurveySchema, type FinalSurvey } from "../types/state";

const coreValues = ["Impact", "Stability", "Creativity", "Leadership", "Innovation", "Community"];
const personalityTraits = ["Analytical", "Creative", "Social", "Organized"] as const;
const agreementOptions = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

type Props = NativeStackScreenProps<RootStackParamList, "PersonalityTest">;

export function PersonalityTestScreen({ navigation }: Props) {
  const updateFinalSurvey = useAppStore((state) => state.updateFinalSurvey);
  const existing = useAppStore((state) => state.finalSurvey);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FinalSurvey>({
    resolver: zodResolver(finalSurveySchema),
    defaultValues: existing ?? {
      personality: {
        Analytical: "",
        Creative: "",
        Social: "",
        Organized: "",
      },
      values: [],
      preferences: {
        workEnvironment: "",
        studyEnvironment: "",
        location: "",
        approach: "",
      },
    },
  });

  const values = watch("values");

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Year 4 Personality Test</Text>
        <Text style={styles.subtitle}>Complete this check-in to personalize university and alumni recommendations.</Text>

        {personalityTraits.map((trait) => (
          <View key={trait} style={styles.section}>
            <Text style={styles.label}>I consider myself {trait.toLowerCase()}.</Text>
            <View style={styles.choiceWrap}>
              {agreementOptions.map((option) => (
                <ChoiceChip key={option} selected={watch(`personality.${trait}`) === option} onPress={() => setValue(`personality.${trait}`, option, { shouldValidate: true })}>
                  {option}
                </ChoiceChip>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.label}>Core Values</Text>
          <View style={styles.choiceWrap}>
            {coreValues.map((value) => {
              const checked = values.includes(value);
              return (
                <ChoiceChip
                  key={value}
                  selected={checked}
                  onPress={() =>
                    setValue("values", checked ? values.filter((item) => item !== value) : [...values, value], {
                      shouldValidate: true,
                    })
                  }
                >
                  {value}
                </ChoiceChip>
              );
            })}
          </View>
          {errors.values ? <Text style={styles.error}>{errors.values.message}</Text> : null}
        </View>

        <PreferenceField label="Preferred Work Environment" value={watch("preferences.workEnvironment")} options={["Remote", "Office", "Hybrid", "Field"]} onChange={(value) => setValue("preferences.workEnvironment", value, { shouldValidate: true })} />
        <PreferenceField label="Preferred Study Environment" value={watch("preferences.studyEnvironment")} options={["Quiet", "Collaborative", "Flexible"]} onChange={(value) => setValue("preferences.studyEnvironment", value, { shouldValidate: true })} />
        <PreferenceField label="Preferred Future Location" value={watch("preferences.location")} options={["Local", "National", "International"]} onChange={(value) => setValue("preferences.location", value, { shouldValidate: true })} />
        <PreferenceField label="Preferred Learning Approach" value={watch("preferences.approach")} options={["Structured", "Exploratory", "Balanced"]} onChange={(value) => setValue("preferences.approach", value, { shouldValidate: true })} />

        <PrimaryButton
          onPress={handleSubmit((data) => {
            updateFinalSurvey(data);
            navigation.goBack();
          })}
        >
          Save Personality Test
        </PrimaryButton>
      </Card>
    </Screen>
  );
}

function PreferenceField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: any) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.choiceWrap}>
        {options.map((option) => (
          <ChoiceChip key={option} selected={value === option} onPress={() => onChange(option)}>
            {option}
          </ChoiceChip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.navy, fontSize: 28, fontWeight: "800" },
  subtitle: { color: colors.textMuted, lineHeight: 22, marginTop: 8, marginBottom: 18 },
  section: { marginBottom: 18 },
  label: { color: colors.text, fontWeight: "700", fontSize: 15, marginBottom: 10 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  error: { color: colors.danger, fontSize: 12, marginTop: 6 },
});
