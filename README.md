# PlatePlay v0.3: Booking Beta & Pilot Management System

> **Cook · Create · Connect**  
> An experiential cooking and social entertainment startup where groups reserve a private, fully equipped kitchen, choose what they want to cook, prepare the food themselves, and enjoy it together.

---

## 🍳 What is PlatePlay?

Restaurants let you eat. Cooking classes let you learn. **PlatePlay lets you create.**

PlatePlay is a new category of experiential dining:
- One booking = One private kitchen = One group.
- Professional induction stations, high-heat stone pizza ovens, and chef cutlery.
- Culinary guides on standby for safety and guidance.
- We handle pantry sourcing, mise-en-place prep, and 100% of the cleanup.

---

## 🚀 What's New in v0.3 (The Booking Beta)

PlatePlay v0.3 introduces a full end-to-end booking-request engine, slot scheduling system, and protected administrative dashboard:

### 1. 📅 6-Step Multi-step Booking Flow (`/book`)
- **Step 1: Experience Package**
  - **PLAY:** ₹599/person (1–2 hrs, guided recipe)
  - **CREATE:** ₹799/person (2–3 hrs, signature ingredient customizer)
  - **UNLEASH:** ₹1,099/person (2–3 hrs, custom approved recipe)
- **Step 2: Pilot Kitchen Selection**
  - **Pizzeria Studio** (Pilot Active)
  - **Masala Kitchen** (Pilot Active)
  - **The Wok** & **Bakehouse** (Roadmap / Future Studios)
- **Step 3: Preferred Date & Session Time**
  - Interactive date selection (Asia/Kolkata timezone)
  - Slot availability checking (11:30–13:30, 14:30–16:30, 17:30–19:30, 20:00–22:00)
- **Step 4: Group & Primary Contact**
  - Group size selector (Default: 4 guests for private studio model)
  - Occasion picker & contact information
- **Step 5: Dietary Preferences & Safety Protocol**
  - Allergen tags (Vegetarian, Jain, Vegan, Gluten-Sensitive, Nut Allergy, Dairy-Sensitive)
  - Custom dish notes from Build-Your-Plate studio
  - Active cooking safety declaration
- **Step 6: Review & Transparent Price Estimate**
  - Total calculation (e.g. 4 guests × ₹799 = ₹3,196; stored in integer paise: 319,600)
  - Pre-launch request submission (no upfront charge)
- **Confirmation Screen:**
  - Generates secure public reference: `PP-BK-XXXXXX`
  - 1-click clipboard copy
  - Direct navigation to Request Tracker

### 2. 🔍 Secure Request Status Tracker (`/booking-status`)
- Look up requests using **both** reference code and customer email (prevents enumeration and protects customer privacy).
- Displays real-time status pill:
  - `PENDING` (Under Review)
  - `APPROVED` (Confirmed & Approved)
  - `DECLINED` (Slot Unavailable)
  - `CANCELLED` (Cancelled)
- Displays package, studio, session date & time, group size, estimated price, and director notes.
- Complete chronological status change audit trail with IST timestamps.

### 3. 🛡️ Protected Administrative Dashboard (`/admin`)
- **Server-Side Authentication:** Protected via NextAuth credentials provider.
- **Overview Dashboard (`/admin`):**
  - Real-time KPI cards: Total Submissions, Pending Review, Approved Requests, Active Slots.
  - Operating Mode Switcher (DEMO / PILOT / LIVE).
  - Recent requests table with quick review actions.
- **Booking Requests (`/admin/bookings`):**
  - Filter by status: ALL, PENDING, APPROVED, DECLINED, CANCELLED.
  - Live search across reference codes, guest names, emails, and kitchens.
  - Comprehensive review modal: approve requests (marks slot booked & triggers confirmation), decline requests, or cancel with internal director notes.
- **Kitchen Slots Management (`/admin/slots`):**
  - View slots by kitchen and date.
  - Create new session slots with customizable start/end times and capacity.
  - 1-click toggle to make available or block slots for maintenance.
- **System Configuration (`/admin/config`):**
  - Operating mode selection (DEMO / PILOT / LIVE).
  - Architecture policies: Asia/Kolkata timezone, exclusive group allocation, PostgreSQL + Prisma ORM status, Resend email status.

### 4. 🗄️ Backend, Database & Service Architecture
- **Prisma Schema (`prisma/schema.prisma`):**
  - `Kitchen`: id, slug, name, description, status (`ACTIVE`, `COMING_SOON`, `CLOSED`)
  - `ExperiencePackage`: id, slug, name, pricePerPersonPaise (integer paise), durationMinutes
  - `KitchenSlot`: id, kitchenId, date, startTime, endTime, status (`AVAILABLE`, `BOOKED`, `BLOCKED`, `PAST`), capacity
  - `BookingRequest`: id, publicReference (`PP-BK-XXXXXX`), kitchenId, packageId, slotId, groupSize, customerName, customerEmail, customerPhone, occasion, dietaryRequirements, dietaryNotes, customDishDetails, estimatedPricePaise, status (`PENDING`, `APPROVED`, `DECLINED`, `CANCELLED`), adminNotes
  - `BookingStatusHistory`: id, bookingId, previousStatus, newStatus, changedAt, changedBy, notes
  - `SiteConfig`: key, value, updatedAt
- **Hybrid Service Layer (`src/lib/pilotService.ts`):**
  - Full Prisma ORM integration ready for PostgreSQL.
  - Automatic persistent JSON data fallback (`pilot-data.json`) ensuring 100% functionality even before a remote PostgreSQL instance is provisioned.
  - Transactional double-booking prevention: approved bookings lock their associated slot.
- **Email Notifications (`src/lib/email.ts`):**
  - Resend integration for Booking Request Received, Approved, Declined, and Cancelled notifications.
  - Gracefully skips without error if `RESEND_API_KEY` is not configured.

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/plateplay?schema=public"

# NextAuth secret & URL
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials
ADMIN_EMAIL="admin@plateplay.com"
ADMIN_PASSWORD_HASH="$2b$12$..."

# Resend Email Integration
RESEND_API_KEY=""
EMAIL_FROM="PlatePlay <hello@plateplay.com>"

# Operating Mode: DEMO | PILOT | LIVE
PLATEPLAY_MODE="DEMO"
```

### Initializing Prisma with PostgreSQL
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

---

## 🎨 Visual Identity

- **Burgundy (`#8C1538`):** Heritage brand identity, primary distinction
- **Flame Orange (`#FF6B3D`):** Culinary energy, interactive highlights, primary CTAs
- **Soft Pink (`#FFB8C8`):** Warm accents, playful touches
- **Warm Cream (`#FFF7F0`):** Main light backgrounds
- **Dark Charcoal (`#211A19`):** Dramatic contrast sections & admin chrome
- **Fonts:** Space Grotesk (display), Plus Jakarta Sans (body), JetBrains Mono (accents)

---

## 🏃 Running the Application

```bash
# Development
npm run dev

# Production Build & Start
npm run build
npm run start
```
