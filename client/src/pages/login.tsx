import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { userProfileSchema } from "@shared/schema";
import { z } from "zod";
import { ChevronRight } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { updateUserProfile, setSummaryComplete } = useStore();

  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      school: "",
      languages: "",
    },
  });

  const onSubmit = (data: z.infer<typeof userProfileSchema>) => {
    updateUserProfile(data);
    setSummaryComplete(false);
    setLocation("/summary");
  };

  return (
    <div className="min-h-screen bg-[#011f4b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#005b96] rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#6497b1] rounded-full opacity-10 blur-3xl" />
      </div>

      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-0 overflow-hidden z-10">
        <div className="h-2 bg-[#b3cde0]">
          <motion.div
            className="h-full bg-[#005b96]"
            initial={{ width: "0%" }}
            animate={{ width: "50%" }}
          />
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[#011f4b] mb-2">
              Student Login
            </h1>
            <p className="text-[#6497b1]">
              Enter your profile details to get started.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="bg-slate-50 border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="16"
                          type="number"
                          {...field}
                          className="bg-slate-50 border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lincoln High School"
                        {...field}
                        className="bg-slate-50 border-slate-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York, NY"
                          {...field}
                          className="bg-slate-50 border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages Spoken</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="English, Spanish"
                          {...field}
                          className="bg-slate-50 border-slate-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" size="lg" className="bg-[#005b96] hover:bg-[#03396c]">
                  Continue to Summary <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  );
}
