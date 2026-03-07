"use client";

import { CheckIcon, GemIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

export const PricingTable = () => {
  const features = [
    "Unlimited AI Conversations",
    "Full Knowledge Base Access",
    "AI Voice Assistant Enabled",
    "Advanced Chat Customization",
    "Team Collaboration (Unlimited)",
    "Priority Support",
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-y-8 py-4">
      <Card className="w-full max-w-lg border-2 border-primary/20 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4">
          <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Active Plan
          </div>
        </div>

        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GemIcon className="size-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Unlimited Plan</CardTitle>
          <CardDescription className="text-base">
            Everything unlocked for NAMDTU
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="text-center mb-8">
            <span className="text-5xl font-extrabold">$0</span>
            <span className="text-muted-foreground ml-2">/ lifetime</span>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckIcon className="size-3" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="bg-muted/50 pt-6">
          <Button className="w-full bg-gradient-to-r from-primary to-[#0b63f3] hover:opacity-90 transition-opacity" size="lg" disabled>
            Plan Managed by Admin
          </Button>
        </CardFooter>
      </Card>

      <p className="text-sm text-muted-foreground text-center max-w-md italic">
        "Your organization is currently on a custom lifetime enterprise plan.
        All premium features are fully enabled."
      </p>
    </div>
  );
};