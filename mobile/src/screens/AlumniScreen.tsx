import { Image, StyleSheet, Text, View } from "react-native";

import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { SecondaryButton } from "../components/SecondaryButton";
import { ALUMNI } from "../data/alumni";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

export function AlumniScreen() {
  const { addMeetingRequest, meetingRequests } = useAppStore();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Alumni Network</Text>
        <Text style={styles.subtitle}>Connect with graduates who are working in your dream fields.</Text>
      </View>
      {ALUMNI.map((alum) => {
        const isRequested = meetingRequests.some((request) => request.alumId === alum.id);
        return (
          <Card key={alum.id}>
            <View style={styles.row}>
              <Image source={{ uri: alum.image }} style={styles.avatar} />
              <View style={styles.grow}>
                <Text style={styles.cardTitle}>{alum.name}</Text>
                <Text style={styles.body}>{alum.role} at {alum.company}</Text>
                <Text style={styles.body}>Alumni of {alum.uni}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <PrimaryButton
                onPress={() =>
                  !isRequested &&
                  addMeetingRequest({
                    alumId: alum.id,
                    date: new Date().toISOString(),
                  })
                }
                disabled={isRequested}
              >
                {isRequested ? "Request Sent" : "Request Mentorship"}
              </PrimaryButton>
              <SecondaryButton onPress={() => undefined}>Message</SecondaryButton>
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 18 },
  title: { color: colors.navy, fontSize: 30, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginTop: 8 },
  row: { flexDirection: "row", gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  grow: { flex: 1 },
  cardTitle: { color: colors.navy, fontSize: 18, fontWeight: "800", marginBottom: 4 },
  body: { color: colors.textMuted, lineHeight: 20 },
  actions: { gap: 10, marginTop: 16 },
});
