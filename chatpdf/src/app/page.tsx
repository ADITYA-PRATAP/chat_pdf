// This should be in a Server Component file like `app/page.tsx`
import { auth } from "@clerk/nextjs/server";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "../components/ui/button";
import Link from "next/link";
import {LogIn} from "lucide-react"
import FileUpload from "../components/FileUpload";
export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="body">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex">
            <h1 className="mr-3 text-5xl font-bold">Chat with PDF</h1>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          </div>
          

          <div className="flex mt-4">
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
            <p className="max-w-xl mt-2 text-lg ">
            Join millons of students, researchers and professionals as they chat with their PDFs.
            </p>
            
        </div>
      </div>
    </div>
  );
}
