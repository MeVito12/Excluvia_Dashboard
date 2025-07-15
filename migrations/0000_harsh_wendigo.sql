CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"location" varchar(255),
	"client_name" varchar(255),
	"client_email" varchar(255),
	"client_phone" varchar(20),
	"status" varchar(20) DEFAULT 'scheduled',
	"user_id" integer NOT NULL,
	"scheduled_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bot_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"business_category" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"welcome_message" text,
	"menu_options" jsonb DEFAULT '[]',
	"auto_responses" jsonb DEFAULT '{}',
	"working_hours" jsonb DEFAULT '{}',
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "loyalty_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"type" varchar(20) NOT NULL,
	"discount_percentage" integer,
	"discount_amount" numeric(10, 2),
	"min_purchase_amount" numeric(10, 2),
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true,
	"target_audience" varchar(20) DEFAULT 'all',
	"business_category" varchar(50) NOT NULL,
	"message_template" text NOT NULL,
	"sent_count" integer DEFAULT 0,
	"usage_count" integer DEFAULT 0,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"address" text,
	"business_category" varchar(50) NOT NULL,
	"total_spent" numeric(10, 2) DEFAULT '0',
	"last_purchase" timestamp,
	"is_active" boolean DEFAULT true,
	"notes" text,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "integration_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"platform" varchar(50) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"expires_at" timestamp,
	"is_active" boolean DEFAULT false,
	"settings" jsonb DEFAULT '{}',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notification_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email_enabled" boolean DEFAULT false,
	"telegram_enabled" boolean DEFAULT false,
	"whatsapp_enabled" boolean DEFAULT false,
	"email_address" varchar(255),
	"telegram_chat_id" varchar(100),
	"whatsapp_number" varchar(20),
	"default_reminder_time" integer DEFAULT 60,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100) NOT NULL,
	"sku" varchar(100),
	"stock" integer DEFAULT 0,
	"min_stock" integer DEFAULT 5,
	"price" numeric(10, 2) NOT NULL,
	"is_perishable" boolean DEFAULT false,
	"manufacturing_date" date,
	"expiry_date" date,
	"business_category" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"appointment_id" integer NOT NULL,
	"reminder_type" varchar(20) NOT NULL,
	"reminder_time" timestamp NOT NULL,
	"sent" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_ids" jsonb NOT NULL,
	"client_id" integer,
	"client_name" varchar(255),
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_method" varchar(50) DEFAULT 'cash',
	"status" varchar(20) DEFAULT 'completed',
	"notes" text,
	"business_category" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"sale_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"type" varchar(20) NOT NULL,
	"quantity" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"reference" varchar(100),
	"user_id" integer,
	"movement_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "support_agents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(20),
	"status" varchar(20) DEFAULT 'offline',
	"business_category" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true,
	"specialties" jsonb DEFAULT '[]',
	"user_id" integer NOT NULL,
	"last_seen" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"business_category" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"client_name" varchar(255),
	"last_message" text,
	"message_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"business_category" varchar(50) NOT NULL,
	"user_id" integer NOT NULL,
	"last_activity" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
