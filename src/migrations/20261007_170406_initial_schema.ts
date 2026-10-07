import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fr', 'en', 'es', 'zh');
  CREATE TYPE "public"."enum_communiques_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__communiques_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__communiques_v_published_locale" AS ENUM('fr', 'en', 'es', 'zh');
  CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_published_locale" AS ENUM('fr', 'en', 'es', 'zh');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'editor');
  CREATE TABLE "communiques" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"thumbnail_id" integer,
  	"file_id" integer,
  	"show_in_footer" boolean DEFAULT false,
  	"legacy_thumbnail" varchar,
  	"legacy_thumbnail_width" numeric,
  	"legacy_thumbnail_height" numeric,
  	"legacy_file" varchar,
  	"wp_id" numeric,
  	"legacy_date" timestamp(3) with time zone,
  	"legacy_zh_date_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_communiques_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "communiques_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "communiques_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_communiques_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_thumbnail_id" integer,
  	"version_file_id" integer,
  	"version_show_in_footer" boolean DEFAULT false,
  	"version_legacy_thumbnail" varchar,
  	"version_legacy_thumbnail_width" numeric,
  	"version_legacy_thumbnail_height" numeric,
  	"version_legacy_file" varchar,
  	"version_wp_id" numeric,
  	"version_legacy_date" timestamp(3) with time zone,
  	"version_legacy_zh_date_label" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__communiques_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__communiques_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_communiques_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_communiques_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"thumbnail_id" integer,
  	"is_video" boolean DEFAULT false,
  	"file_id" integer,
  	"external_url" varchar,
  	"legacy_thumbnail" varchar,
  	"legacy_thumbnail_width" numeric,
  	"legacy_thumbnail_height" numeric,
  	"legacy_file" varchar,
  	"wp_id" numeric,
  	"legacy_date" timestamp(3) with time zone,
  	"legacy_zh_date_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_thumbnail_id" integer,
  	"version_is_video" boolean DEFAULT false,
  	"version_file_id" integer,
  	"version_external_url" varchar,
  	"version_legacy_thumbnail" varchar,
  	"version_legacy_thumbnail_width" numeric,
  	"version_legacy_thumbnail_height" numeric,
  	"version_legacy_file" varchar,
  	"version_wp_id" numeric,
  	"version_legacy_date" timestamp(3) with time zone,
  	"version_legacy_zh_date_label" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__news_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_locales" (
  	"version_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"legacy_path" varchar,
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"communiques_id" integer,
  	"news_id" integer,
  	"tags_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "communiques" ADD CONSTRAINT "communiques_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "communiques" ADD CONSTRAINT "communiques_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "communiques_locales" ADD CONSTRAINT "communiques_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."communiques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "communiques_rels" ADD CONSTRAINT "communiques_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."communiques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "communiques_rels" ADD CONSTRAINT "communiques_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_communiques_v" ADD CONSTRAINT "_communiques_v_parent_id_communiques_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."communiques"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_communiques_v" ADD CONSTRAINT "_communiques_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_communiques_v" ADD CONSTRAINT "_communiques_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_communiques_v_locales" ADD CONSTRAINT "_communiques_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_communiques_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_communiques_v_rels" ADD CONSTRAINT "_communiques_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_communiques_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_communiques_v_rels" ADD CONSTRAINT "_communiques_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_file_id_media_id_fk" FOREIGN KEY ("version_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_locales" ADD CONSTRAINT "_news_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tags_locales" ADD CONSTRAINT "tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_communiques_fk" FOREIGN KEY ("communiques_id") REFERENCES "public"."communiques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "communiques_thumbnail_idx" ON "communiques" USING btree ("thumbnail_id");
  CREATE INDEX "communiques_file_idx" ON "communiques" USING btree ("file_id");
  CREATE INDEX "communiques_wp_id_idx" ON "communiques" USING btree ("wp_id");
  CREATE INDEX "communiques_updated_at_idx" ON "communiques" USING btree ("updated_at");
  CREATE INDEX "communiques_created_at_idx" ON "communiques" USING btree ("created_at");
  CREATE INDEX "communiques__status_idx" ON "communiques" USING btree ("_status");
  CREATE UNIQUE INDEX "communiques_locales_locale_parent_id_unique" ON "communiques_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "communiques_rels_order_idx" ON "communiques_rels" USING btree ("order");
  CREATE INDEX "communiques_rels_parent_idx" ON "communiques_rels" USING btree ("parent_id");
  CREATE INDEX "communiques_rels_path_idx" ON "communiques_rels" USING btree ("path");
  CREATE INDEX "communiques_rels_tags_id_idx" ON "communiques_rels" USING btree ("tags_id");
  CREATE INDEX "_communiques_v_parent_idx" ON "_communiques_v" USING btree ("parent_id");
  CREATE INDEX "_communiques_v_version_version_thumbnail_idx" ON "_communiques_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_communiques_v_version_version_file_idx" ON "_communiques_v" USING btree ("version_file_id");
  CREATE INDEX "_communiques_v_version_version_wp_id_idx" ON "_communiques_v" USING btree ("version_wp_id");
  CREATE INDEX "_communiques_v_version_version_updated_at_idx" ON "_communiques_v" USING btree ("version_updated_at");
  CREATE INDEX "_communiques_v_version_version_created_at_idx" ON "_communiques_v" USING btree ("version_created_at");
  CREATE INDEX "_communiques_v_version_version__status_idx" ON "_communiques_v" USING btree ("version__status");
  CREATE INDEX "_communiques_v_created_at_idx" ON "_communiques_v" USING btree ("created_at");
  CREATE INDEX "_communiques_v_updated_at_idx" ON "_communiques_v" USING btree ("updated_at");
  CREATE INDEX "_communiques_v_snapshot_idx" ON "_communiques_v" USING btree ("snapshot");
  CREATE INDEX "_communiques_v_published_locale_idx" ON "_communiques_v" USING btree ("published_locale");
  CREATE INDEX "_communiques_v_latest_idx" ON "_communiques_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_communiques_v_locales_locale_parent_id_unique" ON "_communiques_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_communiques_v_rels_order_idx" ON "_communiques_v_rels" USING btree ("order");
  CREATE INDEX "_communiques_v_rels_parent_idx" ON "_communiques_v_rels" USING btree ("parent_id");
  CREATE INDEX "_communiques_v_rels_path_idx" ON "_communiques_v_rels" USING btree ("path");
  CREATE INDEX "_communiques_v_rels_tags_id_idx" ON "_communiques_v_rels" USING btree ("tags_id");
  CREATE INDEX "news_thumbnail_idx" ON "news" USING btree ("thumbnail_id");
  CREATE INDEX "news_file_idx" ON "news" USING btree ("file_id");
  CREATE INDEX "news_wp_id_idx" ON "news" USING btree ("wp_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version_thumbnail_idx" ON "_news_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_news_v_version_version_file_idx" ON "_news_v" USING btree ("version_file_id");
  CREATE INDEX "_news_v_version_version_wp_id_idx" ON "_news_v" USING btree ("version_wp_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_snapshot_idx" ON "_news_v" USING btree ("snapshot");
  CREATE INDEX "_news_v_published_locale_idx" ON "_news_v" USING btree ("published_locale");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_news_v_locales_locale_parent_id_unique" ON "_news_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_locales_locale_parent_id_unique" ON "tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_legacy_path_idx" ON "media" USING btree ("legacy_path");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_communiques_id_idx" ON "payload_locked_documents_rels" USING btree ("communiques_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "communiques" CASCADE;
  DROP TABLE "communiques_locales" CASCADE;
  DROP TABLE "communiques_rels" CASCADE;
  DROP TABLE "_communiques_v" CASCADE;
  DROP TABLE "_communiques_v_locales" CASCADE;
  DROP TABLE "_communiques_v_rels" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_locales" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "tags_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_communiques_status";
  DROP TYPE "public"."enum__communiques_v_version_status";
  DROP TYPE "public"."enum__communiques_v_published_locale";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";
  DROP TYPE "public"."enum__news_v_published_locale";
  DROP TYPE "public"."enum_users_role";`)
}
