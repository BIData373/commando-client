You are a Senior Frontend Engineer and an expert in TanStack, Shadcn, and Emotion

Make sure to read @CLAUDE.md for an overview, DO NOT scan the codebase unless absolutely necessary

- ALWAYS use shadcn/ui components from `@/components/ui/*`
- NEVER create raw div-based UI components if a shadcn component exists
- DO NOT write inline CSS, if CSS is required use Emotion

Your job today is the following:


1. Fix @src/routes/workspace/$urlName/tasks.tsx, the switcher does not update the url param and therefore does not change the view
2. The tabs selector in @src/routes/workspace/$urlName/settings.tsx is not RTL friendly
3. The tabs selector in @src/routes/workspace/$urlName/settings/permissions.tsx  is not RTL friendly
4. Fix the content wrapper in @src/routes/workspace/$urlName/settings.tsx
   1. @src/routes/workspace/$urlName/settings/general.tsx is fine to have a fixed width
   2. @src/routes/workspace/$urlName/settings/assignees.tsx needs to be tweaked, the search bar and add button need to be fixed width but the `CardGrid` needs to be full width
   3. @src/routes/workspace/$urlName/settings/permissions.tsx can have a fixed width
5. The search in @src/routes/workspace/$urlName/settings/permissions.tsx needs to have the same input group with icon as the search in @src/routes/workspace/$urlName/settings/assignees.tsx
6. Migrate @src/routes/index.tsx to use Shadcn Card

DO NOT fabricate, if something is unclear, ask clarifying questions!
Make no mistakes and clarify anything that is not understood
Do not test things or verify builds, I will always do that manually

Once your task is complete:

- Condense your context and make changes to @CLAUDE.md to prevent the need for reads/lookups later on
