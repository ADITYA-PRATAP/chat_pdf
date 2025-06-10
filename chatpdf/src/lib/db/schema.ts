
// import { timestamp } from "drizzle-orm/gel-core"
// import { varchar } from "drizzle-orm/mysql-core"
import {pgTable,
    serial,
    text,
    timestamp,
    varchar,
    integer,
    pgEnum
} from "drizzle-orm/pg-core" //pg core means postgurels 



export const userSystemEnum =pgEnum('user_system_enum',["user","system"])

export const chats =pgTable('chats',{
    id: serial('id').primaryKey(),
    pdfName: text('pdf_name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    userId:varchar('user_id',{length:256}).notNull(),
    filekey:text('file_key').notNull()
})

export const messages =pgTable('messages',{
    id:serial('id').primaryKey(),
    chatId:integer('chat_id').references(()=>chats.id).notNull(),
    content:text('content').notNull(),
    role:userSystemEnum('role').notNull(),
})

//drizzle orm
//drizzle kit