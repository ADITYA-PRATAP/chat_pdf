import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { userSubscription } from "./db/schema";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const checkSubscription = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }


  const userSubscriptions = await db
    .select()
    .from(userSubscription)
    .where(eq(userSubscription.userId, userId));

    

  if (!userSubscriptions[0]) {
    return false;
  }

  const subscription = userSubscriptions[0];

  const isValid =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid;
};