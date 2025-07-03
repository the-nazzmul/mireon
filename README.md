# Mireon

![Mireon Screenshot](https://875p1967n4.ufs.sh/f/l33HWhV9rVqMT1uLc97zxFLVGd48vuJS06bMR7aZoPYHBjWc)

**Mireon** is an AI-powered code intelligence and meeting analysis platform. It enables teams to index, understand, and interact with their GitHub repositories and meetings through natural language. Whether it's code review, onboarding, or documentation, Mireon helps you navigate complex projects faster.

---

## 🔗 Live Application

👉 [Visit Mireon](#) &nbsp; _(https://mireon-nazz.vercel.app/)_

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Examples](#examples)
- [Deployment](#deployment)

---

## ✨ Features

- 🔍 **GitHub Repo Indexing**  
  Index entire repositories and extract semantic context from each file and commit.

- 📜 **Code Summarization**  
  Generate summaries for individual files and commits. Store them as vector embeddings for semantic search.

- 💬 **Natural Language Q&A**  
  Ask questions about your repo and receive context-aware answers powered by AI.

- 🎙️ **Meeting Recording Analysis**  
  Upload recordings and get AI-generated summaries of team discussions and technical decisions.

- 🤖 **Multimodal AI Integration**  
  Uses **Gemini** for code & text comprehension and **AssemblyAI** for transcription and summarization.

- 🔐 **Clerk-Powered Authentication**  
  Secure, user-friendly sign-in and session management.

---

## 🧰 Tech Stack

| Layer              | Tech Used                                   |
| ------------------ | ------------------------------------------- |
| **Frontend**       | React, Next.js, TailwindCSS, Radix UI       |
| **Backend**        | Next.js API Routes, tRPC, Prisma            |
| **Database**       | PostgreSQL (via Prisma ORM and NeonDB)      |
| **AI & NLP**       | Gemini, LangChain, AssemblyAI               |
| **Authentication** | Clerk                                       |
| **Upload**         | UploadThing                                 |
| **Payment**        | Stripe                                      |
| **Dev Tools**      | TypeScript, ESLint, Prettier, Prisma Studio |
| **Hosting**        | Vercel / GitHub Pages (suggested)           |

---

## 🛠️ Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/your-org/mireon.git
cd mireon
bun install # or npm / yarn / pnpm
```

Generate the Prisma client and apply migrations:

```bash
pnpm run db:generate
pnpm run db:push
```

Start development server:

```bash
bun run dev
```

## 🚀 Usage

- Step 1: Authenticate and link your GitHub repository.

- Step 2: Mireon will crawl and summarize each file and commit.

- Step 3: Ask natural language questions or upload meetings for summaries.

- Step 4: Use insights to onboard, document, or explore your repo.

## ⚙️ Configuration

Create a .env file at the root with the following content:

```bash
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/sync-user
GITHUB_TOKEN=
GEMINI_API_KEY=
UPLOADTHING_TOKEN=
NEXT_PUBLIC_UPLOADTHING_URL=<base_url>/api/uploadthing
ASSEMBLYAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=<base_url>
```

Replace the values with your actual credentials. Do not commit your .env file to version control.
