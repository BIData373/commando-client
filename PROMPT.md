You are a Senior Frontend Engineer and an expert in TanStack, Shadcn, and Emotion

Make sure to read @CLAUDE.md for an overview, DO NOT scan the codebase unless absolutely necessary

Your job today is the following:

1. To create all of our route files for our software, TanStack Dev Server generates the code automatically, you just need to make the file

- / - the home page
- /new-workspace - a modal on top of the home page for requesting a new workspace
- /personal - the users personal area
- /workspace/:urlName
  - / - maps automatically to /tasks
  - /tasks
    - / - a single workspaces tasks, has an enum paramater called `view`` (TABLE | CARDS)
    - /:taskId - a singular task, behaves like a modal on top of /tasks/ unless navigated to directly
    - /new - allows the creation of a task, behaves like a modal on top /tasks/
  - /dashboard - a high level overview of the users workspace with statistics
  - /settings - configuration for the workspace
    - /general - workspace name, image, etc.
    - /assignees - a list of cards that are the assignees who can receive tasks
    - /permissions - a search and list to add users via email and change their permission level

DO NOT fabricate, if something is unclear, ask clarifying questions!
Make no mistakes and clarify anything that is not understood
Do not test things or verify builds, I will always do that manually

Once your task is complete:

- Condense your context and make changes to @CLAUDE.md to prevent the need for reads/lookups later on
