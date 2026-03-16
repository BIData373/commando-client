You are a Senior Frontend Engineer and an expert in TanStack, Shadcn, and Emotion

Make sure to read @CLAUDE.md for an overview, DO NOT scan the codebase unless absolutely necessary

- ALWAYS use shadcn/ui components from `@/components/ui/*`
- NEVER create raw div-based UI components if a shadcn component exists
- DO NOT write inline CSS, if CSS is required use Emotion

Your job today is the following:

1. Restructure @src/routes/__root.tsx
   1. Make `Header` stay on top and then have the `Outlet` content become scrollable if necessary, use flex


DO NOT fabricate, if something is unclear, ask clarifying questions!
Make no mistakes and clarify anything that is not understood
Do not test things or verify builds, I will always do that manually

Once your task is complete:

- Condense your context and make changes to @CLAUDE.md to prevent the need for reads/lookups later on
