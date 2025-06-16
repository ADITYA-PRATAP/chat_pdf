CREATE TYPE "public"."user_system_enum" AS ENUM('user', 'system');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"pdf_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" varchar(256) NOT NULL,
	"file_key" text NOT NULL,
	"pdf_url" varchar(1024) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_id" integer NOT NULL,
	"content" text NOT NULL,
	"role" "user_system_enum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE no action ON UPDATE no action;