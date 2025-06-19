import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { db } from "../../../lib/db";
import {userSubscription} from "../../../lib/db/schema"
import { eq } from "drizzle-orm";
export async function POST(req: Request) {
    const body = await req.json()
    const signature = (await headers()).get('Stripe-Signature')
    let event : Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
        
    } catch (error) {
        console.log(error)
        return new Response('Webhook Error', {status: 400},)
    }

    const session = event.data.object as Stripe.Checkout.Session

    if(event.type == 'checkout.session.completed'){
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        if(!session?.metadata?.userId){
            return new Response('User not found', {status: 400},)
        }

        await db.insert(userSubscription).values({
            userId: session?.metadata?.userId,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        })
    }
    if(event.type == 'invoice.payment_succeeded'){
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        await db.update(userSubscription).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        }).where(eq(userSubscription.stripeSubscriptionId,subscription.id))
    }
    return new Response('Success', {status: 200},)
   
}