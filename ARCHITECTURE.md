# ARCHITECTURE.md

# INNOCRAFT Website CMS
Architecture Documentation

Version: 1.0

---

# PURPOSE

This document explains the technical architecture of the project.

It should be read before modifying any code.

The architecture described here should be preserved.

---

# HIGH LEVEL ARCHITECTURE

Public Website

↓

Studio CMS

↓

Supabase

↓

Storage

↓

Homepage

The Studio CMS is the only place where content is edited.

The homepage only displays data.

---

# APPLICATION LAYERS

Presentation Layer

Next.js App Router

↓

CMS Layer

Studio Dashboard

↓

Service Layer

Supabase Client

Storage Helper

↓

Database Layer

Supabase PostgreSQL

↓

Storage Layer

Supabase Storage

---

# DESIGN PRINCIPLES

Keep architecture simple.

Avoid unnecessary abstraction.

Prefer reusable helpers.

Prefer composition.

Avoid duplicated code.

Do not introduce unnecessary libraries.

Maintain strict TypeScript.

---

# DIRECTORY STRUCTURE

app/

Public Website

Studio CMS

components/

Reusable UI

hooks/

Reusable Hooks

lib/

supabase/

client.ts

storage.ts

supabase/

migrations/

Database migrations

public/

Static assets only

---

# SUPABASE

Database

PostgreSQL

Storage

Bucket

media

Current folders

hero/

about/

gallery/

projects/

mentors/

logos/

videos/

Files are uploaded through storage helper.

Never upload directly from components.

---

# STORAGE FLOW

Choose File

↓

uploadFile()

↓

Supabase Storage

↓

Return

path

publicUrl

↓

Save to Database

↓

Homepage loads file

---

# DATABASE DESIGN

Single Tables

hero

about

contact

settings

Only one row should exist.

Application logic should update the existing row instead of creating duplicates.

Collection Tables

benefits

projects

gallery

mentors

recruitment

Collections support

display_order

is_active

created_at

updated_at

UUID is used everywhere.

---

# STORAGE HELPER

Location

lib/supabase/storage.ts

Functions

uploadFile()

deleteFile()

getPublicUrl()

Reuse this helper everywhere.

Never duplicate upload logic.

---

# SUPABASE CLIENT

Location

lib/supabase/client.ts

Only one client instance should exist.

Do not create multiple Supabase clients.

---

# CMS DATA FLOW

Editor opens

↓

Read from Supabase

↓

Populate form

↓

User edits

↓

Save

↓

Update existing row

↓

Homepage reads latest data

No localStorage should remain after migration.

---

# HERO ARCHITECTURE

Hero already migrated.

Flow

Studio Hero

↓

Supabase hero table

↓

Homepage

This implementation becomes the reference for all future migrations.

About migration should follow the same pattern.

Benefits migration should follow the same pattern.

Every section should follow Hero architecture.

---

# FILE UPLOAD STRATEGY

Current

Storage helper uploads files.

Future

Replace every URL textbox with file uploader.

Examples

Hero Video

Hero Image

Gallery Image

Mentor Photo

Logo

Favicon

All uploads must go through

storage.ts

---

# ERROR HANDLING

Always

try

catch

Return readable error messages.

Do not silently ignore errors.

---

# TYPESCRIPT

Strict mode.

No any.

Prefer explicit types.

---

# PERFORMANCE

Avoid unnecessary re-render.

Avoid duplicate requests.

Reuse helper functions.

Keep components focused.

---

# SECURITY

Current

Storage Policies are open for development.

Future

Implement proper RLS.

Restrict CMS to authenticated admin users.

Harden storage policies.

Do not implement this until CMS migration is complete.

---

# CURRENT DEVELOPMENT PRIORITY

Finish Phase 6.

Complete migration in this order:

Hero

About

Benefits

Projects

Gallery

Mentors

Recruitment

Contact

Settings

Only after every migration is complete should new features be added.

---

# DO NOT CHANGE

Do not redesign UI.

Do not change layout.

Do not remove components.

Do not change architecture.

Do not rewrite storage helper.

Do not recreate Supabase client.

Do not recreate database schema.

Only extend existing architecture.

---

# FUTURE IMPROVEMENTS

Phase 7

Media Upload UI

Replace URL textboxes with upload components.

Phase 8

UX polish

Loading

Toast

Validation

Better preview

Phase 9

Security

RLS

Admin Role

Storage Permissions

Phase 10

Production

SEO

Performance

Analytics

Deploy

Monitoring

---

# FINAL GOAL

The final system should allow a non-technical administrator to manage the entire website through Studio CMS without opening VS Code, editing source code, or redeploying the application for content changes.