
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {eq} from "drizzle-orm";
import { db } from "../../../lib/db";
import { userSubscription } from "../../../lib/db/schema";
import { stripe } from "../../../lib/stripe";

const return_url = process.env.NEXT_PUBLIC_BASE_URL + '/';
export async function GET() {
    try {
        const {userId} = await auth();
        const user = await currentUser();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const _userSubscriptions = await db.select().from(userSubscription).where(eq(userSubscription.userId,userId))
        if(_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId){
            //trying to cancle at the billing portal 
            const stripeSession =await stripe.billingPortal.sessions.create({
                customer:_userSubscriptions[0].stripeCustomerId,
                return_url
            })
            return NextResponse.json({url:stripeSession.url})
        }
        const stripeSession =await stripe.checkout.sessions.create({
            success_url: return_url,
            cancel_url: return_url,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data:{
                        currency:"usd",
                        product_data:{
                            name:"ChatPDF Pro",
                            description:"Unlimited access to ChatPDF Pro features"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month"
                        },
                    },
                    quantity:1,
                }
            ],
            metadata: {
                userId,
            },
        })
        return NextResponse.json({url:stripeSession.url})
        // user first time to subscribe

    } catch (error) {
        console.log("[STRIPE_ERROR]",error);
        return new NextResponse((error as {message:string}).message,{status:500})
        
    }
   
}