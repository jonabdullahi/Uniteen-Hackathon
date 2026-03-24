import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Compass, GraduationCap, HeartPulse, House, School, UserCircle2 } from "lucide-react-native";

import { AIAppointmentScreen } from "../screens/AIAppointmentScreen";
import { AIQuizSetupScreen } from "../screens/AIQuizSetupScreen";
import { AIQuizTakeScreen } from "../screens/AIQuizTakeScreen";
import { AlumniScreen } from "../screens/AlumniScreen";
import { CareerScreen } from "../screens/CareerScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { DiagnosticScreen } from "../screens/DiagnosticScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MoodScreen } from "../screens/MoodScreen";
import { PathwaysScreen } from "../screens/PathwaysScreen";
import { PersonalityTestScreen } from "../screens/PersonalityTestScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SummaryScreen } from "../screens/SummaryScreen";
import { SurveyScreen } from "../screens/SurveyScreen";
import { UniversitiesScreen } from "../screens/UniversitiesScreen";
import { UniversityDetailScreen } from "../screens/UniversityDetailScreen";
import { useAppStore } from "../store/useAppStore";
import { colors } from "../theme/colors";

export type RootStackParamList = {
  Login: undefined;
  Summary: undefined;
  MainTabs: undefined;
  Survey: undefined;
  Diagnostic: undefined;
  PersonalityTest: undefined;
  Universities: undefined;
  UniversityDetail: { id: number };
  Alumni: undefined;
  AIAttachment: undefined;
  AIQuizSetup: undefined;
  AIQuizTake: { subjects: string[] };
};

type MainTabParamList = {
  Dashboard: undefined;
  Pathways: undefined;
  Mood: undefined;
  Career: undefined;
  Explore: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.navy, fontWeight: "700" },
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { height: 70, paddingTop: 8, paddingBottom: 10 },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: ({ color, size }) => <House color={color} size={size} /> }} />
      <Tab.Screen name="Pathways" component={PathwaysScreen} options={{ tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }} />
      <Tab.Screen name="Mood" component={MoodScreen} options={{ tabBarIcon: ({ color, size }) => <HeartPulse color={color} size={size} /> }} />
      <Tab.Screen name="Career" component={CareerScreen} options={{ tabBarIcon: ({ color, size }) => <GraduationCap color={color} size={size} /> }} />
      <Tab.Screen name="Explore" options={{ title: "Universities", tabBarIcon: ({ color, size }) => <School color={color} size={size} /> }}>
        {() => <UniversitiesScreen navigation={undefined as any} route={undefined as any} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <UserCircle2 color={color} size={size} /> }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const userProfile = useAppStore((state) => state.userProfile);
  const summaryComplete = useAppStore((state) => state.summaryComplete);

  if (!userProfile) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    );
  }

  if (!summaryComplete) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.navy, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Summary" component={SummaryScreen} options={{ title: "Summary" }} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.navy, fontWeight: "700" },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Survey" component={SurveyScreen} options={{ title: "Survey" }} />
      <Stack.Screen name="Diagnostic" component={DiagnosticScreen} options={{ title: "Diagnostic" }} />
      <Stack.Screen name="PersonalityTest" component={PersonalityTestScreen} options={{ title: "Personality Test" }} />
      <Stack.Screen name="Universities" component={UniversitiesScreen} options={{ title: "Universities" }} />
      <Stack.Screen name="UniversityDetail" component={UniversityDetailScreen} options={{ title: "University Detail" }} />
      <Stack.Screen name="Alumni" component={AlumniScreen} options={{ title: "Alumni Network" }} />
      <Stack.Screen name="AIAttachment" component={AIAppointmentScreen} options={{ title: "AI Appointment" }} />
      <Stack.Screen name="AIQuizSetup" component={AIQuizSetupScreen} options={{ title: "AI Quiz" }} />
      <Stack.Screen name="AIQuizTake" component={AIQuizTakeScreen} options={{ title: "Take Quiz" }} />
    </Stack.Navigator>
  );
}
