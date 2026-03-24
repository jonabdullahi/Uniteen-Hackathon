import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ProgressBar } from "../components/ProgressBar";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { buildPersonalizedRecommendations } from "../lib/recommendations";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const {
    userProfile,
    studyPlan,
    moodEntries,
    initialSurvey,
    finalSurvey,
    methodFeedback,
    scheduleCompletions,
    addMethodFeedback,
    setScheduleCompletion,
  } = useAppStore();

  const firstName = userProfile?.name?.split(" ")[0] ?? "Student";
  const today = new Date().toISOString().slice(0, 10);

  if (!studyPlan) {
    return (
      <Screen>
        <View style={styles.header}>
          <Text style={styles.title}>Hello, {firstName}</Text>
          <Text style={styles.subtitle}>Let’s create your first personalized study roadmap.</Text>
        </View>
        <Card>
          <Text style={styles.sectionTitle}>No Study Plan Yet</Text>
          <Text style={styles.bodyText}>
            Complete the initial survey and diagnostic to unlock your schedule, recommendations, quiz flow, and
            personalized pathways.
          </Text>
          <View style={styles.buttonGap}>
            {!initialSurvey ? (
              <PrimaryButton onPress={() => navigation.navigate("Survey")}>Start Survey</PrimaryButton>
            ) : (
              <PrimaryButton onPress={() => navigation.navigate("Diagnostic")}>Start Diagnostic</PrimaryButton>
            )}
            <SecondaryButton onPress={() => navigation.navigate("Mood")}>Log Mood</SecondaryButton>
          </View>
        </Card>
      </Screen>
    );
  }

  const personalized = buildPersonalizedRecommendations({
    studyPlan,
    initialSurvey,
    finalSurvey,
    moodEntries,
  });

  const getBlockKey = (subject: string, task: string) => `${subject}::${task}`;
  const completedToday = scheduleCompletions.filter((entry) => entry.date === today && entry.completed);
  const completedCount = completedToday.length;
  const totalBlocks = personalized.scheduleDetails.length;
  const completionPercent = totalBlocks ? Math.round((completedCount / totalBlocks) * 100) : 0;
  const latestMood = moodEntries[0]?.rating || 0;
  const positiveMethodFeedback = methodFeedback.filter((entry) => entry.helpful).length;
  const feedbackRate = methodFeedback.length ? Math.round((positiveMethodFeedback / methodFeedback.length) * 100) : 0;

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {firstName}</Text>
        <Text style={styles.subtitle}>Here’s your learning roadmap for today.</Text>
      </View>

      {!initialSurvey && (
        <Card>
          <Text style={styles.sectionTitle}>Complete the Initial Survey</Text>
          <Text style={styles.bodyText}>This separate step helps personalize your dashboard.</Text>
          <View style={styles.buttonGap}>
            <PrimaryButton onPress={() => navigation.navigate("Survey")}>Start Survey</PrimaryButton>
          </View>
        </Card>
      )}

      {initialSurvey && !finalSurvey && (
        <Card>
          <Text style={styles.sectionTitle}>Year 4 Personality Test</Text>
          <Text style={styles.bodyText}>Unlock universities and alumni when you are ready.</Text>
          <View style={styles.buttonGap}>
            <PrimaryButton onPress={() => navigation.navigate("PersonalityTest")}>Take Personality Test</PrimaryButton>
          </View>
        </Card>
      )}

      <Card>
        <Text style={styles.eyebrow}>Recommended Method</Text>
        <Text style={styles.methodTitle}>{personalized.topMethod.name}</Text>
        <Text style={styles.bodyText}>{personalized.topMethod.summary}</Text>
        <View style={styles.buttonGap}>
          <SecondaryButton
            onPress={() =>
              addMethodFeedback({
                method: personalized.topMethod.name,
                helpful: true,
                date: new Date().toISOString(),
              })
            }
          >
            This Helped
          </SecondaryButton>
          <SecondaryButton
            onPress={() =>
              addMethodFeedback({
                method: personalized.topMethod.name,
                helpful: false,
                date: new Date().toISOString(),
              })
            }
          >
            Not Helpful
          </SecondaryButton>
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Completed Today: {completedCount}/{totalBlocks}</Text>
          <Text style={styles.metaText}>Approval: {feedbackRate}%</Text>
        </View>
        <ProgressBar value={completionPercent} />
        <View style={styles.listGap}>
          {personalized.scheduleDetails.map((block) => {
            const blockKey = getBlockKey(block.subject, block.task);
            const done = completedToday.some((entry) => entry.blockKey === blockKey);
            return (
              <View key={blockKey} style={styles.block}>
                <Text style={styles.blockSubject}>{block.subject} • {block.duration}</Text>
                <Text style={styles.blockTask}>{block.task}</Text>
                <Text style={styles.blockBody}>Strategy: {block.strategy}</Text>
                <Text style={styles.blockBody}>Checkpoint: {block.checkpoint}</Text>
                <SecondaryButton
                  onPress={() =>
                    setScheduleCompletion({
                      blockKey,
                      date: today,
                      completed: !done,
                    })
                  }
                >
                  {done ? "Mark Incomplete" : "Mark Complete"}
                </SecondaryButton>
              </View>
            );
          })}
        </View>
      </Card>

      <Card>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.buttonGap}>
          <PrimaryButton onPress={() => navigation.navigate("AIQuizSetup")}>Open AI Quiz</PrimaryButton>
          <PrimaryButton onPress={() => navigation.navigate("Universities")}>Explore Universities</PrimaryButton>
          <SecondaryButton onPress={() => navigation.navigate("AIAttachment")}>AI Appointment</SecondaryButton>
          <SecondaryButton onPress={() => navigation.navigate("Alumni")}>Alumni Network</SecondaryButton>
        </View>
        <Text style={styles.metaText}>Latest Mood: {latestMood ? `${latestMood}/5` : "Not logged"}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: colors.textMuted, fontSize: 15 },
  eyebrow: { color: colors.blue, fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  methodTitle: { color: colors.navy, fontSize: 24, fontWeight: "800", marginBottom: 10 },
  sectionTitle: { color: colors.navy, fontSize: 20, fontWeight: "800", marginBottom: 10 },
  bodyText: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  buttonGap: { gap: 10, marginTop: 14 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  metaText: { color: colors.textMuted, fontSize: 13 },
  listGap: { gap: 12, marginTop: 14 },
  block: { borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 14, backgroundColor: colors.surfaceMuted, gap: 6 },
  blockSubject: { color: colors.blue, fontWeight: "700", fontSize: 13, textTransform: "uppercase" },
  blockTask: { color: colors.text, fontWeight: "700", fontSize: 15 },
  blockBody: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
