import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/lib/store";

import Login from "@/pages/login";
import Summary from "@/pages/summary";
import Survey from "@/pages/survey";
import Diagnostic from "@/pages/diagnostic";
import Dashboard from "@/pages/dashboard";
import MoodTracker from "@/pages/mood";
import Universities from "@/pages/universities";
import UniversityDetail from "@/pages/university-detail";
import Career from "@/pages/career";
import Alumni from "@/pages/alumni";
import PersonalityTest from "@/pages/personality-test";
import AiAppointment from "@/pages/ai-appointment";
import AiQuiz from "@/pages/ai-quiz";
import AiQuizTake from "@/pages/ai-quiz-take";
import NotFound from "@/pages/not-found";

function GuardedRoute({
  component: Component,
  requireSummary = true,
  requireInitialSurvey = false,
  requireFinalSurvey = false,
  ...rest
}: any) {
  const { userProfile, summaryComplete, initialSurvey, finalSurvey } = useStore();

  if (!userProfile?.name) {
    return <Redirect to="/login" />;
  }
  if (requireSummary && !summaryComplete) {
    return <Redirect to="/summary" />;
  }
  if (requireInitialSurvey && !initialSurvey) {
    return <Redirect to="/survey" />;
  }
  if (requireFinalSurvey && !finalSurvey) {
    return <Redirect to="/personality-test" />;
  }

  return <Component {...rest} />;
}

function Router() {
  const { userProfile, summaryComplete } = useStore();

  return (
    <Switch>
      <Route
        path="/"
        component={() => {
          if (!userProfile?.name) return <Redirect to="/login" />;
          if (!summaryComplete) return <Redirect to="/summary" />;
          return <Redirect to="/dashboard" />;
        }}
      />

      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={() => <Redirect to="/login" />} />

      <Route path="/summary">
        {() => <GuardedRoute component={Summary} requireSummary={false} />}
      </Route>

      <Route path="/survey">
        {() => <GuardedRoute component={Survey} />}
      </Route>

      <Route path="/diagnostic">
        {() => <GuardedRoute component={Diagnostic} />}
      </Route>
      <Route path="/dashboard">
        {() => <GuardedRoute component={Dashboard} />}
      </Route>
      <Route path="/mood">
        {() => <GuardedRoute component={MoodTracker} />}
      </Route>
      <Route path="/career">
        {() => <GuardedRoute component={Career} />}
      </Route>

      <Route path="/personality-test">
        {() => <GuardedRoute component={PersonalityTest} requireInitialSurvey />}
      </Route>
      <Route path="/final-survey" component={() => <Redirect to="/personality-test" />} />

      <Route path="/universities">
        {() => <GuardedRoute component={Universities} requireFinalSurvey />}
      </Route>
      <Route path="/universities/:id">
        {() => <GuardedRoute component={UniversityDetail} requireFinalSurvey />}
      </Route>
      <Route path="/alumni">
        {() => <GuardedRoute component={Alumni} requireFinalSurvey />}
      </Route>
      <Route path="/ai-appointment">
        {() => <GuardedRoute component={AiAppointment} requireFinalSurvey />}
      </Route>
      <Route path="/ai-quiz">
        {() => <GuardedRoute component={AiQuiz} requireInitialSurvey />}
      </Route>
      <Route path="/ai-quiz/take">
        {() => <GuardedRoute component={AiQuizTake} requireInitialSurvey />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
