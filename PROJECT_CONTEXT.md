# PROJECT_CONTEXT.md

# INNOCRAFT WEBSITE CMS
Version: 1.0
Status: Active Development

---

# PROJECT OVERVIEW

Project Name:
INNOCRAFT Website CMS

Purpose:

Build a modern company profile website with a custom CMS (Studio Dashboard) that allows non-technical users to manage all website content without touching the source code.

This is NOT an enterprise CMS.

This project prioritizes:

- simplicity
- maintainability
- clean architecture
- modern UI
- responsive design
- production readiness

---

# TECH STACK

Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS

Backend

- Supabase
- PostgreSQL

Storage

- Supabase Storage

Repository

- GitHub

Deployment Target

- Vercel

---

# IMPORTANT RULES

DO NOT redesign the UI.

DO NOT change layout.

DO NOT replace components.

DO NOT create unnecessary abstractions.

DO NOT over-engineer.

Always preserve the current design.

Backend improvements are allowed.

Frontend redesign is NOT allowed.

---

# WEBSITE SECTIONS

Public Website

- Hero
- About
- Benefits
- Projects
- Gallery
- Mentors
- Recruitment
- Contact
- Footer

Studio CMS

- Dashboard
- Hero
- About
- Benefits
- Projects
- Gallery
- Mentors
- Recruitment
- Contact
- Settings

---

# DATABASE

Supabase

Tables

Single Tables

hero

about

contact

settings

Collection Tables

benefits

projects

gallery

mentors

recruitment

All collection tables contain

- display_order
- is_active
- created_at
- updated_at

UUID is used as primary key.

---

# STORAGE

Bucket

media

Folders

hero/

about/

gallery/

projects/

mentors/

logos/

videos/

Files are stored inside Supabase Storage.

Database stores only the file path (preferred) or public URL if already implemented.

---

# CURRENT ARCHITECTURE

Current Flow

Studio CMS

↓

Supabase Database

↓

Homepage

Storage

↓

Supabase Storage

↓

Public URL

↓

Website

No localStorage should remain after migration is complete.

---

# CURRENT PROGRESS

Phase 1

✅ Complete

Public Website

---

Phase 2

✅ Complete

Studio CMS

---

Phase 3

✅ Complete

CMS using localStorage

---

Phase 4

✅ Complete

Authentication

- Login
- Logout
- Middleware

---

Phase 5

✅ Complete

Supabase Setup

Completed

- Project
- SDK
- Environment
- Supabase Client
- Database Migration
- Storage Bucket
- Storage Helper
- Storage Policies
- Upload Test

Everything works.

---

Phase 6

CMS Migration

Completed

✅ Hero Migration

Hero now:

- reads from Supabase
- saves to Supabase
- no longer uses localStorage

Remaining

About

Benefits

Projects

Gallery

Mentors

Recruitment

Contact

Settings

Migration order should continue exactly in that order.

---

# STORAGE HELPER

Already implemented

lib/supabase/storage.ts

Functions

uploadFile(file, folder)

deleteFile(path)

getPublicUrl(path)

Reuse this helper.

DO NOT rewrite it.

---

# SUPABASE

Already Configured

- client.ts
- env.local
- migration
- storage
- upload helper

Do NOT recreate them.

---

# DATABASE SCHEMA

hero

badge

title

subtitle

primary_button_text

primary_button_url

secondary_button_text

secondary_button_url

hero_video_url

---

about

title

description

image_url

---

benefits

title

description

icon

display_order

is_active

---

projects

title

description

image_url

age_range

duration

category

project_url

cta_text

display_order

is_active

---

gallery

image_url

title

description

display_order

is_active

---

mentors

photo_url

name

position

description

display_order

is_active

---

recruitment

title

location

employment_type

description

requirements

status

display_order

is_active

---

contact

company_name

address

whatsapp

email

maps_url

opening_hours

---

settings

website_name

logo_url

favicon_url

seo_title

seo_description

footer_text

instagram

facebook

youtube

---

# FUTURE PLAN

Phase 6

Finish CMS Migration

↓

Phase 7

Replace every URL textbox with file uploader.

Examples

Hero Video

Choose Video

Gallery Image

Choose Image

Mentor Photo

Choose Image

Logo

Choose Image

Everything uploads directly to Supabase Storage.

---

Phase 8

UX Improvements

- Loading
- Skeleton
- Better Validation
- Toast
- Confirm Dialog
- Error Handling
- Empty State
- Better Forms

---

Phase 9

Security

- Proper RLS
- Admin Role
- Secure Storage Policies
- Environment Cleanup

---

Phase 10

Production

- SEO
- Metadata
- Sitemap
- robots.txt
- Performance
- Image Optimization
- Deploy Vercel
- Custom Domain
- Analytics

---

# CODING STYLE

Keep code clean.

Prefer reusable helpers.

Prefer composition.

Do not duplicate code.

Prefer TypeScript strict mode.

Keep components small.

Do not introduce unnecessary libraries.

---

# IMPORTANT

Current priority is NOT adding new features.

Current priority is finishing Phase 6.

Complete every CMS migration first.

Only after every editor has migrated to Supabase should new features be added.

---

# NEXT TASK

Current task:

Phase 6.6.2

Migrate About CMS from localStorage to Supabase.

Rules

- Preserve UI
- Preserve UX
- Preserve Preview
- Do not redesign anything
- Use existing Supabase client
- Use existing Storage helper
- Build must pass
- TypeScript must pass

Continue from there.