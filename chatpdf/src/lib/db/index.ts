import {neon,neonConfig} from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"


if(!process.env.DATABASE_URL){
    throw new Error ("DataBase not Connect due to URL")
}

const sql = neon(process.env.DATABASE_URL);

export const db =drizzle(sql);