import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, Sparkles, CheckCircle2 } from "lucide-react";

const appointmentSchema = z.object({
  date: z.string().min(1, "Select a date"),
  time: z.string().min(1, "Select a time"),
  topic: z.string().min(1, "Add a topic"),
  notes: z.string().optional(),
});

type AppointmentForm = z.infer<typeof appointmentSchema>;

const TOPIC_SUGGESTIONS = [
  "University shortlist review",
  "Scholarship and funding plan",
  "Career pathway alignment",
  "Application timeline",
  "Course selection strategy",
];

const TIME_SUGGESTIONS = ["09:00", "11:30", "14:00", "16:30"];

export default function AiAppointment() {
  const { addMeetingRequest } = useStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<AppointmentForm | null>(null);

  const form = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      time: "",
      topic: "",
      notes: "",
    },
  });

  const onSubmit = (data: AppointmentForm) => {
    addMeetingRequest({
      type: "ai",
      date: data.date,
      time: data.time,
      topic: data.topic,
      notes: data.notes || "",
      requestedAt: new Date().toISOString(),
    });
    setSubmittedData(data);
    setSubmitted(true);
    toast({
      title: "Appointment Requested",
      description: "Your AI meeting request has been queued.",
    });
  };

  const handleScheduleAnother = () => {
    setSubmitted(false);
    setSubmittedData(null);
    form.reset();
  };

  if (submitted && submittedData) {
    const formattedDate = new Date(submittedData.date).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 12 }}
            className="bg-green-100 p-6 rounded-full mb-6"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-display font-bold text-[#011f4b] mb-4"
          >
            AI Meeting Scheduled
          </motion.h2>
          <p className="text-gray-500 max-w-md mb-8">
            Your request is locked in. We will confirm the time and send a calendar invite.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-xl"
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarCheck className="h-5 w-5 text-[#005b96]" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-[#011f4b]">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#005b96]" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-[#011f4b]">{submittedData.time}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Topic</p>
                  <p className="font-semibold text-[#011f4b]">{submittedData.topic}</p>
                </div>
                {submittedData.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm text-gray-700">{submittedData.notes}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 text-sm text-gray-500">
                  We will confirm within 24 hours and share a video link.
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button className="bg-[#005b96] hover:bg-[#03396c]" onClick={handleScheduleAnother}>
              Schedule Another
            </Button>
            <Button variant="outline">Add to Calendar</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <header className="mb-8">
          <p className="text-xs uppercase tracking-widest text-[#6497b1]">AI Guidance</p>
          <h1 className="text-3xl font-display font-bold text-[#011f4b]">AI Appointment Builder</h1>
          <p className="text-gray-500 mt-2">
            Design a focused session and we will match you with an AI advisor.
          </p>
        </header>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 text-sm text-[#005b96] mb-6">
              <Sparkles className="h-4 w-4" />
              30-minute strategy session
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="bg-slate-50 border-slate-200" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="bg-slate-50 border-slate-200" />
                        </FormControl>
                        <FormMessage />
                        <div className="flex flex-wrap gap-2 pt-2">
                          {TIME_SUGGESTIONS.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => form.setValue("time", time, { shouldValidate: true })}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Topic</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="University shortlist, scholarship plan, career strategy"
                          {...field}
                          className="bg-slate-50 border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex flex-wrap gap-2 pt-2">
                        {TOPIC_SUGGESTIONS.map((topic) => (
                          <Button
                            key={topic}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.setValue("topic", topic, { shouldValidate: true })}
                          >
                            {topic}
                          </Button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any constraints or context the AI should know"
                          {...field}
                          className="bg-slate-50 border-slate-200 resize-none"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full bg-[#005b96] hover:bg-[#03396c]">
                  Request Appointment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-lg bg-[#011f4b] text-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">What to Expect</h2>
              <p className="text-sm text-blue-100">
                Your AI advisor will help you prioritize universities, align goals, and create a 90-day action plan.
              </p>
              <div className="text-sm text-blue-100 space-y-2">
                <p>Session length: 30 minutes</p>
                <p>Format: Video + shared notes</p>
                <p>Follow-up: Summary with next steps</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-[#011f4b] mb-3">Prepare These</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Bring your top 3 universities or career paths.</p>
                <p>Have your latest grades or achievements ready.</p>
                <p>List any constraints like budget or location.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
