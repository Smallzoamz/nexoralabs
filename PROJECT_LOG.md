# Project Log - VELOZI | Dev

## Project Overview
**Project Name:** VELOZI | Dev  
**Type:** Website Design & Maintenance Service  
**Target:** Small-Medium Business (SME)  
**Created:** 2026-02-19

---

## Recent Updates

### 2026-03-01 | File: SEOSettings.tsx | Status: ✅ Completed
- **Change:** Fixed OG Image Upload & DB Synchronization
- **Details:** 
  1. **Repair:** Fixed a broken DB link where `og_image_url` pointed to a non-existent file by re-syncing with a valid storage asset.
  2. **Auto-Sync:** Refactored `handleImageUpload` to automatically update `site_config` in the database immediately after a successful storage upload, preventing future desyncs.
  3. **Cleanup:** Improved storage cleanup logic to accurately remove old files and manually purged 6 orphaned/redundant images from the `assets/seo` folder.
  4. **Verification:** Validated storage and DB state using diagnostic scripts; all temporary files have been removed.

### 2026-03-01 | File: IntegratedDashboard.tsx | Status: ✅ Completed
- **Change:** Redesigned Admin Dashboard & Financial Tools Integration
- **Details:** 
  1. **Unified Interface:** Merged Analytics and Dashboard into a single `IntegratedDashboard` with real-time charts (Revenue, Traffic).
  2. **Accounting System:** Ported and improved the accounting modal for income/expense tracking and formal A4 PDF report generation.
  3. **Withholding Tax (50 Bis):** Integrated a standard Thai Withholding Tax Certificate generator with automatic Thai text conversion (`bahttext`).
  4. **Invoice Management:** Added a "Recent Paid Invoices" section with quick-action buttons for downloading Tax Invoices and Receipts directly.
  5. **Clean Code:** Resolved all ESLint errors, implemented strict TypeScript interfaces for invoices and configuration, and automated site-info fetching for documents.
  6. **Verification:** Passed `npm run lint` and `npm run build` with zero errors.

### 2026-03-01 | File: Project Wide | Status: ✅ Completed
- **Change:** Deep Rebranding to VELOZI | Dev
- **Details:** 
  1. **Branding:** Changed all instances of "Nexora Labs" to "VELOZI | Dev" (SEO, Header, Footer, Hero, Admin, Emails).
  2. **Theming:** Updated `tailwind.config.ts` with brand-aligned colors (Deep Blue/Teal & Cyan) and updated global gradients.
  3. **Safety Fallback:** Implemented a string sanitizer in `layout.tsx` to catch any remaining "Nexora Labs" strings from the database.
  4. **Email Automation:** Rebranded all system emails and broadcast routes.
  5. **Verification:** Verified with `npm run build` and pushed to Git.

### 2026-03-01 | File: Hero, Services, WhyChooseUs, Portfolio, Packages, Testimonials, Contact | Status: ✅ Completed
- **Change:** UI Cleanup - Removed section header badges
- **Details:** 
  1. **Components:** Removed the `rounded-full` header badges (e.g., "บริการครบวงจรสำหรับ SME", "รีวิวจากลูกค้า") from all 7 main landing page sections.
  2. **Aesthetics:** Achieved a cleaner, more professional look by simplifying the section headers.
  3. **Verification:** Verified that `npm run build` and `npm run lint` pass successfully.

### 2026-02-25 | File: ClientDashboardView.tsx, ClientInvoicesView.tsx | Status: ✅ Completed
- **Change:** Multi-Project Support for Customer Portal
- **Details:** 
  1. **Dashboard:** Updated `ClientDashboardView` to group invoices by `client_name` and add a project selector UI.
  2. **Invoices:** Added "โปรเจกต์" column to `ClientInvoicesView` to identify invoices for different projects.
  3. **Schema:** Created `setup_customer_portal_multi.sql` to relax constraints on `client_users` table.

### 2026-02-25 | File: create-account/route.ts, ClientManager.tsx | Status: ✅ Completed
- **Change:** Manual Customer Account Creation
- **Details:** 
  1. **Backend API:** Created `/api/admin/create-account` to manually generate Supabase Auth users and Client profiles without invoices.
  2. **Frontend UI:** Added "สร้างบัญชีผู้ใช้สำหรับ Customer Portal ทันที" toggle in ClientManager.
  3. **Security:** Implemented automatic 8-character password generation and returned it to admin for onboarding.

### 2026-02-22 | File: InvoiceManager.tsx, send-invoice/route.ts | Status: ✅ Completed
- **Change:** Email attachments - Added Service Contract and Installment Schedule PDFs to email
- **Details:**
  1. **Email Attachments:**
     - First invoice (all payments): Service Contract PDF (สัญญาจ้าง)
     - Installment payments: Add Installment Schedule PDF (ตารางการแบ่งชำระ)
     - Invoice PDF is always attached
  
  2. **API Update:**
     - Modified `/api/send-invoice` to accept multiple attachments
     - Added `serviceContractBase64` and `installmentScheduleBase64` parameters
  
  3. **Frontend Update:**
     - Modified `handleSendEmail` to generate and attach all required PDFs
     - Automatic detection of first invoice and installment payments

---

## Features Implemented

### ✅ Core Features
1. **Landing Page** - Modern, responsive design with animations
2. **Package System** - Standard & Pro packages with detailed pricing
3. **Cookie Consent** - Full GDPR/PDPA compliant consent system
4. **Policy Pages** - Privacy, Terms, Cookie policies
5. **Admin Panel** - Complete content management system
6. **SEO System** - Enterprise-level SEO implementation

### ✅ Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Backend:** Supabase (configured)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React

---

## File Structure

```
SellingSite/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── admin/
│   │   └── page.tsx         # Admin panel
│   ├── privacy/
│   │   └── page.tsx         # Privacy policy
│   ├── terms/
│   │   └── page.tsx         # Terms of service
│   └── cookies/
│       └── page.tsx         # Cookie policy
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header
│   │   └── Footer.tsx       # Site footer
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PackagesSection.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── CTASection.tsx
│   ├── policies/
│   │   ├── PrivacyPolicy.tsx
│   │   ├── TermsOfService.tsx
│   │   └── CookiePolicy.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── SiteSettings.tsx
│   │   ├── ContentManager.tsx
│   │   ├── PackageManager.tsx
│   │   └── ContactManager.tsx
│   └── CookieConsent.tsx
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── supabase.ts          # Database config
│   └── seo.ts               # SEO configuration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Package Details

### 🟢 Standard Package (ธุรกิจเล็ก)
- **Setup:** ฿10,000 – ฿15,000
- **Monthly:** ฿1,800 – ฿2,500
- **Features:**
  - เว็บไซต์ + ระบบเก็บข้อมูล
  - ฟอร์มลูกค้า
  - Hosting + Supabase ดูแลให้
  - Backup รายเดือน
  - แก้ไขเล็กน้อย 2 ครั้ง/เดือน
  - ตอบกลับภายในเวลาทำการ

### 🟡 Pro Package (ธุรกิจปานกลาง)
- **Setup:** ฿22,000 – ฿30,000
- **Monthly:** ฿3,000 – ฿4,000
- **Features:**
  - ระบบสมาชิก
  - ระบบ Admin Panel
  - Dashboard ดูข้อมูล
  - Backup รายสัปดาห์
  - Support เคสด่วน (ระบบล่ม)

---

## Admin Panel Features

1. **Dashboard** - Overview stats, recent contacts
2. **Site Settings** - Logo, contact info, social links
3. **Content Manager** - Edit all sections
4. **Package Manager** - Manage pricing & features
5. **Contact Manager** - View & manage inquiries

---

## Support Hours

- **Working Hours:** 09:00 – 18:00
- **Critical Response:** Within 2 hours for system-wide issues

---

## Next Steps

1. Configure Supabase credentials in `.env.local`
2. Run `npm run dev` to start development server
3. Customize content via Admin Panel
4. Deploy to production (Vercel recommended)

---

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Environment Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=WebCare Studio
ADMIN_SECRET_KEY=your_admin_secret
```

---

**Last Updated:** 2026-02-20 13:48 (UTC+7)

[2026-02-20 02:35] | File: Header.tsx, Footer.tsx, layout.tsx | Line: N/A | Keyword: Logo Update | Status: Completed | Change: Replaced text-based logos with image-based logos in Header and Footer. Updated favicon in layout.tsx. Created public/logos directory for asset management.
[2026-02-20 13:48] | File: package.json | Line: 7, 9 | Keyword: Port Update | Status: Completed | Change: Updated next dev and next start scripts to run on port 3020 per Boss's request.
[2026-02-20 13:51] | File: supabase_schema.sql | Line: N/A | Keyword: Create SQL Schema | Status: Completed | Change: Created SQL script based on TypeScript types in lib/supabase.ts for Supabase table initialization.
[2026-02-20 13:57] | File: supabase_schema.sql | Line: 120-184 | Keyword: Security (RLS & Rate Limit) | Status: Completed | Change: Added RLS policies for 8 tables (Public Read/Insert, Admin All) and PG trigger for Contact Form spam prevention (max 3 per hour per email).
[2026-02-20 14:15] | File: ContactSection.tsx, CookieConsent.tsx, SiteSettings.tsx, ContactManager.tsx, ContentManager.tsx, PackageManager.tsx, AdminDashboard.tsx | Line: N/A | Keyword: Supabase Integration | Status: Completed | Change: Replaced mock data and simulated functions with real Supabase database connections for both user-facing and admin panel components.
[2026-02-20 14:35] | File: components/sections/*, layout/* | Line: All | Keyword: Frontend Supabase Integration | Status: Planned | Change: Discovered public components (Hero, Services, Packages, Testimonials, Header, Footer) are still using hardcoded data. Drafted implementation_plan.md to connect them to Supabase.
[2026-02-20/15:02:00] | File: HeroSection.tsx | Line: 202-230 | Keyword: UI Update | Status: SUCCESS | Change: Replaced the SVG browser mockup in the Hero visual section with a high-definition image from Unsplash. Updated container styling to handle image overflow and added hover scale animation.
[2026-02-20/18:55:00] | File: ContactSection.tsx | Line: Multiple | Keyword: Integration | Status: SUCCESS | Change: Integrated the public-facing ContactSection component with Supabase to fetch dynamic contact details (phone, email, line, address, working hours) from `site_config`. Added data mapping and static fallbacks for reliability.
[2026-02-20/19:15:00] | File: Policy Pages & Main Sections | Line: Multiple | Keyword: UI Update | Status: SUCCESS | Change: Improved text readability by increasing line-height (leading-relaxed to leading-loose), adjusting paragraph spacing (mb-8, mt-4), and adding paragraph indents (indent-8) in appropriate places for better Thai text mapping across the main landing page and policy pages (Privacy, Terms, Cookie).
[2026-02-20/19:05:00] | File: HeroSection.tsx | Line: 139 | Keyword: Typography Fix | Status: SUCCESS | Change: Removed `text-justify` and `indent-8`, and reverted `leading-loose` to `leading-relaxed` in Hero Section description to fix Thai text rendering issues where words were spread too far apart.
[2026-02-20/19:15:00] | File: ContentManager.tsx | Line: 97-100, 246-277 | Keyword: UI Fix | Status: SUCCESS | Change: Fixed Hero payload parameter names (`cta_primary...` -> `primary_cta...`) and wired defaultValues to active forms.
[2026-02-20/19:15:00] | File: ContentManager.tsx | Line: 144, 299 | Keyword: UI Fix | Status: SUCCESS | Change: Allowed Add/Delete Services and auto-rerender display order in Service Sections Editor.
[2026-02-20/19:15:00] | File: ContentManager.tsx | Line: 309 | Keyword: UI Fix | Status: SUCCESS | Change: Unlocked Add/Delete functionality with Testimonials UI form in Testimonials Section Editor.
[2026-02-20/19:15:00] | File: SiteSettings.tsx | Line: 173-191 | Keyword: UI Fix | Status: SUCCESS | Change: Replaced simulated Logo Upload button with functional Logo Image URL input and visual preview linked to `site_config` active record.
[2026-02-20/19:19:00] | File: PackageManager.tsx | Line: Multiple | Keyword: Feature Fix | Status: SUCCESS | Change: Added Add Package and Edit features functionality. Implemented features list mapped as an array into Supabase package tables.
[2026-02-20/19:25:00] | File: ContactManager.tsx | Line: 117-139, 146-176, 360-390 | Keyword: Feature Fix | Status: SUCCESS | Change: Implemented Update Status dropdown in Contact Detail modal to save directly to Supabase. Developed Export to CSV functionality to export contact lists.
[2026-02-20/20:00:00] | File: Frontend Components | Line: Multiple | Keyword: Verification | Status: SUCCESS | Change: Verified that all primary frontend section components (Hero, Services, Packages, Testimonials, Contact, Header, Footer) are fully integrated with Supabase and fetch dynamic content successfully. Fixed residual lint error in app/admin/layout.tsx.
[2026-02-20/20:45:00] | File: db/seed, Frontend/Admin | Line: Multiple | Keyword: Bug Fix | Status: SUCCESS | Change: Fixed severe data mismatch bug where Frontend fell back to dummy data because DB was completely empty. Admin Panel tables crashed on load due to querying `display_order` instead of DB schema `order`. Re-mapped queries to `order`, added missing Hero Subtitle input and textarea to `ContentManager`, and finally executed seed script to populate DB with default data.
[2026-02-20/21:10:00] | File: CookieConsent.tsx, Footer.tsx | Line: 54-70, 179-190 | Keyword: UI Feature | Status: SUCCESS | Change: Added an event listener to `CookieConsent.tsx` to handle `open-cookie-settings` event, and added a 'ตั้งค่าคุกกี้' button to the `Footer.tsx` to allow users to manage their cookies as stated in the Cookie Policy.
[2026-02-21/00:01:00] | File: Multiple | Line: Multiple | Keyword: Build Fix | Status: SUCCESS | Change: Fixed ESLint warnings preventing `npm run build`. Removed unused vars and explicitly typed `any` types in components like `ContentManager`, `PackageManager`, `HeroSection`, `ContactSection`, and others.
[2026-02-21/00:06:00] | File: next.config.js | Line: 9-39 | Keyword: Security (Network Layer) | Status: SUCCESS | Change: Successfully verified Next.js Security Headers deployment in local DEV server. Headers (HSTS, CSP, X-Frame-Options, etc) are correctly parsed and served via NextConfig.
[2026-02-21/00:09:00] | File: PrivacyPolicy.tsx, TermsOfService.tsx, CookiePolicy.tsx | Line: Multiple | Keyword: Integration | Status: SUCCESS | Change: Converted static contact information in all policy pages into dynamic data fetching from Supabase `site_config` using React state and useEffect.
[2026-02-21/00:13:00] | File: middleware.ts | Line: 4-46 | Keyword: Security (App Layer) | Status: SUCCESS | Change: Implemented an In-memory Map IP Rate Limiter (Soft limit for DDoS protection) restricting connection to 150 requests per minute per IP. Verified using a custom node script (tests/ddos-test.js), producing the expected HTTP 429 status code on exceeded requests.
[2026-02-21/00:26:00] | File: ContentManager.tsx, PackageManager.tsx | Line: Multiple | Keyword: Security (Input Validation) | Status: SUCCESS | Change: Integrated Zod schema validation to secure Supabase insert/update payloads against missing/excessive data length and incorrect types. Catch block throws Zod errors directly to the user alert.
[2026-02-21/00:37:00] | File: supabase_schema.sql (DB Rules) | Line: 153-160 | Keyword: Security (Database Layer) | Status: SUCCESS | Change: Discovered and rectified a critical vulnerability in Supabase Row Level Security (RLS). Replaced overly permissive 'FOR ALL TO public' policies on Admin-only tables with strict 'FOR ALL TO authenticated' to prevent unauthorized data manipulation by anonymous users. (Applied via fix_rls_policies.sql)
[2026-02-21/00:41:00] | File: LoginPage.tsx | Line: Multiple | Keyword: Security (Auth Layer) | Status: SUCCESS | Change: Implemented a 'Password Lockout' feature capping failed login attempts to 3 before imposing a 60-second block. Added an integrated 'Math CAPTCHA' verification step (random simple addition) to defend against automated bot brute-forcing.
[2026-02-21/00:46:00] | File: auth-context.tsx | Line: Multiple | Keyword: Authentication (Supabase Core) | Status: SUCCESS | Change: Replaced the static hardcoded Demo Credentials completely. Refactored the 'AuthContext' to connect directly to the real `supabase.auth.signInWithPassword` API, enforcing genuine email/password validation against the backend user database, and implemented true session listener (`onAuthStateChange`).
[2026-02-21/00:49:00] | File: layout.tsx (Admin) | Line: 37 | Keyword: TypeScript | Status: SUCCESS | Change: Resolved a Next.js production build error by changing `user?.name` to `user?.user_metadata?.name` to strictly comply with Supabase's `User` type interface.
[2026-02-21/00:58:00] | File: ForgotPasswordModal.tsx, LoginPage.tsx | Line: Multiple | Keyword: Authentication (Password Reset) | Status: SUCCESS | Change: Implemented 'Forgot Password' feature with Email verification. Created a generic modal and tied it to `supabase.auth.resetPasswordForEmail()` logic.
[2026-02-21/01:00:00] | File: AccountSettingsModal.tsx, layout.tsx | Line: Multiple | Keyword: Authentication (Account Setting) | Status: SUCCESS | Change: Created a robust Client Dashboard Password Changer using `supabase.auth.updateUser()`. Added setting navigation next to Logout in the Admin Top Navigation. Fixed TS 'any' type errors on error exceptions.
[2026-02-21/01:10:00] | File: setup_invoices_table.sql | Line: All | Keyword: Database (Schema) | Status: SUCCESS | Change: Drafted SQL migration script for the new `invoices` table with full UUID and RLS support.
[2026-02-21/01:12:00] | File: InvoiceManager.tsx, route.ts, Admin Layout | Line: Multiple | Keyword: Invoice & Email Services | Status: SUCCESS | Change: Implemented `InvoiceManager` UI for generating billing (Setup fee + Monthly fee combined) and integrated Next.js API `/api/send-invoice` using Nodemailer and Gmail App Passwords to automatically email HTML-formatted invoice details to clients.
[2026-02-21/01:21:00] | File: InvoiceManager.tsx | Line: Multiple | Keyword: Invoice UI Update | Status: SUCCESS | Change: Enhanced package detail input to be a dynamic dropdown pulling `is_active` packages from Supabase (`packages` table), which auto-fills the setup and monthly prices. Added fallback for custom package names if they're not in the database.
[2026-02-21/01:30:00] | File: InvoiceManager.tsx | Line: Multiple | Keyword: PDF Form Generation | Status: SUCCESS | Change: Installed `html2pdf.js` and implemented a hidden, printable A4 PDF Document Template. Binded Download action to let admins download the invoice as a professional-looking PDF file for accounting or printing purposes.
[2026-02-21/01:31:00] | File: InvoiceManager.tsx | Line: Multiple | Keyword: PDF Styling | Status: SUCCESS | Change: Refactored the PDF template to use a strictly formal, grayscale/monochrome (Black & White) design with solid borders, tailored specifically to look like an official printed business form.
[2026-02-21/01:36:00] | File: InvoiceManager.tsx, route.ts | Line: Multiple | Keyword: Email PDF Attachment | Status: SUCCESS | Change: Implemented automatic PDF generation (via Base64 string from `html2pdf.js`) when the "Send E-Invoice" button is clicked. This Base64 payload is passed to `/api/send-invoice` where Nodemailer processes it and successfully attaches the formal PDF invoice directly to the client's email.
[2026-02-21/01:53:00] | File: PaymentSettings.tsx, InvoiceManager.tsx | Line: Multiple | Keyword: Dynamic PDF Payment Info | Status: SUCCESS | Change: Implemented `payment_settings` DB Table and Admin UI route. Updated the Invoice PDF template to map Dynamic PromptPay and Bank information from Supabase, removing hardcoded text.
[2026-02-21/02:16:00] | File: modal-context.tsx, Multiple Components | Line: Multiple | Keyword: Global Modal Integration | Status: SUCCESS | Change: Created a robust Global Modal Provider system to replace raw frontend `alert` and `confirm` dialogs. Refactored all data managers (`PaymentSettings`, `PackageManager`, `InvoiceManager`, `ContentManager`, `ContactManager`) to use `showAlert` and a custom Promise-based `showConfirm`. Cleaned up all ES-lint unused variable warnings smoothly.
[2026-02-21/02:30:00] | File: WelcomeModal.tsx, app/(main)/layout.tsx | Line: Multiple | Keyword: Welcome Policy Modal | Status: SUCCESS | Change: Implemented a frontend Welcome Modal using Framer Motion to display a message declining illegal/gambling project requests. The modal utilizes `localStorage` (`nexora_welcome_seen`) to ensure it only appears once per user. Integrated into the main user layout.
[2026-02-21/02:46:00] | File: payment/page.tsx, route.ts | Line: Multiple | Keyword: Public Payment Portal | Status: SUCCESS | Change: Created `/payment` page to publicly showcase business bank/promptpay info for invoice settling. Implemented 'Copy to Clipboard' utilities and dynamic Supabase querying. Integrated a Direct Payment Gateway Link CTA within the generated HTML Email sent via `/api/send-invoice`.
[2026-02-21/13:10:00] | File: InvoiceManager.tsx | Line: Multiple | Keyword: Bug Fix (PDF Template Constraints) | Status: SUCCESS | Change: Confined the hidden PDF canvas element within `InvoiceManager.tsx` to strictly match an A4 proportion (`w-[210mm] h-[297mm]`) with zero margins. Bound bottom signature to the end of the page. This prevents content cascading across unknown boundaries and prevents cutoff issues when downloading or mailing the PDF.
[2026-02-21/13:20:00] | File: payment/page.tsx | Line: Multiple | Keyword: UI Responsiveness Update | Status: SUCCESS | Change: Rescaled the `text-xl` PromptPay/Bank number fonts into `text-lg sm:text-xl` and removed hard-coded wide padding so the Payment portal renders correctly and does not overflow on narrower mobile screens like iPhones.
[2026-02-21/14:40:00] | File: setup_trust_badges.sql | Line: All | Keyword: Database (Storage & Table) | Status: SUCCESS | Change: Engineered a migration script to generate `trust_badges` Postgres Table and Supabase Storage bucket with strict RLS policies (Only admin can modify, public can see).
[2026-02-21/14:45:00] | File: Admin page.tsx, TrustBadgeManager.tsx | Line: Multiple | Keyword: Admin UI (Dynamic Badges) | Status: SUCCESS | Change: Implemented `TrustBadgeManager` component to let Admins upload client logos (`PNG`/`JPG`) directly into Supabase Storage, and save their references to DB with order handling and active toggles. Bound the component to the Admin Sidebar `/admin` Single-Page-App Layout under "โลโก้ลูกค้า" (ShieldCheck icon).
[2026-02-21/14:50:00] | File: HeroSection.tsx | Line: Multiple | Keyword: Frontend Integration | Status: SUCCESS | Change: Replaced the static hardcoded Trust Badges placeholder with an active listener `supabase.from('trust_badges')`. Now intelligently fetches and arrays through live client logos with sleek grayscale hover effects. Automatically switches "50+ ราย" text to reflect actual active database records.
[2026-02-22/16:26:00] | File: AdminDashboard.tsx, app/admin/page.tsx | Line: Multiple | Keyword: Admin UI (Dashboard Buttons) | Status: SUCCESS | Change: Wired up the 4 placeholder bottom quick-action buttons in the Admin Dashboard to be functional. Passed down `onNavigate` prop from the main layout (`setActiveMenu`) so "ดูทั้งหมด" and "เพิ่มเนื้อหา" correctly switch CMS tabs without page reload. Integrated the Global `useModal` context to present clean, informative system alerts for "สำรองข้อมูล" and "ดูรายงาน" indicating feature development status rather than acting as dead links.
[2026-02-22/16:34:00] | File: TrustBadgeManager.tsx | Line: Multiple | Keyword: Build Fix (ESLint) | Status: SUCCESS | Change: Resolved all TypeScript and ESLint strict warnings/errors preventing production build. Explicitly casted caught errors as `Error` or `unknown`, safely disabled excessive `exhaustive-deps` checks on isolated initialization hooks, and removed unused imports (`next/image`). Verified clean run via `npm run lint`.
[2026-02-22/17:30:00] | File: setup_client_backups.sql | Line: All | Keyword: Database (Schema) | Status: SUCCESS | Change: Created SQL migration script for `clients` table, `backup_logs` table, and `backups` Storage bucket with RLS policies to support the Client Backup System.
[2026-02-22/17:30:00] | File: ClientManager.tsx, Admin page.tsx | Line: Multiple | Keyword: Admin UI (Client System) | Status: SUCCESS | Change: Implemented `ClientManager` component to allow administrators to add, edit, and manage client project credentials (URL, Service Role Key) for automated backups. Configured Supabase integration to persist records.
[2026-02-22/17:30:00] | File: backup-engine.ts, api/backup/run/route.ts | Line: Multiple | Keyword: Backup Engine | Status: SUCCESS | Change: Developed the core server-side backup engine. Standard packages export generic tables to JSON. Pro packages download internal storage assets and compress them alongside JSON into a `.zip` archive using `archiver` and `jszip`. Hooked to `/api/backup/run` POST route for single client triggers.
[2026-02-22/17:30:00] | File: api/cron/backup/route.ts, AdminDashboard.tsx | Line: Multiple | Keyword: Automation (Cron) | Status: SUCCESS | Change: Engineered a Vercel-compatible cron endpoint (`/api/cron/backup`) that calculates target packages based on the current date (1st or 15th). Successfully wired the existing "สำรองตอนนี้" button in the Admin Dashboard to trigger the batch backup override (`?manual=true`).
[2026-02-22/17:30:00] | File: Multiple | Line: Multiple | Keyword: Build Fix (ESLint) | Status: SUCCESS | Change: Resolved all TypeScript and ESLint strict warnings/errors preventing production build for the Backup System features, including handling of `any` types and unused variables. Verified clean run via `npm run lint`.
[2026-02-22/17:45:00] | File: api/system/backup/route.ts, AdminDashboard.tsx | Line: Multiple | Keyword: System Data Backup | Status: SUCCESS | Change: Shifted the concept of "backup" in Admin UI. Implemented `/api/system/backup` to bypass RLS with Service Role Key and dump all crucial system tables (`clients`, `contact_submissions`, `packages`, `invoices`, etc.) into a JSON payload. Updated Dashboard's Backup button to download this JSON file locally rather than firing Vercel cron, and adjusted UI text for "ดูรายงาน" placeholder.
[2026-02-22/17:48:00] | File: api/system/backup/route.ts | Line: 38, 43 | Keyword: Bug Fix | Status: SUCCESS | Change: Removed nonexistent table `site_content` from the `tablesToBackup` array. Fixed ESLint `any` type error by writing `interface BackupData`.
[2026-02-22/18:00:00] | File: app/admin/page.tsx | Line: 30-155 | Keyword: UI/UX (Admin Sidebar) | Status: SUCCESS | Change: Refactored the flat `menuItems` array in the Admin Sidebar into grouped categorizations using `menuGroups` (ภาพรวมระบบ, จัดการระบบ, ลูกค้าและรายได้). Enhanced `page.tsx` UI rendering logic to parse map and output these group titles elegantly above sub-menus.
[2026-02-22 16:58] | File: app/admin/page.tsx | Line: 30-155 (approx) | Keyword: SidebarRefactor, MenuGroups | Status: Success | Change: Refactored the Admin Panel sidebar to use categorized `menuGroups` (ภาพรวมระบบ, จัดการระบบ, ลูกค้าและรายได้) instead of a flat list, improving navigation UI and UX. Header title logic updated to still correctly find the active tab from the flattened list.
[2026-02-22 18:09] | File: setup_analytics.sql, middleware.ts, app/api/track/route.ts, app/api/system/analytics/route.ts, components/admin/AnalyticsDashboard.tsx, app/admin/page.tsx | Line: Multiple | Keyword: DataAudit, AnalyticsDashboard | Status: Success | Change: Implemented the System Analytics Dashboard (หน้าวิเคราะห์ข้อมูล) including an edge API for passive traffic tracking via Middleware, a main aggregation API for DB stats, a robust UI Dashboard displaying multi-metric statistics (Traffic, Revenue, Common Issues, etc.), and a Tax Form generator to render/download PDF receipts on the client.
[2026-02-22 18:16] | File: components/admin/PackageManager.tsx | Line: 9, 25, 80, 98, 366-377 | Keyword: Bug Fix, PackageManager | Status: Success | Change: Fixed a bug where editing packages failed to save. The payload was erroneously sending a `badge` field which did not exist in the `packages` database schema, causing a silent Postgrest error. Removed `badge` entirely and replaced the UI input with a functional dropdown for the `tier` field.
[2026-02-22 19:00] | File: update_trust_badges_url.sql, components/admin/TrustBadgeManager.tsx, components/sections/HeroSection.tsx | Line: Multiple | Keyword: Feature, TrustBadges | Status: Success | Change: Added a new `website_url` field to the Trust Badges system. Allowed the Admin to input website links for each customer logo in the Admin Panel (`TrustBadgeManager.tsx`), and wrapped the displayed logos on the homepage (`HeroSection.tsx`) with clickable `<a target="_blank">` tags leading to the provided URLs. Created `update_trust_badges_url.sql` for adding the new schema column.
[2026-02-22 19:06] | File: components/admin/AnalyticsDashboard.tsx, app/api/track/route.ts | Line: Multiple | Keyword: UI/UX, Linting | Status: Success | Change: Addressed terminal lint warnings by removing unused imports/variables and resolving the `useEffect` exhaustive-deps warning. Updated the Tax Form terminology in the UI from "แบบฟอร์มยื่นภาษี" to "ใบเสร็จ / ใบกำกับภาษี" to correctly reflect its purpose as a customer invoice rather than a revenue department tax slip, as requested.
[2026-02-22 19:10] | File: components/admin/AnalyticsDashboard.tsx | Line: Multiple | Keyword: Feature, UI/UX, TaxDocument | Status: Success | Change: Boss requested that the Tax PDF Form actually function as a "หนังสือรับรองการหักภาษี ณ ที่จ่าย" (50 Tawi) for recording their income. Redesigned the form state, UI inputs, and the hidden PDF canvas to perfectly replicate a standard Thai Withholding Tax Certificate layout, complete with the `bahttext` dependency for total amount wording.
[2026-02-22 19:24] | File: components/admin/InvoiceManager.tsx | Line: Multiple | Keyword: Feature, InvoiceManager, PDF Generator | Status: Success | Change: Added a "Download Receipt" (ดาวน์โหลดใบเสร็จรับเงิน) button to each invoice row in the Admin Panel's E-Invoice section. Implemented a hidden HTML Document canvas strictly structured as a formal Receipt and wired up `html2pdf.js` to trigger a PDF download.
[2026-02-22 19:59] | File: setup_payments.sql, app/payment/[invoiceId]/page.tsx+PaymentPageClient.tsx, components/admin/InvoiceManager.tsx, app/api/send-receipt/route.ts, app/api/cron/payment-reminders/route.ts, vercel.json | Line: Multiple | Keyword: Feature, PaymentGateway, AutoBilling, CronJob | Status: Success | Change: Implemented a full Payment Automation System. Customers receive a unique payment link per invoice (/payment/{id}), can upload slip images, and the Admin can Approve/Reject from a new pending-slips panel in InvoiceManager. On approval, the system automatically marks the invoice paid, generates the next billing cycle (monthly_fee only), and emails the customer a formal receipt. A daily Vercel Cron job sends 7-day/3-day/24-hr reminders to customers with pending invoices. Sender name updated to "Nexora Labs | Billing Team" across all emails.
[2026-02-22 20:20] | File: components/admin/InvoiceManager.tsx | Line: 404-425 | Keyword: Fix, Storage, SignedURL | Status: Success | Change: Fixed slip image 404 in Admin modal. Private Supabase storage bucket requires signed URLs. Added `openSlipViewer()` function that generates 1-hour Supabase signed URL before opening modal. Modal shows a spinner while loading, then displays the image correctly.
[2026-02-22 20:27] | File: app/api/send-receipt/route.ts, components/admin/InvoiceManager.tsx | Line: Multiple | Keyword: Feature, Email, PDF, Attachment | Status: Success | Change: Upgraded send-receipt API with gradient SVG checkmark icon, modern email card design, and PDF attachment support via nodemailer's attachments array. `handleApproveSlip` now generates the receipt PDF as base64 client-side (using existing HTML template + html2pdf.js) and passes it to the API for automatic email attachment.
[2026-02-22 20:35] | File: components/admin/InvoiceManager.tsx | Line: Multiple | Keyword: Feature, TaxFiling, PaymentHistory | Status: Success | Change: Added Payment History section to InvoiceManager showing all approved payment slips. Features include: year filter dropdown, annual income summary (total bills + total amount), per-slip download button using Supabase signed URLs. Designed for annual tax filing (ยื่นภาษีเงินได้). Fixed Set iteration lint with Array.from().
[2026-02-22 21:40] | File: PackageManager.tsx, TestimonialsSection.tsx, cron backup | Line: Multiple | Keyword: UI/Bug Fix | Status: SUCCESS | Change: Collapsed min/max setup and monthly fee inputs into a single UI textfield in PackageManager. Added null guard (`?? []`) to `services.features`. Implemented `export const dynamic = 'force-dynamic'` to Cron handlers.
[2026-02-22 21:52] | File: app/feedback/page.tsx, ContentManager.tsx, TestimonialsSection.tsx | Line: Multiple | Keyword: Feature, Client Feedback | Status: SUCCESS | Change: Built a public-facing `/feedback` route for clients to submit 5-star reviews. Integrated an "Approval" toggle in `ContentManager` where new reviews land in a pending (`is_active: false`) state until the Admin approves them. Removed hardcoded dummy reviews from Frontend.
[2026-02-22 22:15] | File: HeroSection.tsx, WhyChooseUs.tsx | Line: Multiple | Keyword: UI, Dynamic Trust Badges | Status: SUCCESS | Change: Removed static '50+' strings and fallback logic from the trusted businesses count. The UI now exclusively maps and counts the exact length of the active `trust_badges` array fetched from Supabase.
[2026-02-22 23:55] | File: setup_project_tracker.sql, InvoiceManager.tsx, app/track/page.tsx, api/lookup-tracker/route.ts | Line: Multiple | Keyword: Feature, Project Tracker | Status: SUCCESS | Change: Implemented a public Project Status Tracker (`/track`). Added `project_status` and `tracking_code` columns to `invoices` table. Integrated status updater and auto-tracking-code generator into `InvoiceManager.tsx`. Engineered `/api/lookup-tracker` endpoint with Service Role Key to securely fetch and mask client data. Built a responsive stepped-timeline UI on `/track` to visualize progress milestones, and added its link to Header and Footer navigation.
-- สร้างตารางบันทึกประวัติการทำงานของแอดมิน (Admin Activity Logs)
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT NOT NULL,
    action_type TEXT NOT NULL, -- เช่น LOGIN, DELETE, APPROVE_SLIP, UPDATE_SETTINGS
    details TEXT, -- รายละเอียดเพิ่มเติม เช่น "ลบรูปภาพ portfolio_01.jpg", "อนุมัติสลิป INV-202401-ABCD"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- เปิดใช้งาน RLS (Row Level Security)
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- นโยบาย RLS:
-- 1. เฉพาะแอดมิน (ผู้ที่ล็อกอินแล้ว) เท่านั้นที่สามารถดู Log ได้
CREATE POLICY "Allow authenticated users to select admin logs"
    ON public.admin_logs FOR SELECT
    TO authenticated
    USING (true);

-- 2. เฉพาะแอดมินเท่านั้นที่สามารถเพิ่ม Log ได้
CREATE POLICY "Allow authenticated users to insert admin logs"
    ON public.admin_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. ไม่อนุญาตให้แก้ไข Log (เพื่อป้องกันการลบประวัติ)
-- 4. ไม่อนุญาตให้อนุญาตแก้ไข Log

-- ไม่สร้าง Policy สำหรับ UPDATE และ DELETE เพื่อป้องกันการแก้ไขหรือลบประวัติ

---

## Step 7: Admin Activity Log ✅
[2026-02-23 00:00] | Status: COMPLETED

### Files Created/Modified:
| File | Action | Description |
|:---|:---:|:---|
| `setup_admin_logs.sql` | NEW | SQL schema for `admin_logs` table with RLS policies |
| `lib/admin-logger.ts` | NEW | Helper function `logAdminAction()` for inserting log entries |
| `components/admin/ActivityLogManager.tsx` | NEW | Admin UI for viewing, searching, and filtering activity logs |
| `app/admin/page.tsx` | MODIFIED | Added "บันทึกประวัติ (Log)" menu item and route |
| `components/admin/LoginPage.tsx` | MODIFIED | Injected `logAdminAction` on successful login |
| `components/admin/InvoiceManager.tsx` | MODIFIED | Injected logging for create, update, delete invoice, and approve slip |

### Action Types Tracked:
`LOGIN`, `CREATE_INVOICE`, `UPDATE_INVOICE`, `DELETE_INVOICE`, `APPROVE_SLIP`

---

## Step 8: Email Template Manager ✅
[2026-02-23 00:00] | Status: COMPLETED

### Files Created/Modified:
| File | Action | Description |
|:---|:---:|:---|
| `setup_email_templates.sql` | NEW | SQL schema for `email_templates` table with default data (INVOICE, RECEIPT, REMINDER_7) |
| `components/admin/EmailTemplateManager.tsx` | NEW | Admin UI for editing templates and sending broadcasts |
| `app/api/broadcast/route.ts` | NEW | API endpoint for sending bulk email announcements to all clients |
| `app/admin/page.tsx` | MODIFIED | Added "จัดการเทมเพลตอีเมล" menu item and route |
| `app/api/send-invoice/route.ts` | MODIFIED | Now fetches INVOICE template from DB; uses `[CLIENT_NAME]`, `[AMOUNT]`, `[DUE_DATE]`, `[PAYMENT_LINK]` variables |
| `app/api/send-receipt/route.ts` | MODIFIED | Now fetches RECEIPT template from DB; uses `[CLIENT_NAME]`, `[AMOUNT]` variables |
| `app/api/cron/payment-reminders/route.ts` | MODIFIED | Now fetches REMINDER_7 template from DB for dynamic reminder body |

### Template Variables:
| Variable | Description |
|:---|:---|
| `[CLIENT_NAME]` | ชื่อลูกค้า |
| `[AMOUNT]` | ยอดชำระเงิน |
| `[DUE_DATE]` | วันครบกำหนด |
| `[PAYMENT_LINK]` | ลิงก์หน้าชำระเงิน |

### Broadcast Feature:
- แอดมินสามารถพิมพ์หัวข้อ + เนื้อหาอีเมล (รองรับ HTML) แล้วส่งหาลูกค้าทั้งหมดในระบบได้ทันที
- ระบบจะดึง unique emails จากตาราง `invoices` แล้วทะยอยส่งอัตโนมัติ (100ms delay ต่อฉบับเพื่อป้องกัน spam filter)

---

## [2026-02-23] Project Tracker Modal Conversion

### Change Summary:
แปลง "ติดตามงาน" จาก Route `/track` เป็น Modal แทน

### Files Modified:
1. **สร้างใหม่:** `components/frontend/ProjectTrackerModal.tsx` - Modal component สำหรับติดตามงาน
2. **แก้ไข:** `lib/modal-context.tsx` - เพิ่ม `openProjectTracker`, `closeProjectTracker`, `isProjectTrackerOpen`
3. **แก้ไข:** `components/layout/Header.tsx` - เปลี่ยน Link เป็น button เปิด Modal
4. **แก้ไข:** `components/layout/Footer.tsx` - เปลี่ยน Link เป็น button เปิด Modal
5. **แก้ไข:** `app/layout.tsx` - เพิ่ม ModalProvider wrapper
6. **ลบ:** `app/track/page.tsx` - ลบ route เดิมออก

### Technical Details:
- ใช้ `createPortal` ที่ `document.body` สำหรับ Modal rendering
- ใช้ `AnimatePresence` จาก framer-motion สำหรับ animation
- Modal มี backdrop blur และสามารถปิดได้โดยการคลิก backdrop หรือปุ่มปิด
- ModalProvider ถูกเพิ่มใน root layout เพื่อให้ Header/Footer เข้าถึง context ได้

---

## [2026-02-23] Dependency & Garbage Code Cleanup

### Detailed Logs:
- [2026-02-23T03:07:38+07:00] | File: `components/admin/AnalyticsDashboard.tsx` | Line: 6-8 | Keyword: `Imports` | Status: `Cleaned` | Change: Removed unused imports initially, but restored `ArrowDownRight` and `Plus` after linter flagged them as used. Verified file is free of unused garbage code.
- [2026-02-23T03:07:38+07:00] | File: `components/admin/ArticleManager.tsx` | Line: 58-77 | Keyword: `useCallback` | Status: `Fixed` | Change: Wrapped `fetchArticles` in `useCallback` and added it to `useEffect` dependency array to resolve exhaustive-deps React Hook warning.
- [2026-02-23T03:07:38+07:00] | File: `components/admin/PortfolioManager.tsx` | Line: 51-73 | Keyword: `useCallback` | Status: `Fixed` | Change: Wrapped `fetchPortfolios` in `useCallback` and updated `useEffect` to resolve ESLint exhaustive-deps warning.
- [2026-02-23T03:07:38+07:00] | File: `components/admin/SEOSettings.tsx` | Line: 40-75 | Keyword: `useCallback` | Status: `Fixed` | Change: Wrapped `fetchConfig` in `useCallback` and added it to `useEffect` correctly. Repaired syntax errors caused during replacement logic. Linter is now 100% clean.
- [2026-02-23T03:15:00] | File: AnalyticsDashboard.tsx | Line: ~1100 | Keyword: PDF Generation Fix | Status: Completed | Change: Removed nested portal and used html2canvas onclone to render off-screen component accurately.
- [2026-02-23T03:22:00] | File: Multiple | Line: Multiple | Keyword: Cleanup | Status: Success | Change: Removed unused dependencies (archiver, js-cookie), testing file (tests/ddos-test.js), and cleaned up exported functions/types identified by Knip in lib/utils.ts, lib/seo.ts, and lib/supabase.ts.
- [2026-02-23T03:30:00] | File: AnalyticsDashboard.tsx | Line: ~330 | Keyword: Bug Fix (Accounting PDF Blank) | Status: Success | Change: Fixed the Accounting Report (ทำบัญชี) downloading blank pages. Replaced `html2canvas` `onclone` with direct `element.style.display = 'block'` toggling before capture and `none` after, matching the working fix for the Tax PDF.
- [2026-02-23T03:35:00] | File: AnalyticsDashboard.tsx | Line: ~80, ~800, ~1100 | Keyword: Dynamic Company Info | Status: Success | Change: Connected `site_config` to `fetchAnalytics`. Integrated the dynamic `site_name` and `contact_address` into both the Tax Form and Accounting PDF generation views instead of hardcoded strings.
- [2026-02-23T03:40:00] | File: InvoiceManager.tsx, send-invoice/route.ts, send-receipt/route.ts | Line: Multiple | Keyword: Dynamic Company Info | Status: Success | Change: Updated both Invoice and Receipt generating PDFs and email endpoints to dynamically query `site_name` and `contact_email` from the `site_config` database table instead of displaying hardcoded strings.
- [2026-02-23T03:43:00] | File: InvoiceManager.tsx, AnalyticsDashboard.tsx | Line: Multiple | Keyword: Dynamic Website URL | Status: Success | Change: Swapped the hardcoded `www.nexoralabs.com` website strings in the generated PDF forms to dynamically strip and render from the `.env` variable `NEXT_PUBLIC_SITE_URL`.
- [2026-02-23T04:15:00] | File: `components/sections/PackagesSection.tsx`, `components/admin/InvoiceManager.tsx` | Line: Multiple | Keyword: `Copywriting & Fee logic` | Status: `Success` | Change: Replaced the word 'รายเดือน' with 'ค่าดูแลรายเดือน' in the Packages frontend grid per user request for clarity. Additionally, patched the logic for the Monthly Fee calculation inside `InvoiceManager` to be forcefully collected during the **first installment** instead of the last, updating both the UI hinting and Contract PDF Terms effectively.
- [2026-02-23T04:26:00] | File: `components/admin/InvoiceManager.tsx` | Line: ~1450 | Keyword: `Contract Formalization & Lint Errors` | Status: `Success` | Change: Completely rewrote Contract HTML template in InvoiceManager to be a formal legal agreement (สัญญาจ้างพัฒนาระบบและจัดทำเว็บไซต์) with definitions, comprehensive legal clauses, and formal signatures lines for parties and witnesses. Fixed TypeScript/ESLint errors related to `siteInfo.address` and unescaped entities that arose from this formal phrasing.
- [2026-02-23T20:02:00] | File: `Global ~/.agents/skills` | Line: N/A | Keyword: `Agent Skills` | Status: `Success` | Change: Installed `vercel-labs/next-skills` globally to enhance AI Agent capabilities with Next.js App Router best practices.
- [2026-02-23T20:45:00] | File: `setup_customer_portal.sql`, `lib/auth-context.tsx`, `app/client/*` | Line: Multiple | Keyword: `Customer Portal Phase 1` | Status: `Success` | Change: Engineered the authentication isolation layer. Added `role` checks (`isAdmin`, `isClient`) via Supabase metadata in `auth-context`. Secured `/admin` layout from clients, and created a dedicated `/client` SPA layout and Login component strictly for customers. Generated DB migration script for `client_users` and `support_tickets`.
- [2026-02-23T21:00:00] | File: `components/client/*` | Line: Multiple | Keyword: `Customer Portal Phase 2` | Status: `Success` | Change: Developed core self-service views for clients: `ClientDashboardView` (Live Project Tracker & Payment Alerts), `ClientInvoicesView` (Invoice History & Payment links), and `ClientBackupsView` (Download Pro backups via signed URLs). Added mapping UI in Admin `ClientManager` to simulate sending invitations.
- [2026-02-23T21:15:00] | File: `components/client/ClientSupportView.tsx`, `components/admin/SupportTicketManager.tsx` | Line: Multiple | Keyword: `Customer Portal Phase 3` | Status: `Success` | Change: Implemented a robust Real-Time Support Ticket system. Created the Client-facing tab for opening tickets and chatting, and linked it to the Admin-facing `SupportTicketManager` for managing, filtering, and replying to client requests securely.
- [2026-02-23T21:26:00] | File: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `app/admin/layout.tsx` | Line: Multiple | Keyword: `Unified Login Route` | Status: `Success` | Change: Replaced "Admin" frontend buttons with generic "Login" (เข้าสู่ระบบ). Updated `app/admin/layout.tsx` to redirect authenticated users with the `client` role from `/admin` to `/client`, unifying the login entry point.
- [2026-02-23T21:40:00] | File: `app/login/page.tsx`, `app/admin/layout.tsx`, `app/client/layout.tsx` | Line: Multiple | Keyword: `Centralized Login Page` | Status: `Success` | Change: Created a dedicated Universal Login Route at `/login` with a redesigned generic Nexora Labs UI. Updated Admin and Client layouts to redirect unauthenticated users securely to this new route. Deleted obsolete `LoginPage` components.
- [2026-02-23T21:49:00] | File: `app/login/layout.tsx` | Line: All | Keyword: `Login Context` | Status: `Success` | Change: Created layout wrapper for `/login` injecting `AuthProvider` and `ModalProvider` to resolve Next.js build errors and ensure context availability on static pages.
- [2026-02-23T22:05:00] | File: `app/api/send-invoice/route.ts` | Line: Multiple | Keyword: `Auto-Generate Client Credentials` | Status: `Success` | Change: Upgraded invoice emailing API. If sending the first invoice to an email, the system now automatically generates a Supabase Auth User with a random 8-character password, maps it to a new `clients` profile, and seamlessly injects the Username (Email) and Password into the HTML invoice email sent to the customer.
- [2026-02-23T22:25:00] | File: `app/api/send-invoice/route.ts` | Line: 81 | Keyword: `Cred-Gen Hotfix` | Status: `Success` | Change: Removed invalid `package_details` column from the Supabase `clients` insertion payload to resolve a silent SQL constraint failure that caused auto-generation blocks to be missing from the invoice email templates.
- [2026-02-23T22:35:00] | File: `components/client/ClientDashboardView.tsx`, `components/client/ChangePasswordModal.tsx` | Line: Multiple | Keyword: `Change Password Interface` | Status: `Success` | Change: To complete the auto-generation onboarding flow, integrated a secure UI component for clients to update their passwords directly from the portal using `supabase.auth.updateUser`. Passed Next.js build validation.
- [2026-02-23T22:41:00] | File: `components/client/ClientSupportView.tsx`, `components/admin/SupportTicketManager.tsx` | Line: Multiple | Keyword: `Support Ticket Database Fix` | Status: `Success` | Change: Fixed database schema mismatch where the frontend attempted to insert/query using `client_email` instead of the foreign key `client_id` defined in `support_tickets`. Adjusted the client submission to look up `client_id` via `client_users` and updated the admin dashboard to perform a SQL join on `clients(name)` to display the mapped client correctly.
- [2026-02-23T22:50:00] | File: `components/client/ClientSupportView.tsx`, `components/admin/SupportTicketManager.tsx` | Line: Multiple | Keyword: `Support Reply Database Fix` | Status: `Success` | Change: Fixed another schema mismatch preventing replies from being sending. Changed the frontend payload from `content` to `message` across interfaces, inserts, and mapped renders to align with the actual `support_replies` Supabase table definition.
- [2026-02-23T22:58:00] | File: `components/client/ClientInvoicesView.tsx` | Line: 152 | Keyword: `Payment Link Mismatch` | Status: `Success` | Change: Corrected the payment button URL generated inside the Client Portal. Changed the route from the old `/payment?ref=[id]` format to the correct `/payment/[id]` dynamic Next.js routing schema to match the email links.
- [2026-02-23T23:25:00] | File: `lib/telegram.ts`, `app/api/contact/route.ts`, `app/api/payment-submit/route.ts` | Line: Multiple | Keyword: `Telegram Automation` | Status: `Success` | Change: Built secure server-side routes to notify Admins via Telegram when a new contact lead is submitted or when a payment slip is uploaded. Migrated client components to proxy data through these new API endpoints.
- [2026-02-24T02:34:00] | File: `setup_dynamic_contracts.sql`, `ContractTemplateEditor.tsx`, `ContractGeneratorModal.tsx`, `ContractManager.tsx`, `ClientManager.tsx`, `app/admin/page.tsx` | Line: Multiple | Keyword: `Dynamic Contract Builder` | Status: `Success` | Change: Implemented complete Dynamic Contract Builder system. Created Supabase schema for `contract_templates` and `client_contracts`, built Rich Text Editor with dynamic variable tags (`[CLIENT_NAME]`, `[TOTAL_PRICE]`, etc.), Generator Modal with live preview and auto-replacement, Admin management tab, and per-client contract generation trigger. Installed `react-quill` for WYSIWYG editing. All lint errors resolved, `npm run build` passes cleanly.