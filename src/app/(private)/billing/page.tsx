"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import useProject from "@/hooks/use-project";
import { createCheckoutSession } from "@/lib/stripe";
import { api } from "@/trpc/react";
import { useUser } from "@clerk/nextjs";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

const BillingPage = () => {
  const { data: dbUser } = api.project.getMyCredits.useQuery();
  const [creditsToBuy, setCreditsToBuy] = useState<number[]>([100]);

  // Need to use this for conditional rendering
  const { user } = useUser();
  const { selectedProjectId, project } = useProject();

  const creditsToBuyAmount = creditsToBuy[0]!;
  const price = (creditsToBuyAmount / 50).toFixed(2);

  return (
    <div>
      <h1 className="text-xl font-semibold">Billing</h1>
      <div className="h-2" />
      <p className="text-sm text-gray-500">
        You currently have {dbUser?.credits} credits.
      </p>
      <div className="h-2" />
      <Card className="rounded-md border px-4 py-2 text-orange-500">
        <div className="flex items-center gap-2">
          <InfoIcon className="size-4" />
          <p className="text-sm">
            Each credit allows you to index 1 file in a repository
          </p>
        </div>
        <p className="text-sm">
          E.g. If your project has 100 files, you will need 100 credits to index
          it.
        </p>
      </Card>
      <div className="h-4" />
      <Slider
        defaultValue={[100]}
        max={1000}
        min={50}
        step={10}
        onValueChange={(value) => setCreditsToBuy(value)}
        value={creditsToBuy}
      />
      <div className="h-4" />
      <Button
        onClick={() => {
          createCheckoutSession(creditsToBuyAmount);
        }}
      >
        Buy {creditsToBuyAmount} credits for ${price}
      </Button>
    </div>
  );
};

export default BillingPage;
