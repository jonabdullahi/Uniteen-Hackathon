import { zodResolver } from "@hookform/resolvers/zod";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Card } from "../components/Card";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";
import { type UserProfile, userProfileSchema } from "../types/state";
import type { RootStackParamList } from "../navigation/AppNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export function LoginScreen({ navigation }: Props) {
  const updateUserProfile = useAppStore((state) => state.updateUserProfile);
  const setSummaryComplete = useAppStore((state) => state.setSummaryComplete);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserProfile>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      school: "",
      languages: "",
    },
  });

  const onSubmit = (data: UserProfile) => {
    updateUserProfile(data);
    setSummaryComplete(false);
    navigation.replace("Summary");
  };

  return (
    <LinearGradient colors={[colors.navy, colors.slateBlue]} style={styles.gradient}>
      <Screen>
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />

        <View style={styles.container}>
          <Card>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>

            <Text style={styles.title}>Student Login</Text>
            <Text style={styles.subtitle}>Enter your profile details to get started.</Text>

            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Full Name"
                  placeholder="John Doe"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Age"
                  placeholder="16"
                  keyboardType="number-pad"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.age?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="school"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="School Name"
                  placeholder="Lincoln High School"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.school?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Location"
                  placeholder="New York, NY"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.location?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="languages"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputField
                  label="Languages Spoken"
                  placeholder="English, Spanish"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.languages?.message}
                />
              )}
            />

            <PrimaryButton onPress={handleSubmit(onSubmit)} loading={isSubmitting}>
              Continue to Summary
            </PrimaryButton>
          </Card>
        </View>
      </Screen>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 24,
  },
  orbTop: {
    position: "absolute",
    top: -70,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(0, 91, 150, 0.35)",
  },
  orbBottom: {
    position: "absolute",
    bottom: -90,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(100, 151, 177, 0.18)",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.paleBlue,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: colors.blue,
  },
  title: {
    color: colors.navy,
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: colors.softBlue,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
  },
});
