import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { db } from "../../../lib/db";
import {userSubscription} from "../../../lib/db/schema"
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function POST(req : Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;
    let event : Stripe.Event;
    try{
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SIGNING_SECRET as string);
    }catch(error){
        console.log("Error : ", error);
        return new NextResponse('webhook error', {status : 400});
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // new subscription created 
    if(event.type === 'checkout.session.completed'){
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        if(!session?.metadata?.userId){
            return new NextResponse('No user Id', {status : 400});
        }
        await db.insert(userSubscription).values(
            {
                userId : session?.metadata?.userId,
                stripeSubscriptionId : subscription?.id,
                stripeCustomerId : subscription?.customer as string,
                stripePriceId : subscription?.items?.data[0]?.price?.id,
                stripeCurrentPeriodEnd : new Date(subscription?.ended_at as number * 1000)
            }
        )
    }

    // subscription renewal means session already exist
    if(event.type === 'invoice.payment_succeeded') {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );
        await db.update(userSubscription).set({
            stripePriceId : subscription?.items?.data[0]?.price?.id,
            stripeCurrentPeriodEnd : new Date(subscription?.ended_at as number * 1000),

        }).where(eq(userSubscription.stripeSubscriptionId, subscription.id))
    }

    return new NextResponse(null, {status : 200});

}