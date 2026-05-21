# Future Simulation

> **See your future before you live it.**

Future Simulation is an AI-powered web application that helps users make better decisions by simulating **best-case**, **average-case**, and **worst-case** outcomes for any given situation. Built with Next.js 16, Supabase, and the Groq AI API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Development Server](#running-the-development-server)
- [Application Pages & Routes](#application-pages--routes)
- [Architecture Overview](#architecture-overview)
  - [Authentication Flow](#authentication-flow)
  - [Simulation Flow](#simulation-flow)
  - [Database Schema](#database-schema)
- [UI Components](#ui-components)
- [API & Server Actions](#api--server-actions)
- [Security](#security)
- [Deployment](#deployment)

---

## Features

- **AI-Powered Scenario Analysis** — Uses the Groq API (LLaMA 3.3 70B model) to generate realistic future outcomes based on user-provided situations and decisions.
- **Three-Outcome Simulation** — Every simulation produces best-case (🟢), average-case (🟡), and worst-case (🔴) scenarios.
- **User Authentication** — Full email/password and Google OAuth sign-in/sign-up via Supabase Auth.
- **Password Reset** — Users can request password reset emails directly from the login page.
- **Simulation History** — All past simulations are saved per user and can be reviewed at any time.
- **Row-Level Security (RLS)** — Each user can only access their own simulations. Data isolation is enforced at the database level.
- **Premium Dark UI** — Glassmorphism design with subtle gradients, glow effects, and Framer Motion animations.
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile devices.

---

## Tech Stack

| Layer          | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router, React 19)                  |
| **Language**   | TypeScript 5                                                               |
| **Styling**    | Tailwind CSS 4 + shadcn/ui (Radix UI primitives)                          |
| **Animations** | Framer Motion                                                              |
| **Auth & DB**  | [Supabase](https://supabase.com/) (Auth + PostgreSQL)                     |
| **AI Engine**  | [Groq API](https://console.groq.com/) — LLaMA 3.3 70B Versatile          |
| **Icons**      | Lucide React                                                               |
| **Fonts**      | Geist Sans & Geist Mono (via `next/font`)                                 |

---

## Project Structure

```
futuresimulation/
├── app/                            # Next.js App Router
│   ├── page.tsx                    # Landing page (hero, features, preview)
│   ├── layout.tsx                  # Root layout (fonts, metadata, dark theme)
│   ├── globals.css                 # Global styles & Tailwind imports
│   ├── login/
│   │   ├── page.tsx                # Login page
│   │   └── success/page.tsx        # Login success redirect
│   ├── signup/
│   │   ├── page.tsx                # Signup page
│   │   └── success/page.tsx        # Signup success / email confirmation
│   ├── dashboard/
│   │   └── page.tsx                # Authenticated user dashboard
│   └── future-simulator/
│       ├── page.tsx                # Main simulator page (form + results)
│       ├── schema.sql              # Database schema reference
│       ├── README.md               # Feature-specific docs
│       ├── history/
│       │   └── page.tsx            # Simulation history page (server component)
│       ├── _actions/
│       │   └── simulate.ts         # Server actions (runSimulation, fetchSimulations)
│       ├── _components/
│       │   ├── SimulatorForm.tsx    # Decision input form component
│       │   ├── OutcomeCards.tsx     # Results display (3 outcome cards)
│       │   └── HistoryCard.tsx     # Expandable history entry card
│       └── _lib/
│           ├── types.ts            # TypeScript interfaces & types
│           └── supabase.ts         # Server-side Supabase client factory
├── components/
│   ├── login-form.tsx              # Login form with email + Google OAuth
│   ├── signup-form.tsx             # Signup form with profile creation
│   └── ui/                         # shadcn/ui primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── field.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── separator.tsx
├── lib/
│   ├── supabaseClient.ts           # Browser-side Supabase client (singleton)
│   └── utils.ts                    # Utility functions (cn helper)
├── supabase/
│   ├── config.toml                 # Supabase local dev configuration
│   └── migrations/                 # SQL migration files
│       ├── 20260520_auth_profiles.sql
│       ├── 20260521_future_simulations_schema_fix.sql
│       └── 20260521_future_simulations_user_isolation.sql
├── public/                         # Static assets (SVGs)
├── .env.example                    # Environment variable template
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
├── postcss.config.mjs              # PostCSS (Tailwind) config
└── eslint.config.mjs               # ESLint configuration
```

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- A **Supabase** project ([create one free](https://supabase.com/dashboard))
- A **Groq** API key ([get one free](https://console.groq.com/keys))

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Muhammad-Wajahat777/Future-Simulation.git
cd Future-Simulation
npm install
```

All the dependencies will be installed automatically.

### Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Groq AI
GROQ_API_KEY=your_groq_api_key_here

# Optional: override the default model
# GROQ_MODEL=llama-3.3-70b-versatile
```

| Variable                         | Required | Description                                      |
| -------------------------------- | -------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`       | ✅        | Your Supabase project URL                        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | ✅        | Your Supabase anonymous/public key               |
| `GROQ_API_KEY`                   | ✅        | API key from Groq console                        |
| `GROQ_MODEL`                     | ❌        | AI model to use (default: `llama-3.3-70b-versatile`) |

### Database Setup

Run the following SQL in your Supabase SQL Editor (or apply via migrations):

1. **Profiles table** — stores user profile data:

```sql
-- See: supabase/migrations/20260520_auth_profiles.sql
```

2. **Simulations table** — stores simulation records with RLS:

```sql
create table if not exists public.simulations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  situation text not null,
  decisions text[] not null,
  outcomes jsonb not null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.simulations enable row level security;

-- Users can only read their own simulations
create policy "Allow owner read simulations"
  on public.simulations for select
  using (auth.uid() = user_id);

-- Users can only insert their own simulations
create policy "Allow owner insert simulations"
  on public.simulations for insert
  with check (auth.uid() = user_id);

-- Performance indexes
create index if not exists simulations_created_at_idx
  on public.simulations (created_at desc);
create index if not exists simulations_user_id_idx
  on public.simulations (user_id);
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

| Command         | Description                    |
| --------------- | ------------------------------ |
| `npm run dev`   | Start development server       |
| `npm run build` | Create production build         |
| `npm run start` | Start production server         |
| `npm run lint`  | Run ESLint                      |

---

## Application Pages & Routes

| Route                        | Type      | Description                                    |
| ---------------------------- | --------- | ---------------------------------------------- |
| `/`                          | Public    | Landing page with hero, features, and preview  |
| `/login`                     | Public    | Login page (email/password + Google OAuth)      |
| `/login/success`             | Public    | Post-login redirect                             |
| `/signup`                    | Public    | Registration page (name, email, password)       |
| `/signup/success`            | Public    | Email confirmation notice                       |
| `/dashboard`                 | Protected | User dashboard with quick links                |
| `/future-simulator`          | Protected | Main simulation form + results view             |
| `/future-simulator/history`  | Protected | Saved simulation history (server-rendered)      |

---

## Architecture Overview

### Authentication Flow

```
User → Login/Signup Page → Supabase Auth (email or Google OAuth)
   ├── On signup: create profile in `profiles` table
   ├── On login success: redirect to /dashboard
   └── Session managed via Supabase SSR cookies
```

- **Browser-side client** (`lib/supabaseClient.ts`) — used by login/signup forms for auth operations.
- **Server-side client** (`app/future-simulator/_lib/supabase.ts`) — used by server actions to verify user identity and perform database operations with cookie-based auth.

### Simulation Flow

```
1. User fills in situation + decisions (min 3)    → SimulatorForm.tsx
2. Form calls runSimulation() server action        → simulate.ts
3. Server validates input + verifies auth          → Supabase Auth check
4. Server sends prompt to Groq API                 → LLaMA 3.3 70B
5. AI returns JSON: {best_case, average_case, worst_case}
6. Server saves to Supabase `simulations` table    → with user_id
7. Results rendered in OutcomeCards                 → OutcomeCards.tsx
```

**Rate Limiting:** The Groq API call includes automatic retry logic with `Retry-After` header parsing for 429 (rate limit) responses.

### Database Schema

#### `profiles` table
| Column      | Type        | Description              |
| ----------- | ----------- | ------------------------ |
| `id`        | `uuid` (PK) | References `auth.users` |
| `full_name` | `text`      | User's display name     |
| `email`     | `text`      | User's email address    |

#### `simulations` table
| Column       | Type          | Description                                    |
| ------------ | ------------- | ---------------------------------------------- |
| `id`         | `uuid` (PK)   | Auto-generated unique ID                      |
| `user_id`    | `uuid` (FK)   | References `auth.users`, cascades on delete   |
| `situation`  | `text`        | User-described current situation               |
| `decisions`  | `text[]`      | Array of decision options                      |
| `outcomes`   | `jsonb`       | AI-generated outcomes (best/avg/worst)         |
| `created_at` | `timestamptz` | Timestamp of simulation creation               |

---

## UI Components

### Shared Components (`components/`)
| Component       | File               | Description                                      |
| --------------- | ------------------ | ------------------------------------------------ |
| `LoginForm`     | `login-form.tsx`   | Email/password login + Google OAuth + forgot pwd |
| `SignupForm`    | `signup-form.tsx`  | Registration with name, email, password, confirm |
| `Button`        | `ui/button.tsx`    | shadcn/ui button with variants                   |
| `Card`          | `ui/card.tsx`      | shadcn/ui card container                         |
| `Input`         | `ui/input.tsx`     | shadcn/ui text input                             |
| `Label`         | `ui/label.tsx`     | shadcn/ui form label                             |
| `Field`         | `ui/field.tsx`     | shadcn/ui field wrapper with description          |
| `Separator`     | `ui/separator.tsx` | shadcn/ui horizontal/vertical separator           |

### Simulator Components (`app/future-simulator/_components/`)
| Component       | File                 | Description                                            |
| --------------- | -------------------- | ------------------------------------------------------ |
| `SimulatorForm` | `SimulatorForm.tsx`  | Textarea inputs for situation & decisions, submit btn   |
| `OutcomeCards`  | `OutcomeCards.tsx`   | Displays 3 color-coded outcome cards (🟢🟡🔴)          |
| `HistoryCard`   | `HistoryCard.tsx`    | Expandable card showing past simulation details         |

---

## API & Server Actions

All AI and database operations are handled via **Next.js Server Actions** (no separate API routes needed).

### `runSimulation(situation, decisions)`
- **Location:** `app/future-simulator/_actions/simulate.ts`
- **Auth:** Requires authenticated user (checked via Supabase server client)
- **Validation:** Situation must be non-empty, minimum 3 decisions
- **AI Call:** Sends structured prompt to Groq API, parses JSON response
- **Storage:** Saves the result to `simulations` table with the user's ID
- **Returns:** `{ success: true, data: SimulationRecord }` or `{ success: false, error: string }`

### `fetchSimulations()`
- **Location:** `app/future-simulator/_actions/simulate.ts`
- **Auth:** Returns empty array if not authenticated
- **Query:** Fetches user's simulations ordered by `created_at DESC`, limited to 100
- **Returns:** `SimulationRecord[]`

---

## Security

- **Row-Level Security (RLS):** Enabled on the `simulations` table. Users can only `SELECT` and `INSERT` their own records (`auth.uid() = user_id`).
- **Server-side auth verification:** Every server action verifies the user session before processing.
- **API key protection:** `GROQ_API_KEY` is server-only (no `NEXT_PUBLIC_` prefix) — never exposed to the browser.
- **Cookie-based sessions:** Supabase SSR handles secure, httpOnly session cookies.

---

## Deployment

### Vercel (Recommended)

1. Push your repo to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel's dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. Deploy — Vercel auto-detects Next.js and handles everything

### Other Platforms

```bash
npm run build
npm run start
```

Ensure all environment variables are set in your hosting provider's settings.

---

## License

This project is private. All rights reserved.
