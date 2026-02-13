import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export default function Summary() {
  const [, setLocation] = useLocation();
  const { userProfile, setSummaryComplete } = useStore();

  const handleContinue = () => {
    setSummaryComplete(true);
    setLocation("/dashboard");
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
            animate={{ width: "75%" }}
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#011f4b] mb-2">
              Profile Summary
            </h1>
            <p className="text-[#6497b1]">
              Review your details before entering the dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#03396c]">Student Details</h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-semibold text-slate-800">{userProfile?.name || ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Age</span>
                  <span className="font-semibold text-slate-800">{userProfile?.age || ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">School</span>
                  <span className="font-semibold text-slate-800">{userProfile?.school || ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-800">{userProfile?.location || ""}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Languages</span>
                  <span className="font-semibold text-slate-800">{userProfile?.languages || ""}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#03396c]">Next Steps</h2>
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#005b96]" />
                  Go to your dashboard
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#005b96]" />
                  Complete the initial survey (separate step)
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-[#005b96]" />
                  Year 4 personality test unlocks universities and alumni
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button size="lg" className="bg-[#005b96] hover:bg-[#03396c]" onClick={handleContinue}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
