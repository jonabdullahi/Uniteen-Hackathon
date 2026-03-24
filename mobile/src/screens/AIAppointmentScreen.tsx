import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";

import { Card } from "../components/Card";
import { ChoiceChip } from "../components/ChoiceChip";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

const appointmentSchema = z.object({
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  topic: z.string().min(1, "Add a topic"),
  notes: z.string().trim().min(1, "Add meeting notes"),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;
const TOPIC_SUGGESTIONS = ["University shortlist review", "Scholarship and funding plan", "Career pathway alignment", "Application timeline", "Course selection strategy"];
const TIME_SUGGESTIONS = ["09:00", "11:30", "14:00", "16:30"];

export function AIAppointmentScreen({ navigation }: NativeStackScreenProps<any, any>) {
  const addMeetingRequest = useAppStore((state) => state.addMeetingRequest);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { date: "", time: "", topic: "", notes: "" },
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>AI Guidance</Text>
        <Text style={styles.title}>AI Appointment Builder</Text>
        <Text style={styles.subtitle}>Design a focused session and we will match you with an AI advisor.</Text>
      </View>
      <Card>
        <Controller control={control} name="date" render={({ field: { value, onChange, onBlur } }) => <InputField label="Preferred Date" placeholder="2026-04-01" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.date?.message} />} />
        <Controller control={control} name="time" render={({ field: { value, onChange, onBlur } }) => <InputField label="Preferred Time" placeholder="14:00" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.time?.message} />} />
        <View style={styles.choiceWrap}>{TIME_SUGGESTIONS.map((time) => <ChoiceChip key={time} selected={false} onPress={() => setValue("time", time, { shouldValidate: true })}>{time}</ChoiceChip>)}</View>
        <Controller control={control} name="topic" render={({ field: { value, onChange, onBlur } }) => <InputField label="Meeting Topic" placeholder="University shortlist, scholarship plan, career strategy" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.topic?.message} />} />
        <View style={styles.choiceWrap}>{TOPIC_SUGGESTIONS.map((topic) => <ChoiceChip key={topic} selected={false} onPress={() => setValue("topic", topic, { shouldValidate: true })}>{topic}</ChoiceChip>)}</View>
        <Controller control={control} name="notes" render={({ field: { value, onChange, onBlur } }) => <InputField label="Notes" placeholder="Any constraints or context the AI should know" value={value} onChangeText={onChange} onBlur={onBlur} multiline numberOfLines={4} style={{ minHeight: 110 }} error={errors.notes?.message} />} />
        <PrimaryButton
          onPress={handleSubmit((data) => {
            addMeetingRequest({ type: "ai", ...data, requestedAt: new Date().toISOString() });
            navigation.goBack();
          })}
        >
          Request Appointment
        </PrimaryButton>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  eyebrow: { color: colors.softBlue, fontWeight: "700", textTransform: "uppercase", fontSize: 12, letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800", marginTop: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 22, marginTop: 8 },
  choiceWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
});
