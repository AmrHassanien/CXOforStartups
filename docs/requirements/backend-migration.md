# Backend Migration: Manus AI to Self-Owned Stack

## Objective
Migrate the CXO for Startups website backend from Manus AI's proprietary infrastructure to a self-managed stack to ensure data ownership, portability, and independence.

## Replaced Components

| Component | Manus AI (Old) | Self-Owned Stack (New) |
|-----------|----------------|-------------------------|
| **Database** | Managed MySQL | Supabase PostgreSQL |
| **Auth** | Manus OAuth | JWT with Username/Password |
| **Storage** | Manus Storage Proxy | Firebase Storage |
| **LLM API** | LLM Forge | Google Gemini API |
| **Assets** | Manus CDN | Local Assets (`/public/images`) |

## Key Architectural Decisions
1. **Security**: Switched to `bcryptjs` for admin password hashing to ensure secure local authentication without external identity providers.
2. **Persistence**: Migrated Drizzle schema to PostgreSQL to allow hosting on Supabase, which offers a robust free tier and excellent developer tools.
3. **Portability**: Removed all `vite-plugin-manus-runtime` dependencies, allowing the project to run in any standard Node.js/Vite environment.
4. **Resilience**: Stubbed out non-essential Manus AI services (Image Generation, Voice) to prevent runtime crashes while removing dependencies on defunct API keys.

## Implementation Details
- **Auth**: RESTful login/logout endpoints integrated with existing user context.
- **DB**: Centralized `getDb()` helper in `server/db.ts` updated for PostgreSQL.
- **Storage**: Clean `uploadFile` interface in `server/storage.ts` using Firebase Admin SDK.
- **AI**: Gemini integration via `@google/generative-ai` with OpenAI-compatible parameter mapping.
