# Innocraft — Project Context

## 1. Project Overview
**Name**: Innocraft (INNOCRAFT Website CMS)
**Purpose**: Premium bilingual experience for parents exploring an offline Minecraft Addon Development class for children. It also includes a Studio CMS for editing content.
**Target Audience**: Parents exploring offline Minecraft Addon Development classes for their children.
**Main Functionality**:
- Public website for displaying course information, curriculum, projects, and gallery.
- Studio CMS dashboard for admins to manage content (Hero, About, Benefits, Projects, Gallery, Mentors, Recruitment, Contact).
**Platform**: Web (Next.js)

## 2. Current Status
**Status**: In Development (Phase 4.2 - Migrating CMS connection for About section).
**Languages**: Indonesian (ID) and English (EN).
**Deployment/Platform**: Vercel/similar Node.js host (using Next.js).
**Frameworks**: Next.js (App Router) version 16.2.11, React 19.2.8.

## 3. Tech Stack
- **Framework**: Next.js 16.2.11 (App Router)
- **Language**: TypeScript 5.6.3, React 19.2.8
- **Styling**: Tailwind CSS 3.4.15
- **UI**: @radix-ui/react-slot, custom components
- **Icons**: lucide-react
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (used in `/studio/login`)
- **Backend / Services**: Next.js Server Actions / API Routes + Supabase Client (`@supabase/ssr`, `@supabase/supabase-js`)
- **Storage**: Supabase Storage
- **Animation**: Framer Motion 12.0.0
- **Form handling**: Native HTML FormData
- **Localization**: Custom implementation using React context (`lib/i18n/language-provider.tsx`) and JSON dictionaries (`messages/`).
- **Fonts**: Google Fonts (Inter, Poppins)

## 4. Project Structure
- `app/` → Next.js App Router containing public pages and Studio CMS routes.
- `components/` → Reusable UI components.
  - `layout/` → Navbar and Footer.
  - `sections/` → Individual sections for the main page (Hero, About, Benefits, etc.).
  - `ui/` → Reusable primitive components (buttons, etc.).
- `hooks/` → Custom React hooks.
- `lib/` → Utilities and configurations (i18n, studio context, supabase clients, storage helper).
- `messages/` → Localization dictionaries (`en.json`, `id.json`).
- `public/` → Static assets (logos, media).
- `styles/` → Global CSS styles.
- `supabase/migrations/` → Database schemas and row-level security (RLS) policies.
- `types/` → TypeScript type definitions.

## 5. Routes
| Route | Page | Function | Status |
|---|---|---|---|
| `/` | `app/page.tsx` | Main public landing page | Implemented |
| `/studio` | `app/studio/page.tsx` | Studio CMS Dashboard | Implemented |
| `/studio/login` | `app/studio/login/page.tsx` | Studio authentication page | Implemented |
| `/studio/*` | `app/studio/...` | Various CMS modules (hero, about, gallery, etc.) | Partial / Implemented |

**Routing specifics**:
- Uses Next.js App router.
- No dynamic locales in URL path (e.g., `/en`), locale is managed in client state via `LanguageProvider`.

## 6. Website Sections
- **Navbar**: Main navigation, includes language switcher and CTA button.
- **Hero**: `components/sections/hero.tsx` - Initial introduction section, main CTA. Contains cinematic elements and video.
- **AddonDevelopment**: `components/sections/addon-development.tsx` - Details about addon development for Minecraft.
- **CurriculumSection**: `components/sections/curriculum-section.tsx` - Course curriculum breakdown.
- **WhyMinecraft**: `components/sections/why-minecraft.tsx` - Benefits of learning via Minecraft.
- **AboutInnocraft**: `components/sections/about-innocraft.tsx` - About the organization.
- **Mentor**: `components/sections/mentor.tsx` - Mentor showcase.
- **Projects**: `components/sections/projects.tsx` - Student projects showcase.
- **Gallery**: `components/sections/gallery.tsx` - Photo gallery of activities.
- **Benefits**: `components/sections/benefits.tsx` - Key benefits of the program.
- **Opportunities**: `components/sections/opportunities.tsx` - Future opportunities for students.
- **ClassInfo**: `components/sections/class-info.tsx` - Information regarding classes.
- **FinalCta**: `components/sections/final-cta.tsx` - Final call to action before footer.
- **Contact**: `components/sections/contact.tsx` - Contact information and links.
- **Footer**: `components/layout/footer.tsx` - Website footer.

## 7. UI & Design System
- **Overall visual direction**: Premium, dynamic, cinematic, and modern. Uses floating 3D cubes, blobs, particles, and depth fogs.
- **Colors**:
  - `primaryBg`: `#FFCFC9` (Peach)
  - `websiteBg`: `#FFF8F6`
  - `accentSoft`: `#EDE4F0`
  - `accentBlue`: `#E2EAF8`
  - `heading`: `#0F172A`
  - `paragraph`: `#6B7280`
  - `buttonBg`: `#0F172A`
- **Typography**: Inter (sans) and Poppins (display).
- **Border radius**: High usage of large border radii (`1.5rem` to `2rem`).
- **Shadows**: Soft, multi-layered drop shadows, inset glows, and cinematic spotlights.
- **Background**: "Breathing" animated background with blobs and pixel patterns.
- **Animation**: Continuous floating blocks, pixel glows, sparkles, and terrain drift animations.

## 8. Design Rules
- Maintain the clean, modern, and intentional visual style.
- Keep the generous negative space.
- Preserve clear typography hierarchy.
- **DO NOT** change the UI to look like a generic AI-generated SaaS design.
- Avoid over-using rounded cards where not necessary, though current layout uses cards extensively with specific premium styling (e.g., `section-premium`, `gallery-card`).
- Do not remove the cinematic background components (`decoration-blob`, `decoration-cube`, `hero-spotlight`).

## 9. Component Architecture
### LanguageSwitcher
- **File**: `components/language-switcher.tsx`
- **Purpose**: Toggle between ID and EN languages.
- **Used by**: Navbar
- **Important behavior**: Updates locale in context and updates layout without reloading the page.

### Storage Helper
- **File**: `lib/supabase/storage.ts`
- **Purpose**: Upload, delete, and get public URLs for files.
- **Important behavior**: Reusable helper that must be used for all Supabase storage operations.

## 10. Data Flow
**Public Page**:
UI → Static Content (Locale Dictionaries) / Database (Supabase Client) → Render.

**Studio CMS**:
Studio Form → Read from Supabase (Populate) → User Edits → Save (Update existing row in DB via Server Action / Supabase Client).

## 11. Supabase & Database
### Database Tables
| Table | Purpose | Important Columns |
|---|---|---|
| `hero` | Hero section data | `title`, `subtitle`, `video_url`, `thumbnail_url` |
| `about` | About section data | `title`, `description`, `subtitle` |
| `contact` | Contact details | `email`, `phone`, `whatsapp`, `instagram`, etc. |
| `settings` | Global settings | (Single row) |
| `benefits` | Benefits items | `title`, `description`, `icon`, `display_order` |
| `projects` | Student projects | `title`, `description`, `image_url` |
| `gallery` | Image gallery | `image_url`, `caption`, `display_order` |
| `mentors` | Mentor profiles | `name`, `role`, `bio`, `photo_url` |
| `recruitment` | Recruitment data | `title`, `description`, `is_active` |
| `addon_development` | Addon dev section | `title`, `description` |
| `benefit_section` | Benefit section data | (Not fully verified) |

### RLS / Security
- Proper RLS implemented via migrations (`20260722_secure_cms_rls.sql`, `20260722_secure_storage_policies.sql`).
- Only Authenticated users can insert, update, or delete records in the tables and storage assets.
- Public users can read most tables.

## 12. Authentication
- **Login**: `app/studio/login/page.tsx`
- **Logout**: Handled via Studio CMS `logout` route/action.
- **Protected Pages**: `/studio` (Requires authentication to manage CMS data).
- **Session Handling**: `@supabase/ssr` cookies.

## 13. Localization
- **Dictionaries**: Located in `messages/` (`en.json`, `en.ts`, `id.json`, `id.ts`).
- **Locale Selection**: Handled by `LanguageProvider` in `lib/i18n/language-provider.tsx`.
- **Calling Text**: Using custom context reading (specific hook not explicitly verified, likely via `LanguageProvider`).
- **Available Languages**: Indonesian (ID), English (EN).

## 14. Environment Variables
| Variable | Purpose | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase instance URL | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Yes |

## 15. Development Commands
- `npm run dev`: Starts Next.js development server using Turbopack (`next dev --turbopack`).
- `npm run build`: Builds the application for production (`next build`).
- `npm run start`: Starts the production server (`next start`).
- (No specific lint, test, or typecheck scripts explicitly defined in package.json, though standard Next.js behavior applies).

## 16. Implemented Features
## Implemented
- [x] Public Homepage layout and styling
- [x] Language switching (ID/EN)
- [x] Supabase Database & Storage initialization
- [x] Studio Authentication
- [x] CMS structure and RLS setup
- [x] Hero section CMS migration (completed per `ARCHITECTURE.md`)

## Partial / In Progress
- [ ] Phase 4.2: Tentang (About) public section CMS connection
- [ ] Migrate other sections to use CMS data (Benefits, Projects, Gallery, etc.)

## Not Implemented / Planned
- [ ] Media Upload UI (replacing URL textboxes in Studio)
- [ ] UX polish (Loading, Toast, Validation)
- [ ] Advanced SEO, Monitoring, and Analytics

## 17. Known Issues
### Potential Issues
- Hydration mismatch issues (mentioned in `TODO.md` regarding the About section mock data).
- TypeScript errors (mentioned in `TODO.md` to be fixed).

## 18. Important Files
## Important Files for Future AI
- `ARCHITECTURE.md`
Purpose: Core architectural guidelines and rules.
- `app/page.tsx`
Purpose: The entry point for the public landing page.
- `app/layout.tsx`
Purpose: Core layout containing cinematic background and providers.
- `lib/supabase/client.ts`
Purpose: Supabase client configuration.
- `lib/supabase/storage.ts`
Purpose: The single source of truth for file uploads.
- `lib/i18n/language-provider.tsx`
Purpose: Manages the global localization state.
- `tailwind.config.ts`
Purpose: Design tokens and keyframe animations.
- `styles/globals.css`
Purpose: Custom styling for premium UI components.
- `TODO.md`
Purpose: Current project tasks and immediate focus.

## 19. Rules for Future AI Changes
- **Always read `PROJECT_CONTEXT.md` and `ARCHITECTURE.md` first.**
- Inspect actual files before editing.
- **Do not rewrite** large components for minor changes.
- **Preserve the visual identity**: maintain the cinematic, clean, and intentional design.
- Avoid generic AI slop.
- **Do not break** the responsive layout.
- **Do not modify** the database schema without a valid reason and proper migration.
- **Do not remove** existing features.
- Understand the full authentication flow before editing it.
- Keep changes minimal and focused.
- Run `npm run build` to verify changes.
- Report all modified files after completion.

## 20. Git / Development State
- **Current Branch**: `main`
- **Working Tree**: Clean (no uncommitted changes).
- **Remote**: Synchronized with `origin/main`.

---

## Context Last Audited
**Tanggal audit**: 2026-09-01
**Branch**: main
**Audit scope**: Entire project structure, tech stack, database schema, design rules, and TODOs.
**Notes**: Project is actively undergoing CMS migration starting with the Hero and About sections.