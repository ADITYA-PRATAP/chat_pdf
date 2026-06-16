"use client";

import React, { useState } from "react";
import { Button } from "../components/ui/button";
import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  isPro: boolean;
  className?: string;
};

const SubscriptionButton = ({ isPro, className }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast.error("Couldn't open billing. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      onClick={handleSubscribe}
      variant={isPro ? "outline" : "secondary"}
      size="lg"
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        !isPro && <Sparkles className="h-4 w-4" />
      )}
      {isPro ? "Manage subscription" : "Upgrade to Pro"}
    </Button>
  );
};

export default SubscriptionButton;
