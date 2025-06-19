// This should be in a Server Component file like `app/page.tsx`
import { auth } from "@clerk/nextjs/server";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "../components/ui/button";
import Link from "next/link";
import {LogIn, Subscript} from "lucide-react"
import FileUpload from "../components/FileUpload";
import { checkSubscription } from "../lib/subscription";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { chats } from "../lib/db/schema";
import SubscriptionButton from "../components/SubscriptionButton";
export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;  
  const isPro = await checkSubscription();

  console.log(isPro,"ispro");

  let firstUser;

  if(userId){
    firstUser = await db.select().from(chats).where(eq(chats.userId, userId));
    if(firstUser){
      firstUser = firstUser[0];
    }
  }

  return (
    <div className="bg-gradient-to-bl from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex">
            <h1 className="mr-3 text-5xl font-bold">Chat with PDF</h1>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          </div>
          
          <div className="flex mt-2 gap-2">

           {isAuth&& firstUser && 
           <Link href={`/chat/${firstUser.id}`}>
            <Button variant="default" >Go to Chat</Button>
           </Link>
           }
            <SubscriptionButton  isPro={isPro}/>
           

          </div>
          <div className="flex mt-5 w-full justify-center">
            {isAuth ? (
              <FileUpload/>
            ) : (
              <Link href="/sign-in">
                <Button variant="default">Login to get Started!
                  <LogIn/>
                </Button>
              </Link>
            )}
          </div>
            <p className="max-w-xl mt-3 text-lg text-gray-700">
            Join millons of students, researchers and professionals as they chat with their PDFs.
            </p>
            
        </div>
      </div>
    </div>
  );
}
